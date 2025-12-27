import React, { useState } from 'react';
import { ScanStatus } from '../types';

interface ControlsProps {
  status: ScanStatus;
  leadCount: number;
  onScan: (location: string, batchSize: number) => void;
  onExport: () => void;
  onClear: () => void;
}

const Controls: React.FC<ControlsProps> = ({ status, leadCount, onScan, onExport, onClear }) => {
  const [location, setLocation] = useState('Pittsburgh, PA');
  const [targetCount, setTargetCount] = useState(500);

  const isScanning = status === ScanStatus.SCANNING;

  const handleScan = () => {
    onScan(location, targetCount);
  };

  return (
    <div className="bg-commander-panel border-r border-slate-700 w-80 flex flex-col p-4 gap-6 z-20 shadow-xl">
      
      {/* Target Configuration */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-700 pb-1">Mission Parameters</h2>
        
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-medium">Target Sector (City, State)</label>
          <div className="relative">
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-commander-accent focus:outline-none focus:ring-1 focus:ring-commander-accent transition-all"
              placeholder="e.g. Pittsburgh, PA"
            />
            <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-medium">Max Leads to Scan</label>
          <select 
            value={targetCount}
            onChange={(e) => setTargetCount(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-commander-accent focus:outline-none"
          >
            <option value={50}>50 (Recon)</option>
            <option value={100}>100 (Standard)</option>
            <option value={500}>500 (Deep Scan)</option>
            <option value={1000}>1000 (Full Market)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full py-3 px-4 rounded font-bold uppercase tracking-wide text-sm transition-all flex items-center justify-center gap-2
            ${isScanning 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-commander-accent text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] border border-commander-accent/50'
            }`}
        >
          {isScanning ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Initiate Scan
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={onExport}
                disabled={leadCount === 0 || isScanning}
                className="py-2 px-3 rounded bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold uppercase hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Export CSV
            </button>
            <button
                onClick={onClear}
                disabled={leadCount === 0 || isScanning}
                className="py-2 px-3 rounded bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold uppercase hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Clear Data
            </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="mt-auto bg-slate-900/50 p-4 rounded border border-slate-700">
        <h3 className="text-[10px] font-mono uppercase text-slate-500 mb-2">Operation Status</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-commander-warning animate-ping' : status === ScanStatus.COMPLETED ? 'bg-commander-success' : 'bg-slate-500'}`}></span>
          <span className="text-sm font-medium text-slate-200">{status}</span>
        </div>
        <p className="text-xs text-slate-400">
            {isScanning ? 'AI agents analyzing satellite & map data...' : leadCount > 0 ? `${leadCount} Commercial Leads Acquired` : 'Ready to command.'}
        </p>
      </div>

    </div>
  );
};

export default Controls;
