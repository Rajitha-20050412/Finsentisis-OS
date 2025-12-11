
export enum RiskLevel {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface UserProfile {
  companyName: string;
  employees: string;
  regions: string[];
  sector: string;
}

export interface Regulation {
  id: string;
  title: string;
  region: string;
  regionCode?: string; // 'na', 'eu', 'apac', 'latam'
  sectors?: string[]; // 'finance', 'health', 'tech', etc. or 'all'
  riskLevel: RiskLevel;
  summary: string;
  lastUpdated: string;
  status: 'Active' | 'Pending' | 'Draft';
  impact: string;
}

export interface Evidence {
  id: string;
  type: 'file' | 'link';
  title: string;
  url: string;
  addedBy: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  priority: RiskLevel;
  regulationId?: string;
  evidence?: Evidence[];
  regionCode?: string;
  sector?: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  owner: string;
  linkedRegulations: number;
  lastReview: string;
  status: 'Active' | 'Draft';
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  hash: string;
  status: 'Verified';
}

export type ChatMessageType = 'text' | 'upload_request' | 'jurisdiction_selection' | 'scan_progress' | 'analysis_result' | 'report_download';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  citations?: string[];
  type?: ChatMessageType;
  data?: any;
}
