import React from 'react';

interface HeaderProps {
  hasApiKey: boolean;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ hasApiKey, onSettingsClick }) => {
  return (
    <header className="bg-commander-panel border-b border-slate-700 h-16 flex items-center justify-between px-6 shadow-md z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-commander-accent to-blue-600 rounded flex items-center justify-center shadow-lg shadow-commander-accent/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">RoofMaxx <span className="text-commander-accent">Lead Commander</span></h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Commercial Intelligence Unit</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${hasApiKey ? 'border-commander-success/30 bg-commander-success/10 text-commander-success' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-commander-success animate-pulse' : 'bg-red-500'}`}></div>
          {hasApiKey ? 'SYSTEM ONLINE' : 'API KEY REQUIRED'}
        </div>
        <button 
          onClick={onSettingsClick}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
