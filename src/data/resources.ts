export interface ResourceArticle {
  slug: string;
  category: 'AI Research' | 'Threat Intel' | 'MSP Operations';
  title: string;
  date: string;
  author: string;
  summary: string;
  body: string[];
}

export const resources: ResourceArticle[] = [
  {
    slug: 'support-automation-fallacy',
    category: 'AI Research',
    title: 'The Fallacy of Full Support Automation',
    date: 'June 24, 2026',
    author: 'AI Engineering Team',
    summary:
      'Why human validation remains essential when AI is used to assist enterprise support workflows.',
    body: [
      'Support automation works best when it removes repetitive steps without removing accountability. The highest-risk mistake is allowing a model to answer operational questions without review, context, or escalation boundaries.',
      'Aetas AI is designed around a human-in-the-loop model. The goal is to help operators classify requests, draft responses, and surface relevant knowledge while keeping the final decision with a trained specialist.',
      'This service model reflects how real BPO and helpdesk environments work: accuracy, auditability, and clear escalation matter more than fully autonomous demos.',
    ],
  },
  {
    slug: 'ransomware-containment-workflow',
    category: 'Threat Intel',
    title: 'Anatomy of a Ransomware Containment Workflow',
    date: 'May 18, 2026',
    author: 'Security Team',
    summary:
      'A practical look at the containment steps that matter when suspicious endpoint behavior appears.',
    body: [
      'Ransomware response depends on prepared telemetry, clear ownership, and fast human review. Tools can surface the signal, but response quality depends on the process around them.',
      'Aetas Security focuses on alert intake, severity review, endpoint context, isolation decisions, and documented communication with client stakeholders.',
      'The strongest programs rehearse these steps before an incident. That means defined escalation paths, known contacts, and evidence that containment actions are working.',
    ],
  },
  {
    slug: 'identity-onboarding-metrics',
    category: 'MSP Operations',
    title: 'Identity Onboarding Metrics That Actually Matter',
    date: 'April 10, 2026',
    author: 'Managed IT Team',
    summary:
      'How MSP teams can structure user onboarding around measurable access, license, and device outcomes.',
    body: [
      'Onboarding is more than creating an account. A complete workflow includes identity, licensing, mailbox access, groups, device enrollment, MFA, and first-day support readiness.',
      'Aetas Global structures recurring IT work into queues with clear owners, repeatable checklists, and escalation criteria.',
      'The best metrics are operational: time to first access, reopen rate, blocked onboarding tasks, and number of exceptions requiring administrator review.',
    ],
  },
];
