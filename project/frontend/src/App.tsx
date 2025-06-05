import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import QRCodeDisplay from './components/QRCodeDisplay';
import ContactList from './components/ContactList';
import StatusPanel from './components/StatusPanel';
import MessageLog from './components/MessageLog';

// Set the API base URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

interface Message {
  type: 'sent' | 'received';
  from?: string;
  to?: string;
  name?: string;
  message: string;
  timestamp: string;
}

const App: React.FC = () => {
  // State
  const [qrCode, setQrCode] = useState<string>('');
  const [status, setStatus] = useState<string>('disconnected');
  const [contacts, setContacts] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    authorizedContacts: 0,
    unrecognizedQueries: 0,
    faqCount: 0
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  // Connect to socket.io server
  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3001';
    
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for QR code
    socket.on('qr_code', (qrCode: string) => {
      setQrCode(qrCode);
    });

    // Listen for status updates
    socket.on('status_update', (data: any) => {
      setStatus(data.status);
      if (data.stats) {
        setStats({
          authorizedContacts: data.stats.authorizedContacts || 0,
          unrecognizedQueries: data.stats.unrecognizedQueries || 0,
          faqCount: data.stats.faqCount || 0
        });
      }
    });

    // Listen for contacts updates
    socket.on('contacts_update', (contacts: string[]) => {
      setContacts(contacts);
    });

    // Listen for new messages
    socket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Initial data load
    fetchData();

    // Clean up listeners on unmount
    return () => {
      socket.off('qr_code');
      socket.off('status_update');
      socket.off('contacts_update');
      socket.off('new_message');
    };
  }, [socket]);

  // Fetch initial data from API
  const fetchData = async () => {
    try {
      // Get status
      const statusRes = await axios.get(`${API_URL}/status`);
      setStatus(statusRes.data.status);
      if (statusRes.data.stats) {
        setStats({
          authorizedContacts: statusRes.data.stats.authorizedContacts || 0,
          unrecognizedQueries: statusRes.data.stats.unrecognizedQueries || 0,
          faqCount: statusRes.data.stats.faqCount || 0
        });
      }

      // Get contacts
      const contactsRes = await axios.get(`${API_URL}/contacts`);
      setContacts(contactsRes.data.contacts);

      // Get QR code (if available)
      try {
        const qrRes = await axios.get(`${API_URL}/qr`);
        if (qrRes.data.qrCode) {
          setQrCode(qrRes.data.qrCode);
        }
      } catch (error) {
        // QR code may not be available if already authenticated
        console.log('QR code not available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Add a new contact
  const handleAddContact = async (phone: string) => {
    try {
      await axios.post(`${API_URL}/contacts`, { phoneNumber: phone });
      // Contact list will be updated via socket
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Remove a contact
  const handleRemoveContact = async (phone: string) => {
    try {
      await axios.delete(`${API_URL}/contacts/${phone}`);
      // Contact list will be updated via socket
    } catch (error) {
      console.error('Error removing contact:', error);
    }
  };

  // Restart the bot
  const handleRestart = async () => {
    try {
      await axios.post(`${API_URL}/restart`);
      // Status will be updated via socket
    } catch (error) {
      console.error('Error restarting bot:', error);
    }
  };

  // Logout and clear session
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      // Status will be updated via socket
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">
            Bot WhatsApp Agrosoft CM
          </h1>
          <p className="text-gray-600">Sistema Inteligente de Producción Lechera</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <StatusPanel 
              status={status} 
              stats={stats}
              onRestart={handleRestart}
              onLogout={handleLogout}
            />
            <QRCodeDisplay 
              qrCode={qrCode} 
              status={status} 
            />
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            <ContactList 
              contacts={contacts} 
              onAddContact={handleAddContact}
              onRemoveContact={handleRemoveContact}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <MessageLog messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;