# Aetas Global Innovation Website Handoff

Last updated: October 17, 2026

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
- A lightweight `cn` helper in `src/lib/utils.ts` for composing class names; this is not a Next.js application or a shadcn CLI scaffold
- Native scrolling and lightweight CSS/Intersection Observer reveal animation
- CSS keyframes (`agi-swap-in`, `agi-fade-in`) for React island transitions; Framer Motion has been removed
- Self-hosted Inter and Space Grotesk variable fonts (`@fontsource-variable`), preloaded in `Layout.astro`
- `astro:assets` available for any future real photography (no content rasters are currently used)
- Lucide React icons
- Astro sitemap integration

The homepage does not use Three.js, React Three Fiber, `three-globe`, or the Aceternity globe.

When adapting external React UI examples, keep them Astro-compatible React islands. Do not add `next`, `next/image`, or Next.js-specific routing and client assumptions. Prefer the existing Tailwind tokens, `cn` helper, Astro image conventions, and current dependencies.

## Important Files

- `src/layouts/Layout.astro`: metadata, structured data, slow-load overlay, animation setup, navigation script wiring, and delayed Bob hydration. It renders the header, mobile navigation, and footer components below.
- `src/data/navigation.ts`: single source of truth for header, mobile, and footer links, including each service's capability deep links.
- `src/components/SiteHeader.astro`, `MobileNav.astro`, `SiteFooter.astro`, and `ServiceIcon.astro`: header with the Services mega menu, the mobile navigation sheet, and the data-driven footer.
- `src/scripts/site-nav.ts`: Services disclosure menu and mobile sheet behaviour, re-bound per page through one `AbortController`.
- `src/components/HomeHero.astro`: homepage hero copy, calls to action, AGI network placement, and service navigation rail.
- `src/components/AgiNetworkGraph.astro`: original AGI animated network representing the three specialized service areas.
- `src/components/PageHero.astro`: shared dark page hero, service accents, calls to action, fixed-header viewport sizing, and restrained accent light when no background image is set.
- `src/components/demos/`: the three code-rendered service demos, one per service page (see "Code-rendered demos" below). `src/data/demos.ts` holds their simulated data.
- `src/components/AboutVisualGallery.astro`: About page scrolling gallery of code-built tiles showing approved content only: Expert in the Loop decisions, the approved workflow and engagement steps, MXDR stages, Offensive Security lines, Managed IT tiers and responsibilities, and approved partner logos. No generated imagery.
- `src/data/partner-logos.ts` and `src/components/PartnerLogo.astro`: approved partner names, artwork, and official links for reuse outside `/partners` (About gallery and partners strip). Mirror `src/pages/partners.astro`, which stays the source of truth and is not modified.
- `src/components/Button.astro` and `src/components/SectionHeading.astro`: shared call-to-action and section heading components used across pages.
- `src/lib/utils.ts`: lightweight `cn` class-name helper for shared UI components.
- `src/components/BobAssistant.tsx`: persistent chat assistant interface and local service answers.
- `src/components/ManagedSystems.tsx`: interactive responsibility selector.
- `src/components/AdvisorQuiz.tsx`: three-step service-routing quiz.
- `scripts/security-headers-integration.mjs` and `scripts/security-policy.mjs`: validate generated links and artifacts, derive CSP hashes from final HTML, and generate matching Node and Hostinger/LiteSpeed security policies.
- `scripts/start-server.mjs` and `scripts/server-runtime.mjs`: validate production secrets and generated headers, enforce the fixed canonical origin, apply security headers before serving requests, and start the hardened Node listener.
- `DEPENDENCY-SECURITY.md`: step-by-step dependency vulnerability verification, remediation, testing, and Hostinger redeployment workflow.
- `EMAIL-SETUP.md`: Resend account/DNS handoff, explicit activation gate, sender/recipient settings, mocked verification, and Hostinger backend activation.
- `src/middleware.ts`: enforces the production origin for on-demand routes, applies no-store and same-origin API policy, adds noindex protection for reserved preview/admin paths, and converts unexpected API failures into generic responses with non-PII request IDs.
- `src/lib/server/forms.ts`, `src/lib/server/form-security.ts`, `src/lib/server/csrf.ts`, and `src/lib/server/rate-limit.ts`: server-only form schemas, normalized delivery payloads, CSRF protection, bot controls, and bounded per-IP/per-endpoint rate limiting.
- `src/pages/api/forms/`: on-demand contact, AI consultation, readiness brief, and CSRF endpoints.
- `src/pages/index.astro`: homepage sections.
- `src/pages/ai.astro`, `security.astro`, `managed-it.astro`: service pages.
- `src/pages/global.astro`: legacy redirect to `/managed-it`; excluded from the sitemap.
- `src/pages/partners.astro`: approved partner displays and links.
- `src/pages/work.astro`: dark provisional case-study presentation with no fabricated client work.
- `src/pages/resources/index.astro`: dark editorial resource index backed by the approved shared resource data.
- `src/pages/operations-readiness-brief.astro`: registration page for the AGI Operations Readiness Brief.
- `src/data/caseStudies.ts`: intentionally empty until verified case studies are approved.
- `src/data/resources.ts`: shared resource content.

