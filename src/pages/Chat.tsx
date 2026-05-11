import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMedicalAdvice } from '../services/geminiService';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Paperclip, 
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAI = chatId === 'ai';

  useEffect(() => {
    if (isAI && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: "Hello! I'm your MedSmart AI assistant. How can I help you today? Please describe your symptoms or ask a health-related question.", 
          timestamp: new Date() 
        }
      ]);
    }
  }, [isAI, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    if (isAI) {
      setIsTyping(true);
      try {
        const advice = await getMedicalAdvice(input);
        const assistantMessage: Message = {
          role: 'assistant',
          content: advice,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error. Please try again later.", 
          timestamp: new Date() 
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-50 rounded-full md:hidden">
            <ChevronLeft size={20} />
          </button>
          <div className={`p-2 rounded-xl bg-blue-100 text-blue-600 ${isAI ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
            {isAI ? <Bot size={24} /> : <UserIcon size={24} />}
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">
              {isAI ? 'MedSmart AI Assistant' : 'Real Doctor Chat'}
            </h2>
            <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        {isAI && (
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tight">AI Warning</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-slate">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                )}
                <div className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1.5 h-1.5 bg-blue-300 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder={isAI ? "Describe your symptoms..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow pl-4 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
              !input.trim() || isTyping 
                ? 'text-slate-300' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
        {isAI && (
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest italic">
            Powered by MedSmart AI Diagnostics
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
