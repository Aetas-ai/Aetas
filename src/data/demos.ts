/**
 * Simulated data for the code-rendered service demos.
 *
 * Rules: every value is illustrative. Use reserved example domains
 * (*.example.com), documentation IP ranges (192.0.2.0/24, 198.51.100.0/24,
 * 203.0.113.0/24), generic roles, and relative times. Do not add vendor or
 * product names, client names, or performance claims that could read as
 * real AGI results. See HANDOFF.md "Code-rendered demos".
 */

/* ------------------------------------------------------ AI & Automation */

export interface ReviewTicket {
  id: string;
  channel: string;
  subject: string;
  message: string;
  category: string;
  priority: 'High' | 'Normal';
  queue: string;
  sop: string;
  summary: string;
  draft: string;
  edited: string;
  escalation: string;
}

export const reviewSteps = ['Received', 'Classified', 'Context retrieved', 'Draft prepared', 'Expert review', 'Approved and logged'] as const;

export const reviewTickets: ReviewTicket[] = [
  {
    id: 'REQ-2041',
    channel: 'Email',
    subject: 'Locked out after changing phones',
    message: "I changed phones over the weekend and can't approve sign-in prompts anymore. I need access before a client call at 10.",
    category: 'Access request',
    priority: 'High',
    queue: 'Identity support',
    sop: 'SOP-114 · MFA device re-registration',
    summary: 'User cannot complete MFA after a device change. Time-sensitive.',
    draft: "Thanks for the details. We'll verify your identity through the approved callback process, then help you register your new device.",
    edited: "Thanks for the details. A service desk specialist will call your registered number shortly to verify your identity, then help you register your new device.",
    escalation: 'Identity could not be verified. Routed to an L2 identity specialist with the AI summary attached.',
  },
  {
    id: 'REQ-2042',
    channel: 'Chat',
    subject: 'Invoice total does not match the quote',
    message: 'The March invoice is higher than the quote we signed. Can someone explain the difference?',
    category: 'Billing question',
    priority: 'Normal',
    queue: 'Billing operations',
    sop: 'SOP-087 · Invoice discrepancy review',
    summary: 'Customer reports invoice above signed quote. Needs line-item comparison.',
    draft: "Thanks for flagging this. We're comparing the invoice line items with your signed quote and will confirm the difference or issue a correction.",
    edited: "Thanks for flagging this. A billing specialist is comparing each line item with your signed quote and will reply with the difference or a corrected invoice.",
    escalation: 'Pricing exception detected. Routed to billing supervisor for approval.',
  },
  {
    id: 'REQ-2043',
    channel: 'Form',
    subject: 'New starter needs a laptop and accounts',
    message: 'A new analyst joins on Monday. Please prepare a laptop, email, and access to the shared finance folder.',
    category: 'Onboarding',
    priority: 'Normal',
    queue: 'Onboarding desk',
    sop: 'SOP-021 · New starter checklist',
    summary: 'New starter Monday: device, mailbox, finance folder access.',
    draft: "Thanks, we've started the new starter checklist. Finance folder access needs manager approval, so we've requested it before provisioning.",
    edited: "Thanks, the new starter checklist is underway. Finance folder access needs the folder owner's approval; we've requested it and will confirm before Monday.",
    escalation: 'Restricted folder requested. Routed to access owner for approval.',
  },
];

/* --------------------------------------------------------- Cybersecurity */

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface MxdrAlert {
  id: string;
  severity: Severity;
  title: string;
  source: 'Endpoint' | 'Identity' | 'Email' | 'Network';
  asset: string;
  age: string;
  timeline: readonly [string, string, string, string, string];
}

export const mxdrStages = ['Detect', 'Triage', 'Investigate', 'Contain', 'Report'] as const;

export const mxdrAlerts: MxdrAlert[] = [
  {
    id: 'DET-7731',
    severity: 'high',
    title: 'Encoded script execution',
    source: 'Endpoint',
    asset: 'ws-14.corp.example.com',
    age: '2m',
    timeline: [
      'Detection raised for an encoded script launched by an office document.',
      'Severity confirmed High. Three related events correlated on the same host.',
      'Process chain reviewed. Outbound connection to 198.51.100.24 identified.',
      'Host isolation recommended. Analyst approved containment.',
      'Client contact notified with summary, scope, and recommended next steps.',
    ],
  },
  {
    id: 'DET-7729',
    severity: 'medium',
    title: 'Sign-in from unfamiliar location',
    source: 'Identity',
    asset: 'user-0142@example.com',
    age: '9m',
    timeline: [
      'Sign-in flagged from a location not seen for this account.',
      'Severity set Medium. No matching travel or VPN record found.',
      'Session details and recent mailbox activity reviewed.',
      'Session revoked and password reset requested. Analyst approved.',
      'Account owner and client contact informed. Case documented.',
    ],
  },
  {
    id: 'DET-7724',
    severity: 'critical',
    title: 'Rapid file rename pattern',
    source: 'Endpoint',
    asset: 'fs-02.corp.example.com',
    age: '14m',
    timeline: [
      'Detection raised for mass file renames on a file server share.',
      'Severity raised to Critical. Escalation path started immediately.',
      'Originating account and process identified; spread limited to one share.',
      'Account disabled and host isolated. Analyst approved containment.',
      'Client incident contact briefed. Recovery steps handed to the client team.',
    ],
  },
  {
    id: 'DET-7718',
    severity: 'low',
    title: 'New mailbox forwarding rule',
    source: 'Email',
    asset: 'shared-inbox@example.com',
    age: '31m',
    timeline: [
      'New external forwarding rule detected on a shared mailbox.',
      'Severity set Low. Rule created by a known administrator account.',
      'Rule destination and creator activity reviewed.',
      'Rule confirmed as approved change. No containment required.',
      'Finding documented and closed with the approval reference.',
    ],
  },
];