## Current Implementation

- The visual system is dark-first: layered dark surfaces (`--surface-0` to `--surface-3`, `agi-band`, `section-dark-raised`) carry most pages so code-rendered product windows sit naturally on them. Light bands (`section-light`, `section-light-muted`) are reserved for forms, legal pages, and at most one deliberate editorial band per page.
- Service accents are intentionally scoped: violet for AI & Automation, cyan for Cybersecurity, amber for Managed IT, and green for governance or reviewed states. Do not recolor entire pages by service.
- Reusable theme utilities are defined in `src/styles/global.css`: `section-light`, `section-light-muted`, `section-dark-raised`, `section-spectrum`, `media-frame-light`, `form-on-light`, and the scoped dark editorial `agi-*` card, label, button, and Bob-clearance utilities. `button-on-light-*` and `editorial-card` remain for the approved Partners callout.
- Shared design tokens live in `src/styles/global.css`: the fluid type scale (`text-display`, `text-h2`, `text-h3`, `text-lede`), `--section-space`, `--ease-out-expo`, durations, card shadows, the 12 px `--radius-card`, `--radius-control`, `--radius-window`, `--shadow-window`, the dark elevation surfaces, `--line-subtle` / `--line-strong`, and `--font-mono` (system monospace for demo data). Navigation, band, step-strip, window, and chip classes live in `src/styles/product-ui.css`, imported by `global.css`.
- Text colors are surface-aware: use `text-strong` and `text-muted`, which resolve to light text on dark surfaces and ink inside `section-light`, `section-light-muted`, and `agi-card--light`. Do not put `text-white` or `text-gray-*` inside light bands.
- Service accents come from `accent-ai`, `accent-security`, `accent-global`, and `accent-governance`, which set `--accent` (brand hue), `--accent-ink` (readable on light), and `--accent-text` (readable on dark).
- Shared components: `Button.astro` (`tone` dark/light, `variant` primary/secondary, optional `accent` and `arrow`), `SectionHeading.astro` (eyebrow, title, lede), plus the `agi-section`, `agi-card` (`--light`/`--dark`/`--accent`/`--interactive`), `agi-eyebrow`, `agi-step-index`, `agi-field-label`, and `agi-input` classes. Reuse them before adding page-specific styles.
- Partner-logo displays remain on dark surfaces because several approved official logos are white. Their surrounding explanatory and conversion content can use the light editorial system.
- Cards use restrained 12 px radii, low-contrast borders, and subtle elevation. On dark surfaces the accent is a fading top hairline rather than a solid bar. Preserve this operational, enterprise-focused treatment instead of introducing oversized rounded cards, heavy glassmorphism, or decorative glow.
- The homepage hero uses the original inline SVG and CSS AGI service network. The three labeled nodes link to AI & Automation, Cybersecurity, and Managed IT. Network motion uses lightweight stroke, pulse, and rotation animation and respects `prefers-reduced-motion`.
- The homepage service section uses three data-free service panels (icon, approved heading, scope, capabilities, link). Do not put simulated interface windows in heroes or on the homepage.
- The homepage hero fills at least the visible viewport below the fixed header. Its service-navigation rail has persistent low-opacity violet, cyan, and amber surfaces and accents so the three practices remain distinct before hover or keyboard focus.
- The hero was verified at desktop and true 390 px mobile emulation without horizontal overflow.
- The former 3D globe dependency chain was removed. The production build no longer generates the previous multi-megabyte globe bundle.
- Bob loads with `client:idle` and a timeout so it does not block critical rendering.
- The root `html`, `body`, `main`, and view-transition surfaces use the existing dark brand background. Full-height shared heroes subtract `--site-header-height` from viewport-height fallbacks so transparent or short content cannot expose a default white strip.
- The original site loading overlay featuring Bob waits 650 ms before appearing and therefore only displays for genuinely slower loads or transitions. Bob remains centered inside two decorative rings while a CSS-driven progress fill advances independently below him.
- The loader retains its singleton initialization guard, approximately 220 ms minimum visibility, 160 ms fade cleanup, initial-document support, Astro preparation/page-load hooks, `pageshow` safeguard, polite status region, and active-main `aria-busy` handling.
- Reduced motion leaves the loader readable while disabling ring rotation and the decorative progress scan. The loader does not display a percentage, use phase-specific labels, move Bob horizontally, or animate whole-character gesture states.
- The temporary development-only loader preview, query-string activation, simulated sequence, console message, and replay button have been removed.
- Brand imagery uses optimized WebP assets: `aetasBrand.webp`, `aetasIcon.webp`, and `bob.webp`.
- The header uses the full Aetas Global Innovation logo on desktop and mobile. The icon is used for favicon and assistant identity contexts.

