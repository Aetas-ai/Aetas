# Aetas Global Innovation Website Handoff

Last updated: July 24, 2026

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

- Astro 7 with prerendered public pages and standalone Node output for on-demand form endpoints
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
- `scripts/security-headers-integration.mjs` and `scripts/security-policy.mjs`: validate generated links and artifacts, derive CSP hashes from final HTML, and generate matching Node and Hostinger/LiteSpeed security policies.
- `scripts/start-server.mjs` and `scripts/server-runtime.mjs`: validate production secrets and generated headers, enforce the fixed canonical origin, apply security headers before serving requests, and start the hardened Node listener.
- `src/middleware.ts`: enforces the production origin for on-demand routes, applies no-store and same-origin API policy, adds noindex protection for reserved preview/admin paths, and converts unexpected API failures into generic responses with non-PII request IDs.
- `src/lib/server/forms.ts`, `src/lib/server/form-security.ts`, `src/lib/server/csrf.ts`, and `src/lib/server/rate-limit.ts`: server-only form schemas, normalized delivery payloads, CSRF protection, bot controls, and bounded per-IP/per-endpoint rate limiting.
- `src/pages/api/forms/`: on-demand contact, AI consultation, readiness brief, and CSRF endpoints.
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
- Contact, AI consultation, and Operations Readiness Brief forms have prepared server-only Astro endpoints, but public form processing is intentionally deferred. Until all three form environment variables are configured, the CSRF and submission endpoints fail closed with a generic unavailable response. Once activated, the endpoints enforce strict field schemas, body and field length limits, Unicode normalization, HTML-safe delivery output, signed CSRF sessions, honeypot and timing checks, and an eight-request-per-ten-minute in-memory limit for each IP and endpoint. The process-local limiter removes expired records and has a strict 10,000-record least-recently-used cap so rotating identifiers cannot grow server memory without bound. Bob remains a local, non-networked assistant; React output encoding, normalized input, and a 300-character cap protect its typed flow without collecting chat text.
- SEO includes canonical URLs, structured data, Open Graph metadata, `robots.txt`, sitemap generation, and `noindex` confirmation pages.
- Production builds generate `dist/client/_headers.json` and `dist/client/.htaccess` from one shared SHA-256 hash-based Content Security Policy. The Node adapter consumes `_headers.json` for prerendered routes, and the production startup wrapper also applies the policy before serving any response, so security headers and fixed-origin redirects do not depend on manually merging build output into Hostinger's managed proxy file. The `.htaccess` remains an optional LiteSpeed defense-in-depth artifact. The policy keeps inline scripts and style blocks hash-restricted; `style-src-attr 'unsafe-inline'` is narrowly retained because Framer Motion and Bob update element styles at runtime. Unused WebAssembly, unpkg, and Webflow permissions are not allowed. The build fails if public source maps or common secret/log artifacts are emitted.
- Astro accepts trusted forwarded host and client-IP headers only for the configured HTTPS `aetas.ai` origin. The form API does not permit cross-origin browser access, never caches responses, and logs only event names and random request IDs rather than submitted fields, email addresses, credentials, or provider response bodies.
- The site has no authentication, admin UI, or CMS preview route. The only cookie is the short-lived CSRF cookie, which is `HttpOnly`, `Secure` in production, `SameSite=Strict`, host-only, and scoped to `/`. Reserved `/admin`, `/cms-preview`, and `/preview` paths receive noindex/no-store protection if introduced later.

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
4. Configure Hostinger to run `npm run build` and start the backend-supported Astro application with `npm start` (`dist/server/entry.mjs`). A frontend-only/static deployment will not run the form endpoints.
5. Form processing is currently deferred, so leave `FORM_CSRF_SECRET`, `FORM_DELIVERY_URL`, and `FORM_DELIVERY_BEARER_TOKEN` unset. Before activating forms, configure all three together in Hostinger environment settings. The CSRF secret must be a high-entropy value of at least 32 characters; the delivery URL must be HTTPS.
6. Leave Hostinger's managed Node proxy `.htaccess` in `public_html` unchanged. `npm start` loads the build-generated `dist/client/_headers.json` and exits if the required policy is absent; the application applies canonical redirects and security headers itself.
7. Run `npm test`, verify the production domain and response headers, and test the changed flows.

Production secrets must be configured in Hostinger environment settings, not committed or included in deployment archives.

## Known Gaps and Priorities

1. Replace remaining placeholder imagery and draft copy with final approved assets and content.
2. Add real case studies only after client and business approval.
3. Activate the prepared form feature soon after the team selects an approved HTTPS delivery service: configure and verify all three documented Hostinger server-only environment variables, then test every public form.
4. Add analytics and consent handling after the business selects an analytics platform and privacy requirements are confirmed.
5. Continue accessibility, performance, and real-device QA after major UI changes.
6. Connect Hostinger to GitHub or CI/CD later if account access permits; keep the documented ZIP workflow until then.

## Development Commands

```sh
npm install
npm run dev
npm test
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
