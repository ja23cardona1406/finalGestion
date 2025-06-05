import React, { useState } from 'react';

interface ContactListProps {
  contacts: string[];
  onAddContact: (phone: string) => void;
  onRemoveContact: (phone: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  onAddContact, 
  onRemoveContact 
}) => {
  const [newContact, setNewContact] = useState('');
  const [error, setError] = useState('');

  const handleAddContact = () => {
    // Basic validation
    if (!newContact) {
      setError('Por favor ingresa un número de teléfono');
      return;
    }
    
    // Validate phone number format (simple validation)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newContact.replace(/\D/g, ''))) {
      setError('Formato de teléfono inválido. Usa solo números (10-15 dígitos)');
      return;
    }
    
    // Clear error and add contact
    setError('');
    onAddContact(newContact);
    setNewContact('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Contactos Autorizados</h2>
      
      <div className="mb-5">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            placeholder="Ej: 573177325436"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddContact}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            Agregar
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <p className="text-sm text-gray-500 mt-1">
          Formato: código país + número (Ej: 573177325436)
        </p>
      </div>
      
      {contacts.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
          No hay contactos autorizados
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {contacts.map((contact, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">{contact}</span>
              </div>
              <button
                onClick={() => onRemoveContact(contact)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;