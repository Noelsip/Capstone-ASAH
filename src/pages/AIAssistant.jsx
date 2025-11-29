
import React, { useState, useRef } from 'react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

// Data buatan untuk riwayat obrolan
const initialMessages = [
  { id: 1, text: "Selamat sore! Saya dapat membantu Anda dengan status diagnostik peralatan Anda.", sender: 'assistant', time: '05:45 PM' },
  { id: 2, text: "Berapa total jam operasional Pump #A-001?", sender: 'user', time: '08:46 PM' },
  { id: 3, text: "Pump #A-001 telah beroperasi selama 4,120 jam dan saat ini berada dalam kondisi Normal.", sender: 'assistant', time: '05:47 PM' },
];

const welcomeTopics = [
    'Status dan diagnostik peralatan',
    'Penjadwalan pemeliharaan',
    'Analisis peringatan dan rekomendasi',
    'Metrik dan laporan kinerja',
];


const ChatBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    
    return (
        <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            
            {}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-1 shadow-md text-lg">
                    🤖
                </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm shadow-lg 
                            ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
                {message.text}
                <span className={`block mt-1 text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'} text-right`}>{message.time}</span>
            </div>
        </div>
    );
};

function AIAssistantPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); 
    
    const fileInputRef = useRef(null); 

    const handleSend = (e) => {
        e.preventDefault();
        
        if (input.trim() === '' && !selectedFile) return;

        const textToSend = selectedFile 
            ? `(File terlampir: ${selectedFile.name}) ${input}` 
            : input.trim();

        const newMessage = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
        
        setMessages([...messages, newMessage]);
        console.log('Data yang dikirim:', { message: textToSend, file: selectedFile });
        
        setInput('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null; 
        }
    };
    
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[calc(100vh-140px)] flex flex-col">
            
            {/* Header Chat */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div>
                    <h3 className="text-xl font-bold text-primary">AI Assistant</h3>
                    <p className="text-sm text-green-600">
                        • Online and ready to help
                    </p>
                </div>
                <span className="text-xs text-gray-500">05:45 PM</span>
            </div>

            {/* Riwayat Obrolan (Area Scrollable) */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white"> 
                
                {/* Bagian Selamat Datang dan Topik Bantuan */}
                <div className="mb-6 p-4 rounded-lg bg-blue-50 shadow-inner border border-blue-100 text-gray-700">
                    <p className="font-semibold text-gray-800 mb-2">Saya dapat membantu Anda dengan:</p>
                    <ul className="text-sm list-disc list-inside text-gray-600 space-y-1">
                        {welcomeTopics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                        ))}
                    </ul>
                </div>

                {/* Pesan-pesan */}
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}

            </div>

            {}
            <div className="p-4 border-t border-gray-200">
                
                {}
                {selectedFile && (
                    <div className="mb-2 flex items-center text-sm text-gray-600">
                        <span className="mr-2 text-primary">📎</span>
                        <span>File: {selectedFile.name}</span>
                        <button 
                            type="button" 
                            onClick={() => setSelectedFile(null)} 
                            className="ml-4 text-red-500 hover:text-red-700 text-xs"
                        >
                            [Hapus]
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleSend} className="flex space-x-3 items-center">
                    
                    {}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                    
                    {}
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()} 
                        className="p-3 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"
                        title="Attach File"
                    >
                        {}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a3 3 0 104.243 4.243l6.586-6.586"/>
                        </svg>
                    </button>
                    
                    {}
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here...."
                        className="flex-1 py-3"
                    />
                    
                    {/* Tombol Send */}
                    <Button type="submit" className="w-auto px-6 py-3">
                        Send 
                    </Button>
                </form>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    AI responses are generated based on your equipment data and may not always be 100% accurate
                </p>
            </div>
        </div>
    );
}

export default AIAssistantPage;