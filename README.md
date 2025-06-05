# finalGestion
Bot WhatsApp Agrosoft CM - Sistema Inteligente de Producción Lechera
Descripción del Proyecto
Este bot de WhatsApp fue desarrollado para Agrosoft CM, un sistema inteligente de producción lechera que utiliza inteligencia artificial para optimizar la ganadería. El bot actúa como asistente virtual para responder consultas sobre el sistema, promocionar sus beneficios y ofrecer demos gratuitas a potenciales clientes del sector ganadero.
Funcionamiento del Bot
Contextualización
El bot funciona como un asistente comercial automatizado que:

Se conecta a WhatsApp mediante un código QR
Envía mensajes de bienvenida automáticamente a una lista de números objetivo (ganaderos potenciales)
Responde preguntas sobre Agrosoft CM usando procesamiento de lenguaje natural
Maneja conversaciones casuales con respuestas predefinidas
Solo responde a contactos autorizados para evitar spam

Flujo de Operación
Usuario escanea QR → Bot se conecta → Envía mensajes promocionales → 
Recibe consultas → Procesa con PLN → Responde automáticamente
Componente de Procesamiento de Lenguaje Natural (PLN)
Técnicas Implementadas
1. Algoritmo Jaro-Winkler para Similitud Semántica
typescript// Uso del algoritmo para comparar mensajes del usuario con FAQs
const similarity = require('string-similarity');
const similarityScore = similarity.compareTwoStrings(userMessage, keyword);

Propósito: Medir similitud entre el mensaje del usuario y las palabras clave del corpus
Umbral: 30% mínimo de similitud para considerar una coincidencia
Ventaja: Funciona bien con errores de tipeo y sinónimos

2. Sistema de Coincidencia por Palabras Clave
typescriptconst faqCorpus = [
    {
        keywords: ['que es', 'agrosoft', 'sistema', 'que hace'],
        question: '¿Qué es Agrosoft CM?',
        answer: '🐄 Agrosoft CM es un Sistema Inteligente...'
    }
];

Múltiples keywords por cada FAQ para mayor cobertura
Comparación tanto con keywords como con la pregunta completa
Selección de la respuesta con mayor puntaje de similitud

3. Respuestas Casuales con Expresiones Regulares
typescriptconst casualResponses: [string, string | (() => string)][] = [
    ['hola|buenos días|buenas tardes', '¡Hola! 😊 ¿En qué puedo ayudarte hoy?'],
    ['cómo estás|qué tal', '¡Estoy muy bien, gracias por preguntar!']
];

Patrones regex para detectar saludos y conversación casual
Respuestas dinámicas que pueden incluir funciones
Prioridad sobre FAQs técnicas para naturalidad en la conversación

Arquitectura del Procesamiento
typescript// 1. Verificación de respuesta casual
const casualResponse = this.getCasualResponse(userMessage);
if (casualResponse) return casualResponse;

// 2. Búsqueda en corpus de FAQs
const response = this.findBestResponse(userMessage);
if (response) return response;

// 3. Respuesta genérica si no encuentra coincidencia
return this.getGenericResponse(userName);
Arquitectura Técnica
Backend (Node.js + TypeScript)

Express.js: Servidor web y API REST
whatsapp-web.js: Integración con WhatsApp Web
string-similarity: Algoritmo Jaro-Winkler para PLN
Persistencia: Archivos JSON para contactos autorizados

Frontend (React + TypeScript)

React: Interfaz de usuario reactiva
Tailwind CSS: Estilos modernos y responsivos
Socket.io: Comunicación en tiempo real con el backend
Componentes: QRCode, Lista de contactos, Panel de estado

Estructura del Proyecto
agrosoft-whatsapp-simple/
├── backend/
│   ├── src/
│   │   ├── bot/
│   │   │   ├── AgrosoftBot.ts       # Lógica principal del bot
│   │   │   └── faqData.ts           # Corpus de preguntas y respuestas
│   │   ├── server.ts                # Servidor Express
│   │   └── routes.ts                # Rutas API
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRCodeDisplay.tsx    # Componente para mostrar QR
│   │   │   ├── ContactList.tsx      # Lista de contactos
│   │   │   └── StatusPanel.tsx      # Panel de estado
│   │   └── App.tsx                  # Componente principal
└── README.md
Instalación y Uso
Requisitos Previos

Node.js 16+
npm o yarn
WhatsApp instalado en el teléfono

Instalación
bash# Clonar el repositorio
git clone <repository-url>
cd agrosoft-whatsapp-simple

# Instalar dependencias
npm install
npm run dev
Configuración

Ejecutar el proyecto: npm run dev
Escanear QR: Usar WhatsApp para escanear el código QR
Agregar contactos: Usar la interfaz web para autorizar números
El bot comenzará a funcionar automáticamente

Corpus de Conocimiento
El bot maneja 8 categorías principales de consultas:

¿Qué es Agrosoft CM? - Descripción del sistema
Precios y planes - Información comercial ($299k - $999k/mes)
Inteligencia Artificial - Explicación de los 4 algoritmos usados
Beneficios - Aumento de producción 8-15%, reducción de costos
Demo gratuita - Prueba de 30 días sin compromiso
Requisitos técnicos - Especificaciones mínimas
Soporte - Capacitación y asistencia técnica
Contacto - Información de la empresa

Características Principales

Sin autenticación: Sistema plug-and-play
Contactos autorizados: Solo responde a números específicos
PLN inteligente: Entiende variaciones y errores de tipeo
Respuestas contextuales: Diferencia entre consultas técnicas y casuales
Interfaz moderna: Dashboard en tiempo real
Escalable: Fácil agregar nuevas FAQs y contactos

Personalización
Agregar nuevas FAQs
typescript// En faqData.ts
{
    keywords: ['nueva', 'funcionalidad', 'caracteristica'],
    question: '¿Qué nueva funcionalidad tiene?',
    answer: 'Respuesta detallada sobre la nueva funcionalidad...'
}
Modificar números objetivo
typescript// En AgrosoftBot.ts
this.targetNumbers = [
    '573177325436', // Nuevo número
    '573122446305'  // Otro número
];
Métricas y Monitoreo
El bot registra automáticamente:

Consultas no reconocidas para mejorar el corpus
Estadísticas de uso y contactos autorizados
Log de actividad en tiempo real
Estado de conexión con WhatsApp


Desarrollado para promoción del Sistema Agrosoft CM
Optimizando la producción lechera con Inteligencia Artificial 
