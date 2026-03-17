import React, { useRef, useEffect } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import './MessageInput.css';

const MessageInput = ({ input, setInput, onSubmit, isLoading }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="input-container glass-panel">
      <button className="attach-button" aria-label="Attach file">
        <ImageIcon size={20} />
      </button>
      
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message MyLang..."
          disabled={isLoading}
          rows={1}
          className="message-textarea"
        />
      </div>
      
      <button 
        className={`send-button ${input.trim() ? 'active' : ''}`}
        onClick={onSubmit}
        disabled={!input.trim() || isLoading}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