## Navigation

- The header is 4 rem (`--site-header-height`) and translucent, becoming more solid after scrolling. Desktop (lg and up) shows: logo, **Services ▾**, Work, Partners, Resources, About, and the "Talk to AGI" CTA. The logo links home, so there is no separate Home link.
- **Services** follows the WAI-ARIA disclosure navigation pattern (a `<button aria-expanded aria-controls>`, not `role="menu"`). Its panel has one column per service (title link, tag, one-line blurb, capability deep links) and a "Take the service finder" link to `/#service-finder`.
  - Opens on click, Enter/Space, ArrowDown (focuses the first link), or mouse hover intent.
  - Closes on Escape (focus returns to the trigger), outside click, focus leaving the menu, link activation, or route change.
  - Inside the panel, Up/Down move through links, Left/Right move between columns, and Home/End jump to the ends.
- The Services trigger is marked active on any service page (`activePillar` or the URL).
- Below lg, the hamburger (`aria-expanded`) opens a full-height `role="dialog" aria-modal="true"` sheet with a focus trap, Escape to close, body scroll lock, focus return, a Services accordion (expanded on service pages), the primary links, and the CTA.
- Capability deep links: `/ai#services`, `/ai#assimilation`, `/ai#expert-in-the-loop`, `/security#mxdr`, `/security#network-testing`, `/security#application-testing`, `/managed-it#help-desk`, `/managed-it#product-support`, `/managed-it#operations`. Keep these IDs on the service pages. `html` sets `scroll-padding-top` so anchors land below the fixed header.
- All links come from `src/data/navigation.ts`. Careers (`/careers`) remains unlinked, as before.

## Code-rendered demos

Each service page has exactly one interactive React interface demo, placed in a body section (never in a hero, and none on the homepage). Keep it that way: repeated simulated windows were reviewed and rejected as cluttered.

| Demo | Where | What it shows |
|---|---|---|
| `ExpertReviewQueue` | `/ai`, "A visible AI control layer" | AI classifies, retrieves an approved SOP, drafts a reply, then waits for an expert to approve, edit, or escalate |
| `MxdrConsole` | `/security`, "Focused coverage" | Detections by severity moving through detect, triage, investigate, analyst-approved containment, and client reporting |
| `ServiceDeskQueue` | `/managed-it`, "Operations Visibility" | Help Desk and Product Support tickets moving L1 → L2 → L3, resolved and documented |

