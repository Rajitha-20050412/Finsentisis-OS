
import { Regulation, RiskLevel, Task, Policy, AuditLog, UserProfile } from '../types';

export const mockRegulations: Regulation[] = [
  {
    id: 'REG-001',
    title: 'EU AI Act',
    region: 'European Union',
    regionCode: 'eu',
    sectors: ['tech', 'finance', 'health', 'retail'],
    riskLevel: RiskLevel.CRITICAL,
    summary: 'Comprehensive regulation on Artificial Intelligence, categorizing AI systems by risk.',
    lastUpdated: '2024-05-21',
    status: 'Pending',
    impact: 'High impact on automated hiring and customer service bots.'
  },
  {
    id: 'REG-002',
    title: 'Digital Personal Data Protection Act',
    region: 'India',
    regionCode: 'apac',
    sectors: ['all'],
    riskLevel: RiskLevel.HIGH,
    summary: 'Framework for processing digital personal data, recognizing rights of individuals.',
    lastUpdated: '2023-08-11',
    status: 'Active',
    impact: 'Requires immediate update to consent forms and data localization policies.'
  },
  {
    id: 'REG-003',
    title: 'Corporate Sustainability Reporting Directive (CSRD)',
    region: 'European Union',
    regionCode: 'eu',
    sectors: ['mfg', 'energy', 'retail', 'finance'],
    riskLevel: RiskLevel.MEDIUM,
    summary: 'Requires companies to report on the impact of their activities on the environment and society.',
    lastUpdated: '2024-01-05',
    status: 'Active',
    impact: 'New ESG reporting templates required for FY24.'
  },
  {
    id: 'REG-004',
    title: 'CCPA (Amended by CPRA)',
    region: 'USA (California)',
    regionCode: 'na',
    sectors: ['all'],
    riskLevel: RiskLevel.HIGH,
    summary: 'Enhanced privacy rights for California residents, including correction of inaccurate personal data.',
    lastUpdated: '2023-07-01',
    status: 'Active',
    impact: 'Review vendor contracts for data sharing clauses.'
  },
  {
    id: 'REG-005',
    title: 'GST E-Invoicing Mandate Phase 6',
    region: 'India',
    regionCode: 'apac',
    sectors: ['finance', 'retail', 'mfg'],
    riskLevel: RiskLevel.MEDIUM,
    summary: 'Lowering of turnover threshold for mandatory e-invoicing.',
    lastUpdated: '2024-03-15',
    status: 'Active',
    impact: 'ERP system integration update required.'
  },
  {
    id: 'REG-006',
    title: 'HIPAA Security Rule Update',
    region: 'United States',
    regionCode: 'na',
    sectors: ['health', 'finance'],
    riskLevel: RiskLevel.CRITICAL,
    summary: 'New cybersecurity requirements for PHI data handlers.',
    lastUpdated: '2024-02-10',
    status: 'Active',
    impact: 'Immediate audit of encryption standards required.'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'TSK-101',
    title: 'Update Privacy Policy for DPDP Act',
    description: 'Review the current global privacy policy and update specific sections regarding data localization.',
    assignee: 'Sarah Jenkins',
    dueDate: '2024-06-15',
    status: 'In Progress',
    priority: RiskLevel.HIGH,
    regulationId: 'REG-002',
    regionCode: 'apac',
    sector: 'all',
    evidence: [
        { id: 'EV-1', type: 'link', title: 'Draft Policy v2 (GDocs)', url: '#', addedBy: 'Sarah Jenkins', date: '2024-05-20' }
    ]
  },
  {
    id: 'TSK-102',
    title: 'AI System Risk Classification',
    description: 'Conduct a comprehensive risk assessment of all deployed AI models.',
    assignee: 'Mike Chen',
    dueDate: '2024-06-30',
    status: 'To Do',
    priority: RiskLevel.CRITICAL,
    regulationId: 'REG-001',
    regionCode: 'eu',
    sector: 'tech',
    evidence: []
  },
  {
    id: 'TSK-103',
    title: 'Q2 ESG Data Collection',
    description: 'Collect Scope 1 and Scope 2 emission data from all regional offices.',
    assignee: 'Finance Ops',
    dueDate: '2024-07-01',
    status: 'To Do',
    priority: RiskLevel.MEDIUM,
    regulationId: 'REG-003',
    regionCode: 'eu',
    sector: 'energy',
    evidence: []
  },
  {
    id: 'TSK-104',
    title: 'Review 3rd Party Processors (EU)',
    description: 'Audit top 10 data processors in EU region for GDPR compliance.',
    assignee: 'Legal Team',
    dueDate: '2024-05-30',
    status: 'Done',
    priority: RiskLevel.HIGH,
    regulationId: 'REG-001',
    regionCode: 'eu',
    sector: 'all',
    evidence: [
        { id: 'EV-2', type: 'file', title: 'Audit_Report_EU_2024.pdf', url: '#', addedBy: 'Legal Team', date: '2024-05-28' }
    ]
  },
  {
    id: 'TSK-105',
    title: 'Update HIPAA Compliance Protocols',
    description: 'Revise internal data handling procedures to align with new HIPAA amendments.',
    assignee: 'Chief Medical Officer',
    dueDate: '2024-08-15',
    status: 'To Do',
    priority: RiskLevel.CRITICAL,
    regulationId: 'REG-006',
    regionCode: 'na',
    sector: 'health',
    evidence: []
  }
];

