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
      'Why Expert Human Oversight of AI remains essential when AI is used to assist enterprise support workflows.',
    body: [
      'Support automation works best when it removes repetitive steps without removing accountability. The highest-risk mistake is allowing a model to answer operational questions without review, context, or escalation boundaries.',
      'Aetas AI uses Human Led AI with Expert Human Oversight of AI (Expert in the Loop). The goal is to help operators classify requests, draft responses, and surface relevant knowledge while keeping the final decision with a trained specialist.',
      'This service model reflects how real Business Processes and helpdesk environments work: accuracy, auditability, and clear escalation matter more than fully autonomous demos.',
    ],
  },
  {
    slug: 'ransomware-containment-workflow',
    category: 'Threat Intel',
    title: 'How MXDR Supports Detection and Response',
    date: 'May 18, 2026',
    author: 'Security Team',
    summary:
      'A practical look at Managed Extended Detection and Response when suspicious security activity appears.',
    body: [
      'Managed Extended Detection and Response depends on clear ownership and timely expert review. Detection can surface a signal, but response quality depends on the process around it.',
      'Aetas Security supports detection, investigation, response, documentation, and escalation through its MXDR service.',
      'Defined review and escalation paths help security teams respond consistently when suspicious activity appears.',
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
