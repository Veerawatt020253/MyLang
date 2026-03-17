import React, { useRef, useEffect } from 'react';
import { User, Bot } from 'lucide-react';
import { marked } from 'marked';
import './ChatWindow.css';

// Configure marked to sanitize appropriately in a real app,
// For now, simple markdown parsing
marked.setOptions({
  breaks: true,
  gfm: true,
});

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar user-avatar">
            <User size={18} />
          </div>
        ) : (
          <div className="avatar ai-avatar">
            <Bot size={18} />
          </div>
        )}
      </div>
      <div className="message-content-box">
        {isUser ? (
          <div className="message-text">{message.content}</div>
        ) : (
          <div 
            className="message-text markdown-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
          />
        )}
      </div>
    </div>
  );
};

const ChatWindow = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window-container">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Bot size={48} />
          </div>
          <h1>How can I help you today?</h1>
          <p>I can assist with coding, writing, learning, and more.</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          {isLoading && (
            <div className={`message-wrapper ai-message`}>
              <div className="message-avatar">
                <div className="avatar ai-avatar pulse">
                  <Bot size={18} />
                </div>
              </div>
              <div className="message-content-box">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