export const mockPolicies: Policy[] = [
  {
    id: 'POL-001',
    name: 'Global Data Privacy Policy',
    description: 'Framework for handling personal data across all jurisdictions.',
    owner: 'Chief Privacy Officer',
    linkedRegulations: 12,
    lastReview: '2024-01-10',
    status: 'Active'
  },
  {
    id: 'POL-002',
    name: 'AI Governance Framework',
    description: 'Guidelines for the development and deployment of AI systems.',
    owner: 'CTO',
    linkedRegulations: 3,
    lastReview: '2024-04-01',
    status: 'Draft'
  },
  {
    id: 'POL-003',
    name: 'Anti-Money Laundering (AML)',
    description: 'Procedures to prevent and detect money laundering activities.',
    owner: 'Compliance Head',
    linkedRegulations: 8,
    lastReview: '2023-11-20',
    status: 'Active'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-9923',
    action: 'Policy Updated: Global Data Privacy',
    user: 'admin@finsentsis.com',
    timestamp: '2024-05-24 10:23:45 UTC',
    hash: '0x8f2d...3a1b',
    status: 'Verified'
  },
  {
    id: 'LOG-9922',
    action: 'Task Completed: Review 3rd Party Processors',
    user: 'sarah.j@finsentsis.com',
    timestamp: '2024-05-24 09:15:22 UTC',
    hash: '0x7e1c...9b2d',
    status: 'Verified'
  },
  {
    id: 'LOG-9921',
    action: 'System Alert: New Regulation Detected (EU AI Act)',
    user: 'SYSTEM_BOT',
    timestamp: '2024-05-23 14:00:00 UTC',
    hash: '0x5a4f...1c8e',
    status: 'Verified'
  },
  {
    id: 'LOG-9920',
    action: 'User Login',
    user: 'mike.c@finsentsis.com',
    timestamp: '2024-05-23 08:30:10 UTC',
    hash: '0x2d3e...4f5a',
    status: 'Verified'
  }
];

export const countryRiskData = [
  { id: "USA", value: 45, risk: "Medium" },
  { id: "IND", value: 85, risk: "Critical" },
  { id: "CHN", value: 70, risk: "High" },
  { id: "DEU", value: 65, risk: "High" },
  { id: "BRA", value: 50, risk: "Medium" },
  { id: "ZAF", value: 30, risk: "Low" },
];

// --- Filtering Helper ---

export const getFilteredData = (profile: UserProfile | null) => {
    if (!profile) return { regulations: mockRegulations, tasks: mockTasks };

    const regulations = mockRegulations.filter(r => {
        // Filter by region match
        const regionMatch = !r.regionCode || profile.regions.includes(r.regionCode);
        // Filter by sector match (or 'all')
        const sectorMatch = !r.sectors || r.sectors.includes('all') || r.sectors.includes(profile.sector);
        return regionMatch && sectorMatch;
    });

    const tasks = mockTasks.filter(t => {
        // Task usually specific to a region/sector or global
        const regionMatch = !t.regionCode || profile.regions.includes(t.regionCode);
        const sectorMatch = !t.sector || t.sector === 'all' || t.sector === profile.sector;
        return regionMatch && sectorMatch;
    });

    return { regulations, tasks };
};
