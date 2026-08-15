export type SourceId = 'sms' | 'upi' | 'voice' | 'link';

export type Verdict = 'block' | 'verify' | 'safe';

export interface Source {
  id: SourceId;
  label: string;
  prefix: string;
  placeholder: string;
  icon: 'MessageSquare' | 'Smartphone' | 'Phone' | 'Link';
}

export interface DemoMessage {
  id: string;
  label: string;
  source: SourceId;
  text: string;
}

export interface ScanResult {
  risk_score: number;
  verdict: Verdict;
  explanation: string;
  actions: string[];
  local_analysis?: boolean;
}

export interface ScanHistoryItem extends ScanResult {
  id: string;
  source: SourceId;
  text: string;
  created_at: string;
}

export interface ScanResponse {
  risk_score?: number;
  verdict?: string;
  explanation?: string;
  actions?: string[];
  // fallback fields some backends may return
  risk?: number;
  score?: number;
  label?: string;
  message?: string;
  details?: string;
  recommendation?: string;
  recommendations?: string[];
  warning?: string;
}
