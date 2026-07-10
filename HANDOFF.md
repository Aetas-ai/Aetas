# Aetas.ai Website Handoff

Last updated: July 11, 2026

This file is the source of truth for future AI coding assistants and developers working on the Aetas.ai company website. Read this before changing the site.

## Company Positioning

Aetas.ai is a unified company website for three related disciplines:

- **Aetas AI**: active AI-augmented workflow automation services for BPO, helpdesk, support, IT operations, and back-office workflows. Position the service around practical automation, AI assistance, and human-reviewed execution.
- **Aetas Security**: active MSSP business. Services include SOC/MDR support, penetration testing, incident response planning, vulnerability management, compliance support, and security tool procurement/co-management.
- **Aetas Global**: active MSP/BPO operations business. Services include helpdesk operations, identity/access support, device management, tenant administration, outsourced support queues, and operational reporting.

Core message:

> Human-led AI for security and operations, built on real service delivery.

## Critical Copy Rules

- Do not invent AI production client results, metrics, or customer logos unless verified by the business.
- Do not invent AI case studies, customer logos, certifications, partner tiers, addresses, testimonials, or performance metrics.
- Security and Global can use present-tense service language because they are active pillars.
- AI copy should present active services while keeping human validation and governance clear.
- Partner and certification claims should be displayed only after business verification.

## Current Technical Stack

- Astro 7
- React 19 islands through `@astrojs/react`
- Tailwind CSS 4 via `@tailwindcss/vite`
- GSAP + ScrollTrigger for scroll reveals
- Lenis for smooth scrolling
- Framer Motion for React island transitions
- Recharts is installed but the dashboard simulation is not currently used on the homepage.
- Lucide React icons

## Current Site Structure

Important files:

- `src/layouts/Layout.astro`: shared shell, navigation, footer, sticky CTA, GSAP/Lenis initialization.
- `src/pages/index.astro`: homepage with service positioning, partner marquee, operating-model section, advisor quiz, selected work.
- `src/pages/ai.astro`: AI workflow automation services page.
- `src/pages/security.astro`: MSSP/SOC/security services page.
- `src/pages/global.astro`: MSP/BPO/managed operations page.
- `src/pages/work.astro`: case study index.
- `src/pages/work/[slug].astro`: case study detail route.
- `src/pages/resources/index.astro`: resource index.
- `src/pages/resources/[slug].astro`: resource article route.
- `src/pages/about.astro`: intentionally blank placeholder while company story and leadership content are being planned.
- `src/data/caseStudies.ts`: current anonymized case-study data.
- `src/data/resources.ts`: current resource article data.

## Current Implementation Status

Completed in the latest improvement pass:

- Rebuilt homepage positioning around AI workflow automation, Security, and Global operations.
- Added missing `/work` and `/work/[slug]` routes.
- Added missing `/resources/[slug]` route.
- Replaced hardcoded resource cards with shared resource data.
- Rewrote Security page to avoid overclaiming AI-driven security services.
- Rewrote Global page around managed IT, helpdesk, identity, device, tenant, and BPO operations.
- Wired `ManagedSystems`, `AdvisorQuiz`, and `CoManagementHub` into relevant pages.
- Removed the homepage operational dashboard simulation and replaced it with a four-step operating model section.
- Refactored the homepage partnership marquee so hovering or focusing anywhere on the marquee strip pauses the entire animation, not just one duplicated track.
- Blanked the About page intentionally until final company story, leadership, and credibility content are defined.
- Added Netlify-style static forms for contact and AI workflow service inquiries.
- Added `/contact/thanks`.
- Replaced the old starter README with project-specific instructions.
- Added `COLLABORATION.md` for clone, install, local setup, and collaboration workflow instructions.
- Added basic Open Graph/Twitter metadata.
- Added reduced-motion handling.
- Removed the old `PRD.md` in favor of this handoff.

## Known Gaps and Next Priorities

1. Confirm real business facts:
   - certifications
   - partner tiers
   - office locations
   - testimonials
   - customer metrics
   - approved logos

2. Confirm form hosting:
   - Current forms use static Netlify-style attributes.
   - If hosting is Vercel, replace with API route, serverless function, or external form provider.

3. Add richer content:
   - real case studies
   - real blog/resource articles
   - partner descriptions
   - leadership/team content
   - validated careers content

4. Improve design assets:
   - replace text-only partner marquee with approved logos
   - add better service-specific imagery
   - review mobile spacing and long text blocks

5. Technical improvements:
   - add sitemap integration
   - add robots.txt
   - add analytics events for CTA and form submits
   - add accessibility QA
   - consider Astro Content Collections if content volume grows

## Development Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

Repository agent instruction for dev servers:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

## First Commit Message Recommendation

Use this after verifying the build:

```text
Initial Aetas.ai website build
```

Expanded body if needed:

```text
- Build unified Astro site for Aetas AI, Security, and Global
- Add service pages, work/resources routes, interactive React islands, and contact flows
- Document current positioning and future handoff guidance
```
