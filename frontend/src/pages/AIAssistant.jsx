// src/pages/AIAssistantPage.jsx
import React, { useState, useRef, useEffect } from 'react';

// URL Endpoint Chatbot dari teman Anda
const CHATBOT_URL = 'https://yijedoy688-chatbot-ac02-cs386.hf.space/chat'; 

// Data tiruan awal (welcome message dari bot)
const initialMessages = [
  { 
    id: 1, 
    text: "Halo! Saya di sini untuk membantu Anda menganalisis status mesin berdasarkan data sensor. Bagaimana saya bisa membantu Anda?", 
    sender: 'bot',
    type: 'response' // Jenis response standar
  },
];

function AIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    
    // Untuk cepet tampilkan pesan pengguna segera
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true); // Mulai indikator typingnya

    try {
      // 1. Kirim POST request ke endpoint Chatbot
      const response = await fetch(CHATBOT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 2. Proses response JSON
      const data = await response.json();
      let botResponseText = '';
      let responseType = 'response'; // Default type

      if (data.status === 'success') {
        if (data.response) {
            // Respons untuk sapaan ('halo') atau pertanyaan umum
            botResponseText = data.response;
        } else if (data.status_mesin) {
            // Respons terstruktur untuk status mesin
            responseType = 'structured';
            
            botResponseText = `
                ⚙️ Status Mesin: ${data.status_mesin}
                ${data.jenis_kegagalan ? `⚠️ Kegagalan: ${data.jenis_kegagalan}` : '✅ Tidak ada kegagalan spesifik.'}
            `;
        } else {
             botResponseText = "Saya menerima respons yang tidak terduga dari server.";
        }
      } else {
        botResponseText = data.message || "Gagal mendapatkan respons dari Chatbot.";
      }
      
      // 3. Tampilkan pesan Bot
      const botMessage = { 
          id: Date.now() + 1, 
          text: botResponseText, 
          sender: 'bot',
          type: responseType // Terapkan jenis respons
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = { 
          id: Date.now() + 1, 
          text: `Error jaringan/server: ${error.message}`, 
          sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Akhiri indikator typing
    }
  };

  // Komponen pembantu untuk menampilkan pesan
  const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    let bubbleClass = isBot 
        ? 'bg-gray-100 text-gray-800 self-start rounded-tl-none' 
        : 'bg-primary text-white self-end rounded-tr-none';
        
    // Styling khusus untuk respons terstruktur
    if (isBot && message.type === 'structured') {
         bubbleClass = 'bg-yellow-50 text-gray-800 self-start rounded-tl-none border-l-4 border-yellow-500 font-mono whitespace-pre-wrap';
    } else if (isBot) {
         bubbleClass += ' whitespace-pre-wrap'; // Pertahankan format baris baru
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
            <h3 className="font-semibold text-gray-800">Predictive Chatbot</h3>
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
            placeholder="Tanyakan status mesin atau data sensor..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`px-4 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center ${
                isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'
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