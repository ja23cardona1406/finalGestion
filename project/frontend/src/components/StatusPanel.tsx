import React from 'react';

interface StatusPanelProps {
  status: string;
  stats: {
    authorizedContacts: number;
    unrecognizedQueries: number;
    faqCount: number;
  };
  onRestart: () => void;
  onLogout: () => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ 
  status, 
  stats, 
  onRestart,
  onLogout
}) => {
  // Map status to display text and color
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return { 
          text: 'Conectado', 
          statusClass: 'status-connected',
          bgClass: 'bg-green-100',
          textClass: 'text-green-800'
        };
      case 'authenticated':
        return { 
          text: 'Autenticado', 
          statusClass: 'status-connected',
          bgClass: 'bg-green-100',
          textClass: 'text-green-800'
        };
      case 'disconnected':
        return { 
          text: 'Desconectado', 
          statusClass: 'status-disconnected',
          bgClass: 'bg-red-100',
          textClass: 'text-red-800'
        };
      case 'auth_failed':
        return { 
          text: 'Error de autenticación', 
          statusClass: 'status-disconnected',
          bgClass: 'bg-red-100',
          textClass: 'text-red-800'
        };
      default:
        return { 
          text: 'Conectando...', 
          statusClass: 'status-connecting',
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado del Bot</h2>
      
      <div className={`${statusInfo.bgClass} ${statusInfo.textClass} px-4 py-3 rounded-lg flex items-center mb-4`}>
        <span className={`status-indicator ${statusInfo.statusClass}`}></span>
        <span className="font-medium">{statusInfo.text}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.authorizedContacts}</p>
          <p className="text-sm text-gray-600">Contactos</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.faqCount}</p>
          <p className="text-sm text-gray-600">Preguntas FAQ</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onRestart}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Reiniciar
        </button>
        <button
          onClick={onLogout}
          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default StatusPanel;