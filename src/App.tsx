import { useState } from 'react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MessageSquare } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Añadir mensaje del usuario
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // Llamar al backend en Vercel
      const response = await fetch('https://chatbot-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      const text = data.text || 'No se pudo obtener una respuesta';

      // Añadir mensaje del asistente
      const assistantMessage: Message = { role: 'assistant', content: text };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Mostrar un mensaje de error en el chat
      const errorMessage: Message = { role: 'assistant', content: 'Ocurrió un error al procesar tu mensaje.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-gray-800">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            AI Chat Assistant
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-lg">
          <div className="mb-4 h-[500px] overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Inicia una conversación enviando un mensaje
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))
            )}
          </div>

          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
