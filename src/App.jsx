import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import SettingsModal, { CHARACTERS } from './components/SettingsModal';
import { Sparkles, Menu } from 'lucide-react';
import './index.css';

const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'openai/gpt-3.5-turbo',
  character: 'doraemon'
};

const CHARACTER_CONFIG = {
  doraemon: {
    systemPrompt: 'คุณคือ "โดเรม่อน" (Doraemon) หุ่นยนต์แมวจากโลกอนาคต ให้พูดคุยด้วยความเป็นมิตร ชอบกินโดรายากิ คอยช่วยเหลือและให้คำปรึกษาผู้เล่น เรียกตัวเองว่า "ฉัน" หรือ "โดเรม่อน" และมักจะพูดถึงของวิเศษจากกระเป๋ามิติที่ 4 เพื่อช่วยแก้ปัญหาต่างๆ อย่างสร้างสรรค์และน่ารัก',
    themeClass: 'theme-doraemon',
    name: 'Doraemon'
  },
  nobita: {
    systemPrompt: 'คุณคือ "โนบิตะ" (Nobita) เด็กประถมขี้เกียจ เรียนไม่เก่ง เล่นกีฬาไม่เก่ง ชอบพึ่งพาโดเรม่อน ขี้กลัวแต่ก็มีมุมที่อ่อนโยนและรักเพื่อน พูดจาใสซื่อ ขี้บ่นนิดๆ มักจะโอดครวญและขอความช่วยเหลือเสมอ',
    themeClass: 'theme-nobita',
    name: 'Nobita'
  },
  shizuka: {
    systemPrompt: 'คุณคือ "ชิซุกะ" (Shizuka) เด็กผู้หญิงน่ารัก ใจดี อ่อนโยน เรียนเก่ง ชอบอาบน้ำและรักดนตรี พูดจาสุภาพเรียบร้อย ไพเราะ มีพลังบวกและคอยให้กำลังใจเสมอ',
    themeClass: 'theme-shizuka',
    name: 'Shizuka'
  },
  gian: {
    systemPrompt: 'คุณคือ "ไจแอนท์" (Gian) เด็กประถมตัวอ้วน หัวโจกของกลุ่มที่ชอบใช้กำลัง ชอบแย่งของเล่น แต่จริงๆ แล้วรักพวกพ้อง มักใช้คำพูดห้าวๆ เสียงดังๆ มั่นใจในตัวเอง ชอบร้องเพลง(ที่เสียงหลงมาก) เรียกตัวเองว่า "ข้า" หรือ "ไจแอนท์" และมักจะพูดถึงว่าของของนายก็คือของของฉัน',
    themeClass: 'theme-gian',
    name: 'Gian'
  },
  suneo: {
    systemPrompt: 'คุณคือ "ซูเนโอะ" (Suneo) เด็กประถมบ้านรวย ขี้โอ่ ชอบเอาของเล่นใหม่ๆ มาอวด ขี้ประจบไจแอนท์ พูดจาอวดรวยนิดๆ เจ้าเล่ห์แต่ก็ขี้ขลาด ชอบพูดจาติดหรู',
    themeClass: 'theme-suneo',
    name: 'Suneo'
  }
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load settings and chats on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mylang_settings');
    if (savedSettings) {
      try {
        setSettings({...DEFAULT_SETTINGS, ...JSON.parse(savedSettings)});
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
      setIsSettingsOpen(true);
    }

    const savedChats = localStorage.getItem('mylang_chats');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChatHistory(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } catch (e) {
        console.error("Failed to parse chats", e);
      }
    }
  }, []);

  // Save chats whenever chatHistory changes
  useEffect(() => {
    localStorage.setItem('mylang_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Apply theme class to body
  useEffect(() => {
    const charConfig = CHARACTER_CONFIG[settings.character] || CHARACTER_CONFIG.doraemon;
    document.body.className = charConfig.themeClass;
    
    return () => {
      document.body.className = '';
    };
  }, [settings.character]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  const selectChat = (id) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
    }
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    const updatedHistory = chatHistory.filter(c => c.id !== id);
    setChatHistory(updatedHistory);
    if (currentChatId === id) {
      if (updatedHistory.length > 0) {
        setCurrentChatId(updatedHistory[0].id);
        setMessages(updatedHistory[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!settings.apiKey) {
      alert("Please configure your OpenRouter API key in Settings first.");
      setIsSettingsOpen(true);
      return;
    }

    const unsubmittedInput = input;
    const newMessages = [...messages, { role: 'user', content: unsubmittedInput }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      setCurrentChatId(chatId);
      const title = unsubmittedInput.length > 30 ? unsubmittedInput.substring(0, 30) + '...' : unsubmittedInput;
      setChatHistory(prev => [{ id: chatId, title, messages: newMessages, updatedAt: Date.now() }, ...prev]);
    } else {
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: newMessages, updatedAt: Date.now() } : chat
      ));
    }

    try {
      // Add a placeholder message for the AI response that we will update as chunks arrive
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const charConfig = CHARACTER_CONFIG[settings.character] || CHARACTER_CONFIG.doraemon;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${settings.apiKey}`,
          "HTTP-Referer": window.location.origin, 
          "X-Title": "MyLang Chat", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: charConfig.systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          stream: true // Enable streaming
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim() !== "");
        
        for (const line of lines) {
          if (line === "data: [DONE]") {
            break; // Stream finished
          }
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                aiContent += data.choices[0].delta.content;
                
                // Update the messages state with the new chunk
                setMessages(prev => {
                  const updatedMessages = [...prev];
                  updatedMessages[updatedMessages.length - 1] = {
                    role: 'assistant',
                    content: aiContent
                  };
                  return updatedMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e, line);
            }
          }
        }
      }

      // After streaming is complete, save the final state to history
      const finalMessages = [...newMessages, { role: 'assistant', content: aiContent }];
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: finalMessages, updatedAt: Date.now() } : chat
      ));

    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { 
        role: 'assistant', 
        content: `**Error:** ${error.message}\n\nPlease check your API key and network connection.` 
      };
      
      // Replace the placeholder or append the error if placeholder wasn't created
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages[updatedMessages.length - 1].role === 'assistant') {
          updatedMessages[updatedMessages.length - 1] = errorMessage;
        } else {
          updatedMessages.push(errorMessage);
        }
        return updatedMessages;
      });
      
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, messages: [...newMessages, errorMessage], updatedAt: Date.now() } : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar overlay for mobile */}
      {!isSidebarOpen && window.innerWidth <= 768 && (
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 20, background: 'var(--color-bg-surface-solid)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
        >
          <Menu size={24} color="var(--color-primary-dark)" />
        </button>
      )}

      {/* Conditional rendering based on sidebar state */}
      <div style={{ display: isSidebarOpen ? 'block' : 'none' }}>
        <Sidebar 
          onNewChat={handleNewChat} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />
      </div>
      
      <main className="main-chat">
        <header className="chat-header glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isSidebarOpen && window.innerWidth <= 768 ? (
              <button 
                onClick={toggleSidebar}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                 <Menu size={20} color="var(--color-text-secondary)" />
              </button>
            ) : null}
            {!isSidebarOpen && window.innerWidth > 768 ? (
              <button 
                onClick={toggleSidebar}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight: '1rem' }}
              >
                 <Menu size={20} color="var(--color-text-secondary)" />
              </button>
            ) : null}
            <Sparkles size={18} color="var(--color-primary)" />
            <h1>{settings.model.split('/').pop()} Chat</h1>
          </div>
        </header>
        
        <div className="chat-messages">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        
        <div className="chat-input-area">
          <MessageInput 
            input={input} 
            setInput={setInput} 
            onSubmit={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}

export default App;
