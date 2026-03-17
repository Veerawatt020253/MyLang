import React from 'react';
import { X, Key, Cpu, Save } from 'lucide-react';
import './SettingsModal.css';

const MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 (8B)' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 (70B)' }
];

export const CHARACTERS = [
  { id: 'doraemon', name: 'โดเรม่อน (Doraemon)', icon: '🐱' },
  { id: 'nobita', name: 'โนบิตะ (Nobita)', icon: '👓' },
  { id: 'shizuka', name: 'ชิซุกะ (Shizuka)', icon: '👧' },
  { id: 'gian', name: 'ไจแอนท์ (Gian)', icon: '🦍' },
  { id: 'suneo', name: 'ซูเนโอะ (Suneo)', icon: '🦊' }
];

const SettingsModal = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    // Save to local storage
    localStorage.setItem('mylang_settings', JSON.stringify(settings));
    onClose();
  };

  return (
    <div className="modal-overlay glass-panel">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="settings-section">
            <div className="section-header">
              <Key size={18} className="section-icon" />
              <h3>OpenRouter API Key</h3>
            </div>
            <p className="setting-description">
              Enter your OpenRouter API key to power MyLang's responses. Your key is stored locally in your browser.
            </p>
            <div className="input-group">
              <input 
                type="password" 
                value={settings.apiKey || ''} 
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                placeholder="sk-or-v1-..."
                className="setting-input"
              />
            </div>
          </div>
          
          <div className="settings-section">
            <div className="section-header">
              <Cpu size={18} className="section-icon" />
              <h3>Character Theme & Persona</h3>
            </div>
            <p className="setting-description">
              Select the character you want the AI to roleplay as. This will also change the app theme.
            </p>
            <div className="input-group">
              <select 
                value={settings.character || CHARACTERS[0].id} 
                onChange={(e) => setSettings({...settings, character: e.target.value})}
                className="setting-select"
              >
                {CHARACTERS.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.icon} {char.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Cpu size={18} className="section-icon" />
              <h3>Default Model</h3>
            </div>
            <p className="setting-description">
              Select the default AI model you want to chat with. Make sure your OpenRouter account has access.
            </p>
            <div className="input-group">
              <select 
                value={settings.model || MODELS[0].id} 
                onChange={(e) => setSettings({...settings, model: e.target.value})}
                className="setting-select"
              >
                {MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
