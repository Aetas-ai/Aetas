# Aetas Global Innovation Website Handoff

Last updated: July 22, 2026

This is the primary implementation and positioning reference for developers and coding assistants working on the Aetas Global Innovation website.

## Company Positioning

**Aetas Global Innovation** is the company name. **AGI** is the company acronym and intentionally connects the brand with artificial intelligence. `Aetas.ai` is the website and domain identity.

The website presents three specialized service areas offered directly by AGI:

- **AI & Automation**: Human Led AI and Business Process AI Assimilation for operational workflows, with Expert Human Oversight of AI (Expert in the Loop).
- **Cybersecurity**: MSSP expertise through Managed Extended Detection and Response (MXDR) and Offensive Security. Offensive Security includes Network Security Testing and Application Security Testing (Pen Testing).
- **Managed IT**: MSP expertise through Help Desk as a Service, Product Support as a Service, managed IT, and Business Processes operations.

Do not present these service areas as separate Aetas companies or brands. They are AGI services, and AGI brings in the specialists appropriate to the requested requirement.

## Approved Messaging Baseline

Use this as the current public messaging baseline. Do not casually replace these headings with generic technology language or unsupported claims:

- **Homepage hero:** "Make complex operations easier to run."
- **Homepage service introduction:** "Specialized expertise. Coordinated around your business."
- **AI & Automation hero:** "Put Human Led AI to work inside your Business Processes."
- **Cybersecurity hero:** "Detect threats. Test defenses. Strengthen resilience."
- **Managed IT hero:** "Keep IT support and outsourced operations moving."
- **About hero:** "Specialized expertise for intelligent, secure operations."

These phrases may be changed when requested by the team, but related metadata, supporting copy, navigation, and documentation must remain consistent after a change.

Public service names and routes:

- **AI & Automation**: `/ai`
- **Cybersecurity**: `/security`
- **Managed IT**: `/managed-it`

`Aetas.ai` is the domain identity, not a separate AI company or service brand. Do not restore public navigation or copy that presents "Aetas AI," "Aetas Security," or "Aetas Global" as separate organizations.

## Critical Copy Rules

- Use the exact company name **Aetas Global Innovation**.
- Present AGI naturally as the company; do not repeatedly explain it with public-facing phrases such as "one company" or "one accountable company."
- Always spell out **Business Processes**; do not introduce an abbreviation on the public website.
- Use **Human Led AI** and **Expert Human Oversight of AI (Expert in the Loop)** where AI governance is relevant.
- Do not imply fully autonomous AI execution. Describe defined review, approval, and escalation paths.
- Do not name internal service-delivery platforms, ticketing systems, or operational tools.
- Do not frame cybersecurity services around one vendor-specific platform.
- Do not invent customers, production results, metrics, case studies, certifications, partner tiers, addresses, or testimonials.
- Publish partner claims and logos only after business approval.
- Keep the three service areas distinct. AI workflow assimilation is not part of Cybersecurity or Managed IT, and those services should not be described as one combined offering.

## Current Technical Stack

- Astro 7 static output
- React 19 islands through `@astrojs/react`
- Tailwind CSS 4 through `@tailwindcss/vite`
- Shadcn-compatible organization through `src/components/ui` and `src/lib/utils.ts`; this is not a Next.js application or a full shadcn CLI scaffold
- Native scrolling and lightweight CSS/Intersection Observer reveal animation
- Framer Motion for React island transitions
- Lucide React icons
- Astro sitemap integration

The homepage does not use Three.js, React Three Fiber, `three-globe`, or the Aceternity globe.

When adapting external React UI examples, keep them Astro-compatible React islands. Do not add `next`, `next/image`, or Next.js-specific routing and client assumptions. Prefer the existing Tailwind tokens, `cn` helper, Astro image conventions, and current dependencies.

## Important Files

- `src/layouts/Layout.astro`: metadata, structured data, header, mobile navigation, footer, slow-load overlay, animation setup, and delayed Bob hydration.
- `src/components/HomeHero.astro`: homepage hero copy, calls to action, custom network placement, and service navigation rail.
- `src/components/AgiNetworkGraph.astro`: original AGI animated network representing the three specialized service areas.
- `src/components/AboutVisualGallery.astro`: lightweight animated About page visual gallery using current sample imagery.
- `src/components/ui/feature-carousel.tsx`: Astro-compatible React island used on the homepage and hydrated with `client:visible`.
- `src/components/ui/container-scroll-animation.tsx`: available UI component; currently not rendered by a public page.
- `src/lib/utils.ts`: lightweight `cn` class-name helper for shared UI components.
- `src/components/BobAssistant.tsx`: persistent chat assistant interface and local service answers.
- `src/components/ManagedSystems.tsx`: interactive responsibility selector.
- `src/components/AdvisorQuiz.tsx`: three-step service-routing quiz.
- `src/pages/index.astro`: homepage sections.
- `src/pages/ai.astro`, `security.astro`, `managed-it.astro`: service pages.
- `src/pages/global.astro`: legacy redirect to `/managed-it`; excluded from the sitemap.
- `src/pages/partners.astro`: approved partner displays and links.
- `src/pages/operations-readiness-brief.astro`: registration page for the AGI Operations Readiness Brief.
- `src/data/caseStudies.ts`: intentionally empty until verified case studies are approved.
- `src/data/resources.ts`: shared resource content.

