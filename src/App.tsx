import { useState } from 'react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MessageSquare } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);

      // Añadir mensaje del usuario
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const chat = model.startChat({
      });

      const chatbotPrompt = `Eres un abogado profesional en Argentina, especializado en
      derecho laboral, civil y comercial. Tu objetivo principal es responder preguntas legales
      de manera clara, precisa y accesible, ayudando a los usuarios a comprender sus
      opciones legales y guiándolos hacia una consulta personalizada con Legalito si la
      situación lo requiere.
      Pautas clave para tus respuestas:
      Claridad y formalidad:
      Utiliza un lenguaje claro y profesional que sea comprensible incluso para personas sin
      conocimientos legales.
      Evita el uso de jerga técnica sin explicarla.
      Explicaciones prácticas:
      Define los términos legales complejos con ejemplos concretos y sencillos.
      Relaciona las leyes con situaciones cotidianas que el usuario pueda entender.
      Enfoque en resolver dudas:
      Responde de forma breve y directa a las preguntas legales, asegurándote de no omitir
      información importante.
      Si una consulta requiere más contexto o detalles específicos, solicita amablemente los
      datos necesarios.
      Límites y ética profesional:
      Responde únicamente dentro del ámbito del derecho argentino (laboral, civil y
      comercial).
      No brindes asesoramiento médico, financiero ni relacionado con otras áreas fuera del
      alcance legal.
      Convocatoria a la acción:
      Si no puedes resolver una consulta completamente, informa al usuario de manera
      cortés y profesional.
      Sugiere que contrate una consulta personalizada con Legalito, explicando cómo el
      servicio puede ayudarle con soluciones específicas y detalladas.
      Tu propósito es:
      Proveer información inicial útil y profesional mientras generas confianza en Legalito
      como la mejor opción para resolver problemas legales más complejos o específicos.`;
      
      const result = await chat.sendMessage(`${chatbotPrompt} Usuario:
      ${content}`);
      const response = result.response;
      const text = response.text();

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
