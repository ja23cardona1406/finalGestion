import React from 'react';

interface Message {
  type: 'sent' | 'received';
  from?: string;
  to?: string;
  name?: string;
  message: string;
  timestamp: string;
}

interface MessageLogProps {
  messages: Message[];
}

const MessageLog: React.FC<MessageLogProps> = ({ messages }) => {
  // Format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  
  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registro de Mensajes</h2>
      
      {Object.keys(groupedMessages).length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
          No hay mensajes registrados
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="mb-4">
              <div className="text-center">
                <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-700">
                  {date}
                </span>
              </div>
              
              <div className="space-y-3 mt-3">
                {msgs.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`message-bubble ${
                        msg.type === 'sent' ? 'message-sent' : 'message-received'
                      }`}
                    >
                      {msg.type === 'received' && msg.name && (
                        <div className="text-xs text-gray-500 mb-1">
                          {msg.name} ({msg.from})
                        </div>
                      )}
                      <div className="text-sm text-gray-800">
                        {msg.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageLog;