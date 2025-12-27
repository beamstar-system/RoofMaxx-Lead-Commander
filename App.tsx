import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import LeadTable from './components/LeadTable';
import KeyModal from './components/KeyModal';
import { fetchLeadsFromGemini } from './services/geminiService';
import { generateCSV, downloadCSV } from './utils';
import { Lead, ScanStatus } from './types';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyModalOpen, setKeyModalOpen] = useState<boolean>(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [progress, setProgress] = useState<string>('');
  
  // Load API key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
        setKeyModalOpen(true);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('GEMINI_API_KEY', key);
    setKeyModalOpen(false);
  };

  const runScan = async (location: string, targetCount: number) => {
    if (!apiKey) {
      setKeyModalOpen(true);
      return;
    }

    setScanStatus(ScanStatus.SCANNING);
    setProgress('Initializing satellite uplink...');

    // To simulate 500 leads, we need to batch requests because the LLM context window 
    // and tool outputs usually limit us to ~20-30 items per reliable call.
    // For this demo, we will execute a few parallel "sector scans" to gather a good chunk of data.
    
    // We define different keywords to act as "sectors"
    const sectors = [
      ['Warehouse', 'Industrial Park'],
      ['Shopping Mall', 'Strip Mall'],
      ['Factory', 'Manufacturing'],
      ['Commercial Center', 'Logistics'],
      ['Distribution Center', 'Business Park']
    ];

    let gatheredLeads: Lead[] = [];
    const maxBatches = Math.ceil(targetCount / 20); // Rough estimate
    // Limit batches for demo stability, real app would use pagination or deeper loops
    const actualBatchesToRun = Math.min(maxBatches, sectors.length); 

    try {
      for (let i = 0; i < actualBatchesToRun; i++) {
        setProgress(`Scanning Sector ${i + 1}/${actualBatchesToRun}: ${sectors[i].join(', ')}...`);
        
        try {
          const newLeads = await fetchLeadsFromGemini({
            apiKey,
            location,
            keywords: sectors[i]
          });
          
          gatheredLeads = [...gatheredLeads, ...newLeads];
          // Update state incrementally so user sees progress
          setLeads(prev => {
             // De-duplicate based on name + address to avoid repeats from overlapping sectors
             const combined = [...prev, ...newLeads];
             const unique = combined.filter((v, idx, a) => a.findIndex(t => (t.businessName === v.businessName && t.address === v.address)) === idx);
             return unique;
          });

        } catch (err) {
          console.error(`Sector ${i} failed`, err);
          // Continue to next sector even if one fails
        }
        
        // Brief pause to be nice to the rate limiter
        await new Promise(r => setTimeout(r, 1000));
      }
      
      setScanStatus(ScanStatus.COMPLETED);
      setProgress('Scan complete. Data compiled.');

    } catch (error) {
      console.error(error);
      setScanStatus(ScanStatus.ERROR);
      setProgress('Critical Error in Data Link');
    }
  };

  const handleExport = () => {
    if (leads.length === 0) return;
    const csvContent = generateCSV(leads);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCSV(csvContent, `RoofMaxx_Leads_Pittsburgh_${timestamp}.csv`);
  };

  const handleClear = () => {
      setLeads([]);
      setScanStatus(ScanStatus.IDLE);
      setProgress('');
  };

  return (
    <div className="flex flex-col h-screen bg-commander-dark text-slate-200 font-sans">
      <Header 
        hasApiKey={!!apiKey} 
        onSettingsClick={() => setKeyModalOpen(true)} 
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Controls 
          status={scanStatus}
          leadCount={leads.length}
          onScan={runScan}
          onExport={handleExport}
          onClear={handleClear}
        />

        <main className="flex-1 flex flex-col p-4 gap-4 relative overflow-hidden bg-[url('https://assets.codepen.io/13471/grid.png')] bg-[length:50px_50px]">
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
             <div className="bg-commander-panel/80 backdrop-blur border border-slate-700 p-4 rounded shadow">
                <div className="text-slate-400 text-xs font-mono uppercase">Total Targets</div>
                <div className="text-2xl font-bold text-white">{leads.length}</div>
             </div>
             <div className="bg-commander-panel/80 backdrop-blur border border-slate-700 p-4 rounded shadow">
                <div className="text-slate-400 text-xs font-mono uppercase">High Priority (>80)</div>
                <div className="text-2xl font-bold text-commander-success">
                    {leads.filter(l => l.leadScore > 80).length}
                </div>
             </div>
             <div className="bg-commander-panel/80 backdrop-blur border border-slate-700 p-4 rounded shadow">
                <div className="text-slate-400 text-xs font-mono uppercase">Avg SqFt Est.</div>
                <div className="text-2xl font-bold text-commander-accent">
                   {leads.length > 0 ? "15k+" : "-"}
                </div>
             </div>
             <div className="bg-commander-panel/80 backdrop-blur border border-slate-700 p-4 rounded shadow">
                <div className="text-slate-400 text-xs font-mono uppercase">Avg Score</div>
                <div className="text-2xl font-bold text-white">
                    {leads.length > 0 ? Math.round(leads.reduce((a,b) => a + b.leadScore, 0)/leads.length) : "-"}
                </div>
             </div>
          </div>

          {/* Progress Bar (Visible during scan) */}
          {scanStatus === ScanStatus.SCANNING && (
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-commander-accent h-full animate-progress-indeterminate"></div>
              </div>
          )}
          {progress && <div className="text-xs font-mono text-commander-accent">{progress}</div>}

          {/* Main Table */}
          <div className="flex-1 min-h-0 relative">
             <LeadTable leads={leads} />
          </div>
        </main>
      </div>

      <KeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setKeyModalOpen(false)} 
        onSave={handleSaveKey} 
        currentKey={apiKey}
      />
      
      {/* Tailwind Animation for progress bar */}
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