Rules for every demo:

- Each window shows a quiet "Simulated" label in its title bar and a caption stating it is an illustrative example with simulated data, not a live system. Never add "live" indicators.
- Data lives only in `src/data/demos.ts` and uses reserved values: `*.example.com` hosts, documentation IP ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24), generic roles, and relative times. No vendor, tool, or client names, and no figures that read as real AGI performance results.
- AI demos always show a human decision before customer, system, or policy impact; security containment always shows analyst approval.
- `DemoWindow` and `useSteps` (`demo-runtime.tsx`) only advance while the window is on screen and the tab is visible. Each window has a pause/play control. Under `prefers-reduced-motion` there is no autoplay, and Previous/Next step controls replace the timer.
- Islands are server-rendered first (the HTML is the first frame) and hydrate with `client:visible`. Styling uses classes and inline `style` attributes only; never inject `<style>` at runtime (CSP).
- Service page and About heroes are text-led (copy, CTAs, and on service pages the focus list) with accent light. The Operations Readiness Brief hero is text-led too, and its body shows a code-built preview of the brief (a stacked document listing the topics named in the approved page description). All former generated images and the brief's stock illustration were removed; the site uses no content rasters. Contact and Resources still use undraw illustrations from `public/`.

## About page

- Sections in order: text-led hero; "Why the name AGI" (the one light editorial band); the code-built gallery ("Specialized expertise across three service areas"); a need → service mapping ("Specialized expertise for different operational needs") whose needs and scopes reuse the service-finder wording; principles; a technology partners strip (approved Cloud & AI and Cybersecurity logos linking to official sites in a new tab, plus a link to `/partners`); an FAQ (`<details>` items written only from approved copy); and the closing CTA.
- Leadership, team, company facts, and careers content are not shown; add them only with real, approved details.
- The homepage responsibility selector and advisor quiz (section `#service-finder`) are interactive React islands hydrated with `client:visible`.
- Site-wide page reveals use dependency-free Intersection Observer and CSS transitions; Lenis, GSAP, and ScrollTrigger are not globally bundled.
- The Work page contains no fabricated studies; `caseStudies` remains empty.
- The Work page presents its three explicitly provisional practice areas as equal-height dark panels with persistent service accents and an honest “In preparation” status.
- The Resources index uses dark graphite editorial cards, compact decorative thumbnails, existing titles/summaries/authors/dates, and scoped service-category accents. No resource metadata was invented.
- Work and Resources keep their `max-w-7xl` content geometrically centered at every breakpoint. Shared bottom clearance prevents the fixed Bob assistant from obscuring final actions without applying a one-sided desktop inset that shifts the grids off center. Resource detail pages use a readable `max-w-3xl` editorial measure and the same bottom clearance. The assistant component and behavior are unchanged.
- The homepage and Managed IT responsibility selector uses one tab column on phones, two on small tablets, and up to four on desktop so long service labels remain readable and tappable. The Advisor Quiz follows the same restrained 8 px card radius and responsive inner padding as the rest of the interface.
- The site includes the AGI Operations Readiness Brief registration and confirmation flow.
- Contact, AI consultation, and Operations Readiness Brief forms have prepared Resend notifications with sender `forms@notify.aetas.ai`, confirmed recipient `info@aetas.ai`, visitor Reply-To, escaped HTML/plain text, and a shared reference/timestamp. `FORM_DELIVERY_ENABLED` defaults to false; real sending is disabled pending Sir Rob's approval, the company account, verified DNS, and Hostinger backend activation. Saved Brevo credentials do not activate sending. No visitor autoresponder, automatic retry, provider fallback, or simultaneous webhook delivery is enabled. Resend requests use reference-based idempotency and require a provider message ID for acceptance. Shared submit buttons display a reduced-motion-aware spinner and Sending… label, block duplicate clicks, remain pending through thank-you navigation, and restore fields/button state on errors or back navigation. See `EMAIL-SETUP.md`. Disabled or invalid backend configuration returns generic unavailable responses and no CSRF session; the frontend-only deployment does not serve the endpoints. Once activated, the endpoints enforce strict field schemas, body and field length limits, Unicode normalization, HTML-safe delivery output, signed CSRF sessions, honeypot and timing checks, and an eight-request-per-ten-minute in-memory limit for each IP and endpoint that counts only verified, well-formed submissions. The process-local limiter removes expired records and has a strict 10,000-record least-recently-used cap so rotating identifiers cannot grow server memory without bound. Bob remains a local, non-networked assistant; React output encoding, normalized input, and a 300-character cap protect its typed flow without collecting chat text.
- SEO includes canonical URLs, structured data, Open Graph metadata, `robots.txt`, sitemap generation, and `noindex` confirmation pages.
- Production builds keep prerendered public files at the `dist` root for compatibility with the existing Hostinger `dist` output setting. The future standalone Node bundle builds separately into `dist-server` so server code is never placed inside the public frontend output. The build generates `dist/_headers.json` and `dist/.htaccess` from one shared SHA-256 hash-based Content Security Policy. The Node adapter consumes `_headers.json` for prerendered routes, and the production startup wrapper also applies the policy before serving any response. The `.htaccess` provides LiteSpeed defense in depth when Hostinger serves the frontend output directly. The policy keeps inline scripts and style blocks hash-restricted; `style-src-attr 'unsafe-inline'` is narrowly retained because Bob and the scroll-reveal stagger update element styles at runtime. Unused WebAssembly, unpkg, and Webflow permissions are not allowed. The build fails if public source maps or common secret/log artifacts are emitted.
- `package.json` pins the transitive PostCSS dependency to patched version `8.5.25` through npm overrides in response to `GHSA-r28c-9q8g-f849`. Hostinger provides the hosted dependency alerting; the website itself does not run a dependency-vulnerability scanner. Review and update the override when Vite's dependency chain moves beyond the affected PostCSS range.
- Astro accepts trusted forwarded host and client-IP headers only for the configured HTTPS `aetas.ai` origin. The form API does not permit cross-origin browser access, never caches responses, and logs only event names, random request IDs, and coarse delivery failure reasons/status codes rather than submitted fields, email addresses, credentials, or provider response bodies.
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
4. Keep the current Hostinger Web App settings at Astro, Node.js 22.x, npm, build command `npm run build`, and output directory `dist`. Public pages and assets intentionally build directly into `dist`.
5. The frontend deployment does not serve `/api/forms/*`. Keep `FORM_DELIVERY_ENABLED=false` until approval and DNS verification. For activation, use a backend-supported Astro deployment with `npm start`, enable the flag, and configure `FORM_CSRF_SECRET`, `RESEND_API_KEY`, `FORM_SENDER_EMAIL=forms@notify.aetas.ai`, and `CONTACT_RECIPIENT_EMAIL=info@aetas.ai`. Remove obsolete Brevo settings and leave webhook settings unset for Resend. The existing HTTPS webhook remains a mutually exclusive alternative. Follow `EMAIL-SETUP.md`; no live Resend verification or deployment has occurred.
6. The current frontend deployment uses `dist/.htaccess` for its generated security policy. When switching to the backend deployment, leave Hostinger's managed Node proxy `.htaccess` in `public_html` unchanged; `npm start` loads `dist/_headers.json` and applies the policy in the Node application.
7. Run `npm test`, verify the production domain and response headers, and test the changed flows.

Production secrets must be configured in Hostinger environment settings, not committed or included in deployment archives.

## Known Gaps and Priorities

1. Replace remaining placeholder imagery and draft copy with final approved assets and content.
2. Add real case studies only after client and business approval.
3. Obtain approval, provision the company Resend account, verify `notify.aetas.ai` DNS, and configure a restricted sending key. Activate the Hostinger backend and confirm delivery/replies to the approved `info@aetas.ai` mailbox using `EMAIL-SETUP.md`.
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
