/**
 * Service-page FAQs. Every answer is composed from approved copy already on
 * that service page (HANDOFF.md); do not add new claims here.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const serviceFaqs: Record<'ai' | 'security' | 'managed-it', FaqItem[]> = {
  ai: [
    {
      question: 'What is Human Led AI?',
      answer: 'Human Led AI applies AI where it can classify, draft, summarize, retrieve, or recommend inside your Business Processes, while experts review outputs before they affect customers, accounts, systems, or security.',
    },
    {
      question: 'What is Business Process AI Assimilation?',
      answer: 'It adds AI support to the work delivery teams already do: quality checks, agent assistance, knowledge retrieval, customer response drafting, call or ticket summarization, and supervisor review workflows.',
    },
    {
      question: 'How does Expert in the Loop work?',
      answer: 'AGI designs validation gates, escalation paths, audit trails, and exception handling so AI can assist the workflow without silently making high-impact decisions.',
    },
    {
      question: 'Where does an AI engagement start?',
      answer: 'With the workflow, not the model. AGI starts with the operating reality: queue volume, exception types, approval rules, customer expectations, and the systems already used by the team.',
    },
  ],
  security: [
    {
      question: 'What does MXDR include?',
      answer: 'Managed Extended Detection and Response (MXDR) provides continuous detection, investigation, response, and escalation guided by experienced security professionals.',
    },
    {
      question: 'What is Offensive Security?',
      answer: 'Offensive Security evaluates network and application defenses through dedicated testing engagements: Network Security Testing and Application Security Testing (Pen Testing).',
    },
    {
      question: 'What does Network Security Testing focus on?',
      answer: 'Network exposure, configuration weaknesses, and potential attack paths.',
    },
    {
      question: 'What does Application Security Testing (Pen Testing) focus on?',
      answer: 'Identifying and documenting security weaknesses in applications.',
    },
  ],
  'managed-it': [
    {
      question: 'What does Help Desk as a Service cover?',
      answer: 'L1-L3 ticket handling, user support, access issues, onboarding, and escalation management.',
    },
    {
      question: 'What is Product Support as a Service?',
      answer: 'Customer and product support queues, quality review, documentation, and operational reporting.',
    },
    {
      question: 'Which administration work can AGI manage?',
      answer: 'Identity and access (account access, authentication, group membership, role, and license administration), device management (endpoint enrollment, compliance profiles, remote lock/wipe support, and software deployment coordination), and tenant administration.',
    },
    {
      question: 'How does a managed engagement run?',
      answer: 'Stabilize by documenting queues, roles, systems, support boundaries, and escalation rules. Operate recurring helpdesk, tenant, device, and support tasks against agreed workflows. Improve by reporting on blockers, repeat issues, automation candidates, and service quality trends.',
    },
  ],
};
