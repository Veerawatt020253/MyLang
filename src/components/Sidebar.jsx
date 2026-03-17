import React from 'react';
import { MessageSquare, Settings, Plus, Sparkles, Trash2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onNewChat, onOpenSettings, chatHistory = [], currentChatId, onSelectChat, onDeleteChat }) => {
  return (
    <div className="sidebar-container glass-panel">
      <div className="sidebar-header">
        <div className="logo-area">
          <div className="logo-icon-container">
            <Sparkles className="logo-icon" size={24} />
          </div>
          <h2 className="app-title">MyLang</h2>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-content">
        <h3 className="section-title">Recent Chats</h3>
        <div className="chat-history-list">
          {chatHistory.length === 0 ? (
            <div className="empty-history-text">No previous chats</div>
          ) : (
            chatHistory.map(chat => (
              <div 
                key={chat.id} 
                className={`history-item-wrapper ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="history-item">
                  <MessageSquare size={16} />
                  <span className="history-item-text">{chat.title || 'New Chat'}</span>
                </div>
                <button 
                  className="delete-chat-btn"
                  onClick={(e) => onDeleteChat(chat.id, e)}
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="settings-btn" onClick={onOpenSettings}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
