export type CaseStudyPillar = 'security' | 'global';

export interface CaseStudy {
  slug: string;
  pillar: CaseStudyPillar;
  title: string;
  metric: string;
  metricLabel: string;
  capability: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  technologies: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'fintech-security-readiness',
    pillar: 'security',
    title: 'Security Readiness for a Regulated Fintech Team',
    metric: '45 days',
    metricLabel: 'to remediation-ready findings',
    capability: 'Pentest & Compliance',
    summary:
      'Aetas Security helped a regulated software team understand web, API, and external exposure before a customer audit.',
    challenge:
      'The client needed a practical view of application and network risk before renewing enterprise customer contracts.',
    approach:
      'The team scoped external network, web application, and API testing, then translated findings into remediation priorities that engineering and leadership could act on.',
    outcome:
      'The client received a clear remediation plan, validation path, and executive-ready reporting package for audit conversations.',
    technologies: ['API testing', 'Web application testing', 'Qualys', 'Remediation planning'],
  },
  {
    slug: 'healthcare-mdr-coverage',
    pillar: 'security',
    title: 'Always-On Monitoring for a Healthcare Operations Group',
    metric: '24/7',
    metricLabel: 'monitoring and escalation coverage',
    capability: 'MDR / SOC',
    summary:
      'Aetas Security extended internal IT coverage with managed detection, alert triage, and documented escalation paths.',
    challenge:
      'Internal staff could not continuously monitor endpoint and identity alerts across overnight and weekend windows.',
    approach:
      'Aetas connected security telemetry, defined severity rules, and established human analyst review before escalation.',
    outcome:
      'The organization gained continuous coverage, clearer incident ownership, and faster prioritization of high-risk events.',
    technologies: ['Microsoft Defender', 'SentinelOne', 'Alert triage', 'Escalation runbooks'],
  },
  {
    slug: 'm365-helpdesk-scale',
    pillar: 'global',
    title: 'Microsoft 365 Helpdesk Scale-Up',
    metric: '<15 min',
    metricLabel: 'target response for common access requests',
    capability: 'Helpdesk & Identity',
    summary:
      'Aetas Global supported recurring access, onboarding, mailbox, and device management work for a distributed team.',
    challenge:
      'Routine access requests, license changes, and onboarding tasks were consuming internal administrator capacity.',
    approach:
      'Aetas built repeatable helpdesk queues for Microsoft 365, Entra ID, Exchange, SharePoint, and endpoint support tasks.',
    outcome:
      'Internal admins gained more time for strategic infrastructure work while users had a clearer support path.',
    technologies: ['Microsoft 365', 'Entra ID', 'Exchange', 'SharePoint', 'Intune'],
  },
  {
    slug: 'bpo-support-operations',
    pillar: 'global',
    title: 'Outsourced Product Support Operations',
    metric: 'Always-on',
    metricLabel: 'coverage for customer support queues',
    capability: 'BPO Support',
    summary:
      'Aetas Global helped structure an outsourced support desk with documented handoffs and escalation rules.',
    challenge:
      'A growing product team needed additional queue coverage without losing visibility into support quality.',
    approach:
      'Aetas aligned staffing, knowledge-base workflows, quality review, and escalation paths around the client support model.',
    outcome:
      'The client gained a scalable support layer with clearer reporting and more predictable queue ownership.',
    technologies: ['Zendesk', 'Slack', 'Knowledge base', 'QA review'],
  },
];
