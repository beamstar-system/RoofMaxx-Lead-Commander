import { Lead } from './types';

export const generateCSV = (leads: Lead[]): string => {
  const headers = [
    'Business Name',
    'Address',
    'Phone',
    'Website',
    'Business Type',
    'Roof Type (AI Est)',
    'Est. SqFt',
    'Lead Score',
    'Rating',
    'Review Count',
    'Latitude',
    'Longitude',
    'Notes'
  ];

  const rows = leads.map(lead => [
    `"${lead.businessName.replace(/"/g, '""')}"`,
    `"${lead.address.replace(/"/g, '""')}"`,
    `"${lead.phone || ''}"`,
    `"${lead.website || ''}"`,
    `"${lead.businessType}"`,
    `"${lead.roofType}"`,
    `"${lead.estimatedSqFt}"`,
    lead.leadScore,
    lead.rating || 0,
    lead.reviewCount || 0,
    lead.coordinates?.lat || '',
    lead.coordinates?.lng || '',
    `"${lead.notes ? lead.notes.replace(/"/g, '""') : ''}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateStats = (leads: Lead[]) => {
  if (leads.length === 0) return { totalLeads: 0, avgScore: 0, commercialCount: 0, highValueCount: 0 };
  
  const totalLeads = leads.length;
  const avgScore = Math.round(leads.reduce((acc, curr) => acc + curr.leadScore, 0) / totalLeads);
  // Assuming all are filtered for commercial, but we count high scores
  const highValueCount = leads.filter(l => l.leadScore > 80).length;
  
  return {
    totalLeads,
    avgScore,
    commercialCount: totalLeads, // Strict filter applied in AI
    highValueCount
  };
};
