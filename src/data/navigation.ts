/**
 * Single source of truth for the header, mobile navigation, and footer.
 * Service names and capability labels follow HANDOFF.md; keep them in sync
 * when approved positioning changes.
 */

export type ServiceKey = 'ai' | 'security' | 'managed-it';
export type ServiceAccent = 'ai' | 'security' | 'global';

export interface NavLink {
  label: string;
  href: string;
  /** Optional expansion shown under the label in the desktop mega menu. */
  hint?: string;
}

export interface ServiceNavItem extends NavLink {
  key: ServiceKey;
  accent: ServiceAccent;
  tag: string;
  blurb: string;
  capabilities: NavLink[];
}

export const serviceNav: ServiceNavItem[] = [
  {
    key: 'ai',
    label: 'AI & Automation',
    href: '/ai',
    accent: 'ai',
    tag: 'Human Led AI',
    blurb: 'Human Led AI inside your Business Processes, with expert review before impact.',
    capabilities: [
      { label: 'Human Led AI', href: '/ai#services', hint: 'Workflow automation and private knowledge assistants' },
      { label: 'Business Process AI Assimilation', href: '/ai#assimilation', hint: 'AI support inside delivery teams' },
      { label: 'Expert in the Loop', href: '/ai#expert-in-the-loop', hint: 'Expert Human Oversight of AI' },
    ],
  },
  {
    key: 'security',
    label: 'Cybersecurity',
    href: '/security',
    accent: 'security',
    tag: 'MSSP',
    blurb: 'Managed detection and response, plus dedicated offensive security testing.',
    capabilities: [
      { label: 'MXDR', href: '/security#mxdr', hint: 'Managed Extended Detection and Response' },
      { label: 'Network Security Testing', href: '/security#network-testing', hint: 'Offensive Security' },
      { label: 'Application Security Testing', href: '/security#application-testing', hint: 'Pen Testing' },
    ],
  },
  {
    key: 'managed-it',
    label: 'Managed IT',
    href: '/managed-it',
    accent: 'global',
    tag: 'MSP',
    blurb: 'Dependable support queues, administration, and outsourced operations.',
    capabilities: [
      { label: 'Help Desk as a Service', href: '/managed-it#help-desk', hint: 'L1-L3 user support and escalation' },
      { label: 'Product Support as a Service', href: '/managed-it#product-support', hint: 'Customer and product support queues' },
      { label: 'Business Processes operations', href: '/managed-it#operations', hint: 'Recurring operational work and reporting' },
    ],
  },
];

export const primaryNav: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Partners', href: '/partners' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

export const contactLink: NavLink = { label: 'Talk to AGI', href: '/contact' };
export const serviceFinderLink: NavLink = { label: 'Take the service finder', href: '/#service-finder' };

export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Technology Partners', href: '/partners' },
      { label: 'Selected Work', href: '/work' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights & Intel', href: '/resources' },
      { label: 'AGI Readiness Brief', href: '/operations-readiness-brief' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms of Service', href: '/legal/terms' },
    ],
  },
];

const servicePaths: Record<ServiceKey, string> = { ai: '/ai', security: '/security', 'managed-it': '/managed-it' };

export const isActivePath = (currentPath: string, href: string) => {
  const path = href.split('#')[0];
  if (path === '/') return currentPath === '/';
  return currentPath === path || currentPath.startsWith(`${path}/`);
};

/** The active service comes from the page's activePillar, falling back to the URL. */
export const activeService = (currentPath: string, activePillar: ServiceKey | 'none'): ServiceKey | undefined => {
  if (activePillar !== 'none') return activePillar;
  return (Object.keys(servicePaths) as ServiceKey[]).find((key) => isActivePath(currentPath, servicePaths[key]));
};
