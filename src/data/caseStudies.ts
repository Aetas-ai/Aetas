export type CaseStudyPillar = 'ai' | 'security' | 'global';

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

// Publish only client-approved, verified case studies.
export const caseStudies: CaseStudy[] = [];
