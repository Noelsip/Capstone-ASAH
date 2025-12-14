// src/pages/AIAssistantPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 


const BASE_URL = 'http://localhost:3000';
const CHATBOT_API_ENDPOINT = '/chatbot/message'; 

const initialMessages = [
 { 
  id: 1, 
  text: "Halo! Saya di sini untuk membantu Anda menganalisis status mesin berdasarkan data sensor. Bagaimana saya bisa membantu Anda?", 
  sender: 'bot',
  type: 'response' 
 },
];

function AIAssistantPage() {


 const [messages, setMessages] = useState(initialMessages);
 const [input, setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const messagesEndRef = useRef(null);

 // State Konteks
 const [activeMachineSerial, setActiveMachineSerial] = useState('MACHINE_001'); 
 const [activeConversationId, setActiveConversationId] = useState(null); 
    
 const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };
 useEffect(scrollToBottom, [messages]);


 const handleSendMessage = async (e) => {
  e.preventDefault();
  const userMessageText = input.trim();
  if (!userMessageText) return;

  // ❗ MODIFIKASI: Hapus pemeriksaan dan redirect token
    // Kita tetap mencoba mendapatkan token, tetapi TIDAK WAJIBKAN
  const token = localStorage.getItem('authToken');
  
  const userMessage = { id: Date.now(), text: userMessageText, sender: 'user' };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  try {
const payload = {
 message: userMessageText, 
 machine_serial: activeMachineSerial, 
 ...(activeConversationId && { conversation_id: activeConversationId }) 
};

      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

// 3. Kirim POST request ke endpoint Backend Anda
const response = await fetch(`${BASE_URL}${CHATBOT_API_ENDPOINT}`, {
 method: 'POST',
 headers: headers,
 body: JSON.stringify(payload),
});

if (!response.ok) {
 throw new Error(`Gagal berkomunikasi dengan backend. Status: ${response.status}`);
}
const data = await response.json();
let botResponseText = '';
let responseType = 'response';


if (data.conversation_id && !activeConversationId) {
 setActiveConversationId(data.conversation_id);
}

const aiResponse = data.ai_response || {}; 

if (data.status === 'success' || data.ai_response) {
 if (aiResponse.response) {
botResponseText = aiResponse.response;
 } else if (aiResponse.status_mesin) {
responseType = 'structured';
botResponseText = `
  ⚙️ Status Mesin: ${aiResponse.status_mesin}
  ${aiResponse.jenis_kegagalan ? `⚠️ Kegagalan: ${aiResponse.jenis_kegagalan}` : '✅ Tidak ada kegagalan spesifik.'}
`;
 } else {
botResponseText = data.message || "Respons Chatbot diterima, tapi format tidak dikenal.";
 }
} else {
 botResponseText = data.message || "Gagal mendapatkan respons dari Chatbot.";
}

const botMessage = { 
  id: Date.now() + 1, 
  text: botResponseText, 
  sender: 'bot',
  type: responseType 
};
setMessages(prev => [...prev, botMessage]);

  } catch (error) {
console.error("Error berkomunikasi:", error);
const errorMessage = { 
  id: Date.now() + 1, 
  text: `Error: ${error.message}. Cek console untuk detail.`, 
  sender: 'bot' 
};
setMessages(prev => [...prev, errorMessage]);
  } finally {
setIsTyping(false);
  }
 };

 const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  let bubbleClass = isBot 
 ? 'bg-gray-100 text-gray-800 self-start rounded-tl-none' 
 : 'bg-green-600 text-white self-end rounded-tr-none';
 
  if (isBot && message.type === 'structured') {
 bubbleClass = 'bg-yellow-50 text-gray-800 self-start rounded-tl-none border-l-4 border-yellow-500 font-mono whitespace-pre-wrap';
  } else if (isBot) {
 bubbleClass += ' whitespace-pre-wrap';
  }

  return (
<div className={`max-w-3/4 p-3 rounded-xl shadow-md my-2 ${bubbleClass}`}>
 {message.text}
</div>
  );
 };


 return (
  <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

{/* HEADER */}
<div className="p-4 border-b flex items-center bg-gray-50">
 <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">AI</div>
 <div>
<h3 className="font-semibold text-gray-800">Predictive Chatbot (Mesin: {activeMachineSerial})</h3>
<p className="text-xs text-gray-500">{isTyping ? 'Typing...' : 'Online'}</p>
 </div>
</div>

{/* CHAT AREA */}
<div className="flex-1 p-6 space-y-4 overflow-y-auto">
 {messages.map(msg => (
  <MessageBubble key={msg.id} message={msg} />
 ))}
 {isTyping && (
<MessageBubble message={{ text: '...', sender: 'bot' }} />
 )}
 <div ref={messagesEndRef} />
</div>

{/* INPUT FORM */}
<div className="p-4 border-t bg-gray-50">
 <form onSubmit={handleSendMessage} className="flex space-x-3">
  <input
type="text"
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder={`Tanyakan tentang ${activeMachineSerial}...`}
className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600"
disabled={isTyping}
  />
  <button
type="submit"
className={`px-4 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center ${
  isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
}`}
disabled={isTyping}
  >
{isTyping ? (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
) : (
  'Send'
)}
  </button>
 </form>
</div>
  </div>
 );
}

export default AIAssistantPage;