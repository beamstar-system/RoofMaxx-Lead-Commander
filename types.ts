export interface Lead {
  id: string;
  businessName: string;
  address: string;
  businessType: string;
  roofType: 'Flat' | 'Sloped' | 'Mixed' | 'Unknown';
  estimatedSqFt: string;
  leadScore: number; // 1-100
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export enum ScanStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ScanStats {
  totalLeads: number;
  avgScore: number;
  commercialCount: number;
  highValueCount: number;
}