/* ------------------------------------------------------------ Managed IT */

export type DeskTier = 'L1' | 'L2' | 'L3';
export type DeskLocation = DeskTier | 'resolved' | 'pending';

export interface DeskTicket {
  id: string;
  title: string;
  category: string;
  target: string;
}

export interface DeskQueue {
  key: 'helpdesk' | 'product';
  label: string;
  tiers: Record<DeskTier, string>;
  tickets: DeskTicket[];
  initial: Record<string, DeskLocation>;
  events: { ticket: string; to: DeskLocation; note: string }[];
}

export const deskQueues: DeskQueue[] = [
  {
    key: 'helpdesk',
    label: 'Help Desk',
    tiers: { L1: 'Service desk', L2: 'Specialist', L3: 'Senior engineer' },
    tickets: [
      { id: 'HD-1038', title: 'VPN drops on home network', category: 'Network', target: '8h' },
      { id: 'HD-1039', title: 'Printer queue stuck', category: 'Device', target: '4h' },
      { id: 'HD-1040', title: 'Shared mailbox access', category: 'Access', target: '4h' },
      { id: 'HD-1041', title: 'Laptop for new starter', category: 'Onboarding', target: '1d' },
      { id: 'HD-1042', title: 'Password reset', category: 'Access', target: '1h' },
      { id: 'HD-1043', title: 'Finance app install', category: 'Software', target: '1d' },
    ],
    initial: { 'HD-1038': 'L2', 'HD-1039': 'L1', 'HD-1040': 'L1', 'HD-1041': 'pending', 'HD-1042': 'pending', 'HD-1043': 'pending' },
    events: [
      { ticket: 'HD-1041', to: 'L1', note: 'HD-1041 received from the onboarding form' },
      { ticket: 'HD-1040', to: 'resolved', note: 'HD-1040 resolved at L1 after owner approval' },
      { ticket: 'HD-1042', to: 'L1', note: 'HD-1042 received by phone' },
      { ticket: 'HD-1042', to: 'resolved', note: 'HD-1042 identity verified, reset completed at L1' },
      { ticket: 'HD-1041', to: 'L2', note: 'HD-1041 escalated to L2: enrolment profile update' },
      { ticket: 'HD-1038', to: 'L3', note: 'HD-1038 escalated to L3 with diagnostics attached' },
      { ticket: 'HD-1039', to: 'resolved', note: 'HD-1039 resolved at L1, steps documented' },
      { ticket: 'HD-1043', to: 'L1', note: 'HD-1043 received, licence check started' },
      { ticket: 'HD-1041', to: 'resolved', note: 'HD-1041 device enrolled, checklist closed' },
      { ticket: 'HD-1038', to: 'resolved', note: 'HD-1038 root cause found, workaround documented' },
    ],
  },
  {
    key: 'product',
    label: 'Product Support',
    tiers: { L1: 'Support agent', L2: 'Product specialist', L3: 'Engineering liaison' },
    tickets: [
      { id: 'PS-311', title: 'CSV export times out', category: 'Bug report', target: '1d' },
      { id: 'PS-313', title: 'Update billing contact', category: 'Account', target: '4h' },
      { id: 'PS-314', title: 'How to add a team member', category: 'How-to', target: '4h' },
      { id: 'PS-315', title: 'Card declined on renewal', category: 'Billing', target: '4h' },
      { id: 'PS-316', title: 'Webhook signature mismatch', category: 'Integration', target: '1d' },
      { id: 'PS-317', title: 'Change account owner', category: 'Account', target: '1d' },
    ],
    initial: { 'PS-311': 'L2', 'PS-313': 'L1', 'PS-314': 'L1', 'PS-315': 'pending', 'PS-316': 'pending', 'PS-317': 'pending' },
    events: [
      { ticket: 'PS-315', to: 'L1', note: 'PS-315 received via in-app chat' },
      { ticket: 'PS-314', to: 'resolved', note: 'PS-314 answered with help article, confirmed by customer' },
      { ticket: 'PS-316', to: 'L1', note: 'PS-316 received from developer portal' },
      { ticket: 'PS-316', to: 'L2', note: 'PS-316 escalated to L2 with request samples' },
      { ticket: 'PS-313', to: 'resolved', note: 'PS-313 billing contact updated at L1' },
      { ticket: 'PS-311', to: 'L3', note: 'PS-311 reproduced; escalated to engineering liaison' },
      { ticket: 'PS-315', to: 'resolved', note: 'PS-315 payment retried with customer, resolved' },
      { ticket: 'PS-317', to: 'L1', note: 'PS-317 received, ownership verification started' },
      { ticket: 'PS-316', to: 'resolved', note: 'PS-316 clock-skew cause documented for customer' },
      { ticket: 'PS-311', to: 'resolved', note: 'PS-311 fix confirmed, known-issue article updated' },
    ],
  },
];
