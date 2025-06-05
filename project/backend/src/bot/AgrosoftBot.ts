
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';
import * as similarity from 'string-similarity';
import { faqCorpus, casualResponses } from './faqData';
import { EventEmitter } from 'events';

class AgrosoftBot extends EventEmitter {
  private client: Client;
  private authorizedContacts: Set<string> = new Set();
  private authorizedContactsFile: string;
  private unrecognizedQueries: any[] = [];
  private qrCode: string = '';
  private connectionStatus: string = 'disconnected';
  private sessionActive: boolean = false;

  constructor() {
    super();
    
    this.client = new Client({
      authStrategy: new LocalAuth({ 
        dataPath: path.join(__dirname, '../../whatsapp-session') 
      }),
      puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // Setup data folder and files
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.authorizedContactsFile = path.join(dataDir, 'authorized-contacts.json');
    this.loadAuthorizedContacts();
    this.initializeBot();
  }

  // Helper functions for error handling
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private getErrorObject(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(String(error));
  }

  private loadAuthorizedContacts() {
    try {
      if (fs.existsSync(this.authorizedContactsFile)) {
        const data = fs.readFileSync(this.authorizedContactsFile, 'utf8');
        const contacts = JSON.parse(data);
        this.authorizedContacts = new Set(contacts.map((num: string) => num.replace(/\D/g, '')));
      } else {
        // Si no existe el archivo, crear con números por defecto
        const defaultContacts = [
          '573177325436',
          '573122446305', 
          '573158603306'
        ];
        this.authorizedContacts = new Set(defaultContacts);
        this.saveAuthorizedContacts();
      }

      console.log(`Loaded ${this.authorizedContacts.size} authorized contacts`);
    } catch (error) {
      console.error('Error loading contacts:', this.getErrorMessage(error));
      // Fallback a números por defecto si hay error
      this.authorizedContacts = new Set([
        '573177325436',
        '573122446305', 
        '573158603306'
      ]);
    }
  }

  private saveAuthorizedContacts() {
    try {
      fs.writeFileSync(
        this.authorizedContactsFile, 
        JSON.stringify(Array.from(this.authorizedContacts), null, 2)
      );
    } catch (error) {
      console.error('Error saving contacts:', this.getErrorMessage(error));
    }
  }

  // Getter dinámico para target numbers basado en contactos autorizados
  private getTargetNumbers(): string[] {
    return Array.from(this.authorizedContacts);
  }

  private initializeBot() {
    this.client.on('qr', (qr) => {
      this.qrCode = qr;
      this.connectionStatus = 'qr_received';
      
      console.log('QR Code received:');
      qrcode.generate(qr, { small: true });
      
      // Emit QR code event for frontend
      this.emit('qr', qr);
    });

    this.client.on('ready', () => {
      this.sessionActive = true;
      this.connectionStatus = 'connected';
      console.log('Bot ready and connected!');
      
      // Send welcome messages to target numbers
      this.sendWelcomeMessages();
      
      // Emit ready event for frontend
      this.emit('ready');
    });

    this.client.on('authenticated', () => {
      this.connectionStatus = 'authenticated';
      console.log('Bot authenticated');
      this.emit('authenticated');
    });

    this.client.on('auth_failure', (err) => {
      this.connectionStatus = 'auth_failed';
      console.error('Authentication failed:', this.getErrorMessage(err));
      this.emit('auth_failure', this.getErrorObject(err));
    });

    this.client.on('disconnected', (reason) => {
      this.sessionActive = false;
      this.connectionStatus = 'disconnected';
      console.log('Bot disconnected:', reason);
      this.emit('disconnected', reason);
    });

    this.client.on('message', async (msg) => {
      await this.handleIncomingMessage(msg);
    });

    // Initialize client
    try {
      this.client.initialize();
    } catch (error) {
      console.error('Error initializing client:', this.getErrorMessage(error));
      this.emit('error', this.getErrorObject(error));
    }
  }

  private async sendWelcomeMessages() {
    const welcomeMsg = `🐄 ¡Hola! Soy el asistente de *Agrosoft CM*

Nuestro Sistema Inteligente de Producción Lechera puede ayudarte a:
• 📈 Aumentar tu producción hasta un 15%
• 📊 Obtener predicciones precisas
• 💰 Reducir costos operativos

¿En qué puedo ayudarte hoy?`;
    
    // Cargar imagen promocional
    let promotionalImage = null;
    try {
      const imagePath = path.join(process.cwd(), 'src', 'assets', 'agrosoft-promo.jpg')
      if (fs.existsSync(imagePath)) {
        promotionalImage = MessageMedia.fromFilePath(imagePath);
      } else {
        console.log('⚠️ Imagen promocional no encontrada, enviando solo texto');
      }
    } catch (error) {
      console.log('⚠️ Error cargando imagen:', this.getErrorMessage(error));
    }
    
    const targetNumbers = this.getTargetNumbers();
    
    for (const number of targetNumbers) {
      try {
        // Enviar imagen si está disponible
        if (promotionalImage) {
          await this.client.sendMessage(`${number}@c.us`, promotionalImage, { caption: welcomeMsg });
          console.log(`Welcome message with image sent to ${number}`);
        } else {
          // Enviar solo texto si no hay imagen
          await this.client.sendMessage(`${number}@c.us`, welcomeMsg);
          console.log(`Welcome message (text only) sent to ${number}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error sending to ${number}:`, this.getErrorMessage(error));
      }
    }
  }

  private async handleIncomingMessage(msg: any) {
    if (msg.fromMe) return;

    const senderNumber = msg.from.replace('@c.us', '');
    if (!this.isAuthorizedContact(senderNumber)) {
      console.log(`Message from ${senderNumber} not authorized`);
      this.emit('unauthorized_message', { number: senderNumber });
      return;
    }

    try {
      const contact = await msg.getContact();
      const userName = contact.pushname || 'Usuario';
      const userMessage = msg.body.toLowerCase().trim();

      // Log the message for the frontend
      this.emit('message_received', {
        from: senderNumber,
        name: userName,
        message: msg.body,
        timestamp: new Date().toISOString()
      });

      // Check for casual responses first
      const casualResponse = this.getCasualResponse(userMessage);
      if (casualResponse) {
        await msg.reply(casualResponse);
        this.emit('message_sent', {
          to: senderNumber,
          message: casualResponse,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Look for FAQ response
      const response = this.findBestResponse(userMessage);
      if (response) {
        await msg.reply(response);
        this.emit('message_sent', {
          to: senderNumber,
          message: response,
          timestamp: new Date().toISOString()
        });
      } else {
        // Generic response for unrecognized queries
        const genericResponse = this.getGenericResponse(userName);
        await msg.reply(genericResponse);
        this.emit('message_sent', {
          to: senderNumber,
          message: genericResponse,
          timestamp: new Date().toISOString()
        });
        
        this.logUnrecognizedQuery(userMessage, userName);
      }
    } catch (error) {
      console.error('Error handling message:', this.getErrorMessage(error));
      this.emit('error', this.getErrorObject(error));
    }
  }

  private getCasualResponse(message: string): string | null {
    for (const [pattern, response] of casualResponses) {
      if (new RegExp(pattern, 'i').test(message)) {
        return typeof response === 'function' ? response() : response;
      }
    }
    return null;
  }

  private findBestResponse(message: string): string | null {
    let bestMatch = null;
    let highestScore = 0.3; // Minimum threshold for similarity

    for (const item of faqCorpus) {
      let maxSimilarity = 0;
      
      // Check similarity with each keyword
      for (const keyword of item.keywords) {
        const similarityScore = similarity.compareTwoStrings(message, keyword);
        maxSimilarity = Math.max(maxSimilarity, similarityScore);
      }
      
      // Also check similarity with the full question
      const questionSimilarity = similarity.compareTwoStrings(message, item.question.toLowerCase());
      maxSimilarity = Math.max(maxSimilarity, questionSimilarity);
      
      if (maxSimilarity > highestScore) {
        highestScore = maxSimilarity;
        bestMatch = item;
      }
    }

    return bestMatch ? bestMatch.answer : null;
  }

  private getGenericResponse(userName: string): string {
    return `🤔 Disculpa ${userName}, no entendí completamente tu pregunta.

Puedes preguntarme sobre:
• ¿Qué es Agrosoft CM?
• Precios y planes
• Cómo funciona la IA
• Beneficios del sistema
• Demo gratuita
• Requisitos técnicos

O simplemente escribe: "información", "demo" o "precios"`;
  }

  private logUnrecognizedQuery(query: string, user: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user,
      query
    };
    
    this.unrecognizedQueries.push(logEntry);
    
    // Emit for the frontend
    this.emit('unrecognized_query', logEntry);
  }

  // Public methods for controlling the bot
  
  public isAuthorizedContact(phoneNumber: string): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return this.authorizedContacts.has(cleanNumber);
  }

  public authorizeContact(phoneNumber: string): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    this.authorizedContacts.add(cleanNumber);
    this.saveAuthorizedContacts();
    this.emit('contact_authorized', cleanNumber);
    
    // Enviar mensaje de bienvenida al nuevo contacto autorizado
    this.sendWelcomeToNewContact(cleanNumber);
    
    return true;
  }

  public removeAuthorizedContact(phoneNumber: string): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (this.authorizedContacts.has(cleanNumber)) {
      this.authorizedContacts.delete(cleanNumber);
      this.saveAuthorizedContacts();
      this.emit('contact_removed', cleanNumber);
      return true;
    }
    return false;
  }

  // Método para enviar mensaje de bienvenida a un contacto específico
  private async sendWelcomeToNewContact(phoneNumber: string) {
    if (!this.sessionActive) return;

    const welcomeMsg = `🐄 ¡Hola! Soy el asistente de *Agrosoft CM*

Nuestro Sistema Inteligente de Producción Lechera puede ayudarte a:
• 📈 Aumentar tu producción hasta un 15%
• 📊 Obtener predicciones precisas
• 💰 Reducir costos operativos

¿En qué puedo ayudarte hoy?`;

    // Cargar imagen promocional
    let promotionalImage = null;
    try {
      const imagePath = path.join(__dirname, 'assets', 'agrosoft-promo.jpg');
      if (fs.existsSync(imagePath)) {
        promotionalImage = MessageMedia.fromFilePath(imagePath);
      } else {
        console.log('⚠️ Imagen promocional no encontrada para nuevo contacto, enviando solo texto');
      }
    } catch (error) {
      console.log('⚠️ Error cargando imagen para nuevo contacto:', this.getErrorMessage(error));
    }

    try {
      // Enviar imagen si está disponible
      if (promotionalImage) {
        await this.client.sendMessage(`${phoneNumber}@c.us`, promotionalImage, { caption: welcomeMsg });
        console.log(`Welcome message with image sent to new contact: ${phoneNumber}`);
      } else {
        // Enviar solo texto si no hay imagen
        await this.client.sendMessage(`${phoneNumber}@c.us`, welcomeMsg);
        console.log(`Welcome message (text only) sent to new contact: ${phoneNumber}`);
      }
      this.emit('welcome_sent', phoneNumber);
    } catch (error) {
      console.error(`Error sending welcome to ${phoneNumber}:`, this.getErrorMessage(error));
    }
  }

  // Método para enviar mensaje broadcast a todos los contactos autorizados
  public async sendBroadcastMessage(message: string): Promise<void> {
    if (!this.sessionActive) {
      console.error('Bot is not active, cannot send broadcast');
      return;
    }

    const targetNumbers = this.getTargetNumbers();
    
    for (const number of targetNumbers) {
      try {
        await this.client.sendMessage(`${number}@c.us`, message);
        console.log(`Broadcast message sent to ${number}`);
        this.emit('broadcast_sent', { number, message });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between messages
      } catch (error) {
        console.error(`Error sending broadcast to ${number}:`, this.getErrorMessage(error));
        this.emit('broadcast_error', { number, error: this.getErrorObject(error) });
      }
    }
  }

  public getAuthorizedContacts(): string[] {
    return Array.from(this.authorizedContacts);
  }

  public getQRCode(): string {
    return this.qrCode;
  }

  public getStatus(): string {
    return this.connectionStatus;
  }

  public isActive(): boolean {
    return this.sessionActive;
  }

  public getStats(): any {
    return {
      authorizedContacts: this.authorizedContacts.size,
      targetNumbers: this.getTargetNumbers().length,
      faqCount: faqCorpus.length,
      unrecognizedQueries: this.unrecognizedQueries.length,
      status: this.connectionStatus,
      isActive: this.sessionActive
    };
  }

  public async logout(): Promise<void> {
    if (this.client && this.sessionActive) {
      await this.client.logout();
      this.sessionActive = false;
      this.connectionStatus = 'logged_out';
      this.emit('logged_out');
    }
  }

  public async restart(): Promise<void> {
    if (this.client) {
      try {
        await this.client.destroy();
        this.client = new Client({
          authStrategy: new LocalAuth({ 
            dataPath: path.join(__dirname, '../../whatsapp-session') 
          }),
          puppeteer: { 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          }
        });
        this.initializeBot();
        this.emit('restarted');
      } catch (error) {
        console.error('Error restarting client:', this.getErrorMessage(error));
        this.emit('error', this.getErrorObject(error));
      }
    }
  }
}

export default AgrosoftBot;