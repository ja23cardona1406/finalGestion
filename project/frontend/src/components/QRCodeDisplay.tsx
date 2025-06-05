import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeDisplayProps {
  qrCode: string;
  status: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, status }) => {
  // Only show QR code when we have one and are not connected
  const showQR = qrCode && status !== 'connected' && status !== 'authenticated';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conexión WhatsApp</h2>
      
      {showQR ? (
        <div className="flex flex-col items-center">
          <div className="border-4 border-green-500 rounded-lg p-4 bg-white mb-4">
            <QRCode 
              value={qrCode} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Escanea este código QR con tu teléfono para conectar WhatsApp
          </p>
        </div>
      ) : status === 'connected' || status === 'authenticated' ? (
        <div className="flex items-center justify-center p-6">
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <span className="status-indicator status-connected"></span>
            <span className="font-medium">WhatsApp conectado correctamente</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-6">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg flex items-center">
            <span className="status-indicator status-connecting"></span>
            <span className="font-medium">Esperando código QR...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;