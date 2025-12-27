import React, { useState } from 'react';

interface KeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
  currentKey: string;
}

const KeyModal: React.FC<KeyModalProps> = ({ isOpen, onSave, onClose, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-commander-panel border border-slate-600 p-6 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <svg className="w-5 h-5 text-commander-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
           </svg>
           Security Clearance
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Enter your Google Gemini API Key. This key is used locally to power the Lead Commander AI analysis engines.
          <br/><br/>
          <span className="text-xs opacity-70">This app uses <strong>gemini-2.5-flash</strong>. Ensure your key has access.</span>
        </p>
        
        <div className="mb-6">
            <label className="block text-xs font-mono uppercase text-slate-500 mb-1">Gemini API Token</label>
            <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-commander-accent focus:outline-none font-mono"
                placeholder="AIzaSy..."
            />
        </div>

        <div className="flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => onSave(key)}
                className="px-4 py-2 bg-commander-accent hover:bg-sky-400 text-slate-900 font-bold rounded text-sm transition-colors"
            >
                Authorize
            </button>
        </div>
      </div>
    </div>
  );
};

export default KeyModal;