## Current Implementation

- The visual system uses hybrid enterprise contrast: dark technical/immersive sections alternate with light editorial and conversion bands so the site is not dominated by one color family.
- Service accents are intentionally scoped: violet for AI & Automation, cyan for Cybersecurity, amber for Managed IT, and green for governance or reviewed states. Do not recolor entire pages by service.
- Reusable theme utilities are defined in `src/styles/global.css`: `section-light`, `section-light-muted`, `section-dark-raised`, `section-spectrum`, `service-card-*`, `media-frame-light`, `button-on-light-*`, and `form-on-light`.
- Partner-logo displays remain on dark surfaces because several approved official logos are white. Their surrounding explanatory and conversion content can use the light editorial system.
- Light-surface cards use restrained 8 px radii, low-contrast borders, and subtle elevation. Preserve this operational, enterprise-focused treatment instead of introducing oversized rounded cards or decorative color effects.
- The homepage hero uses an original inline SVG and CSS AGI service network. The three labeled nodes link to AI & Automation, Cybersecurity, and Managed IT.
- Network motion uses lightweight stroke, pulse, and rotation animation and respects `prefers-reduced-motion`.
- The hero was verified at desktop and true 390 px mobile emulation without horizontal overflow.
- The former 3D globe dependency chain was removed. The production build no longer generates the previous multi-megabyte globe bundle.
- Bob loads with `client:idle` and a timeout so it does not block critical rendering.
- The site loading overlay featuring Bob waits 650 ms before appearing and therefore only displays for genuinely slower loads or transitions.
- Brand imagery uses optimized WebP assets: `aetasBrand.webp`, `aetasIcon.webp`, and `bob.webp`.
- The header uses the full Aetas Global Innovation logo on desktop and mobile. The icon is used for favicon and assistant identity contexts.
- The homepage responsibility selector and advisor quiz are interactive React islands hydrated with `client:visible`.
- Site-wide page reveals use dependency-free Intersection Observer and CSS transitions; Lenis, GSAP, and ScrollTrigger are not globally bundled.
- The Work page contains no fabricated studies; `caseStudies` remains empty.
- The site includes the AGI Operations Readiness Brief registration and confirmation flow.
- SEO includes canonical URLs, structured data, Open Graph metadata, `robots.txt`, sitemap generation, and `noindex` confirmation pages.

## Required Change Workflow

Before modifying the website:

1. Read this file and the relevant source page or shared component.
2. Search the repository for affected terminology before changing positioning, services, routes, partner names, or shared copy.
3. Preserve the existing Astro, Tailwind, and React-island patterns unless a requested change requires otherwise.
4. Keep edits scoped. Do not add services, claims, partners, metrics, or dependencies that were not requested and approved.
5. Test affected interactions and responsive layouts, especially at approximately 390 px, 768 px, and desktop widths.
6. Run `npm run build` and review the changed files before handoff.
7. Update this file when positioning, approved messaging, routes, partners, architecture, deployment, or known gaps change.

## Partner Displays

The current partner page contains business-approved displays for:

- Microsoft Azure
- Amazon Web Services
- Google Cloud
- Anthropic
- SentinelOne
- Zscaler
- Abnormal
- Qualys
- Sublime Security
- Proofpoint
- CrowdStrike

Cloud and AI partners use a responsive grid with entrance animation. Cybersecurity partners use a continuous marquee that pauses for reduced motion. Partner links open official websites in a new tab.

## Hosting and Deployment

Production is currently deployed as a Hostinger Web App through source ZIP upload. GitHub is the source of truth, but Hostinger is not currently connected directly to the repository.

Current update flow:

1. Merge approved changes into `main`.
2. Download or prepare the latest source ZIP.
3. Redeploy the Hostinger Web App with that ZIP.
4. Allow Hostinger to install dependencies and run the Astro build.
5. Verify the production domain and changed flows.

Production secrets must be configured in Hostinger environment settings, not committed or included in deployment archives.

## Known Gaps and Priorities

1. Replace remaining placeholder imagery and draft copy with final approved assets and content.
2. Add real case studies only after client and business approval.
3. Confirm the production form-processing solution. Current forms use static Netlify-style attributes, which require validation on Hostinger or replacement with a compatible endpoint/provider.
4. Add analytics and consent handling after the business selects an analytics platform and privacy requirements are confirmed.
5. Continue accessibility, performance, and real-device QA after major UI changes.
6. Connect Hostinger to GitHub or CI/CD later if account access permits; keep the documented ZIP workflow until then.

## Development Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

Repository background server commands:

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```
