import React from 'react';
import { Lead } from '../types';

interface LeadTableProps {
  leads: Lead[];
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
        <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7" />
        </svg>
        <p className="text-sm font-mono uppercase tracking-wide">No leads detected in current sector</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-commander-panel/50 rounded-lg border border-slate-700 shadow-inner">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-800 text-slate-400 sticky top-0 z-10 font-mono text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Business Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Roof Est.</th>
            <th className="px-4 py-3 font-medium">Est. SqFt</th>
            <th className="px-4 py-3 font-medium">Address</th>
            <th className="px-4 py-3 font-medium">Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${lead.leadScore > 80 ? 'text-commander-success' : lead.leadScore > 50 ? 'text-commander-warning' : 'text-slate-500'}`}>
                    {lead.leadScore}
                  </span>
                  <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${lead.leadScore > 80 ? 'bg-commander-success' : lead.leadScore > 50 ? 'bg-commander-warning' : 'bg-slate-500'}`} 
                      style={{ width: `${lead.leadScore}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-slate-200">{lead.businessName}</td>
              <td className="px-4 py-3 text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs">
                  {lead.businessType}
                </span>
              </td>
              <td className="px-4 py-3">
                 <span className={`text-xs ${lead.roofType === 'Flat' ? 'text-commander-accent' : 'text-slate-400'}`}>
                   {lead.roofType}
                 </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{lead.estimatedSqFt}</td>
              <td className="px-4 py-3 text-slate-400 truncate max-w-[200px]" title={lead.address}>{lead.address}</td>
              <td className="px-4 py-3 text-slate-400">
                {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="hover:text-commander-accent">{lead.phone}</a>
                ) : (
                    <span className="text-slate-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
