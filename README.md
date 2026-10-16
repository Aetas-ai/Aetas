# Aetas Global Innovation Company Website

Astro company website for **Aetas Global Innovation (AGI)**. `Aetas.ai` is the company's website and domain identity. The website presents three specialized service areas offered directly by AGI:

- **AI & Automation**: Human Led AI and Business Process AI Assimilation, with Expert Human Oversight of AI (Expert in the Loop).
- **Cybersecurity**: MSSP expertise through Managed Extended Detection and Response (MXDR) and Offensive Security, including Network Security Testing and Application Security Testing (Pen Testing).
- **Managed IT**: MSP expertise through Help Desk as a Service, Product Support as a Service, managed IT, and Business Processes operations.

Read [HANDOFF.md](./HANDOFF.md) before changing positioning, services, partners, major routes, or shared functionality. Use [COLLABORATION.md](./COLLABORATION.md) for installation and team workflow instructions, [SEO-DEPLOYMENT.md](./SEO-DEPLOYMENT.md) for production deployment and search indexing, and [DEPENDENCY-SECURITY.md](./DEPENDENCY-SECURITY.md) when a dependency vulnerability is reported.

Current messaging anchors are maintained in `HANDOFF.md`. Public copy should present AGI naturally as the company and should not repeatedly explain the structure with phrases such as "one company" or "one accountable company."

## Current Experience

- Responsive Astro pages for the company and all three service areas
- Dark-first product visual system with layered surfaces, restrained accent lighting, and distinct service accents
- Compact header with a keyboard-accessible Services mega menu and an accessible mobile navigation sheet
- Custom AGI service-network hero built with inline SVG and CSS
- One code-rendered, clearly simulated service demonstration (React island) per service page in place of generic service imagery
- Viewport-aware dark heroes that account for the fixed header and retain the brand background during Astro transitions
- Interactive service responsibility selector and advisor quiz
- Bob chat assistant loaded as a non-critical React island
- Delayed loading feedback that appears only when a page is genuinely slow
- Centered dark editorial Work and Resources indexes with scoped service accents, readable article detail pages, and fixed-assistant bottom clearance
- Partner logo experiences for approved cloud, AI, and cybersecurity partners
- AGI Operations Readiness Brief registration and download flow
- Protected contact, consultation, and readiness-brief endpoints prepared for Resend notifications, explicit sender/recipient, visitor Reply-To, safe templates, reference IDs, and a shared submit spinner. Real delivery defaults to disabled while approval, DNS, and backend activation are pending; see [EMAIL-SETUP.md](./EMAIL-SETUP.md).
- Canonical metadata, structured data (including FAQ and breadcrumb schema), per-page social share images, robots instructions, a branded 404 page, and generated sitemap
- Application-controlled Node and Hostinger/LiteSpeed security headers with a build-generated, SHA-256 hash-based Content Security Policy
- Canonical HTTPS enforcement, private API caching/CORS policy, public artifact checks, and a published security contact
- A patched dependency baseline (Astro 7.3.5) and PostCSS transitive dependency override; hosted dependency alerts are provided by Hostinger rather than by website runtime code

The homepage network and the service demonstrations are original Aetas components built with SVG, CSS, React, and Tailwind. They do not use the Aceternity globe, Three.js, an animation library, or copied UI components.

## Technical Stack

- Astro 7 with prerendered pages and standalone Node endpoints
- React 19 islands through `@astrojs/react`
- Tailwind CSS 4
- Astro-compatible React islands (not Next.js) with a lightweight `cn` class helper
- Native scrolling and dependency-free Intersection Observer page reveals
- CSS keyframes for React island transitions (no animation library)
- Self-hosted Inter variable font via `@fontsource-variable/inter` (body and headings)
- Code-built visuals in place of content imagery; `astro:assets` remains available for real photography
- Lucide React icons

## Project Structure

```text
src/
  components/        Astro components and interactive React islands
  data/              Navigation, simulated demo data, resources, and approved case-study data
  lib/server/        Server-only form validation, abuse controls, and delivery handling
  layouts/           Shared layout, navigation, metadata, and scripts
  pages/             Astro routes
  styles/            Global Tailwind theme and CSS
scripts/             Build integrations, including production security-header generation
public/              Logos, icons, Bob, illustrations, robots.txt
```

Important homepage files:

- `src/components/HomeHero.astro`: homepage hero structure and service rail
- `src/components/PartnerStrip.astro`, `BriefPromo.astro`, `BriefPreview.astro`: homepage trust strip and Readiness Brief promotion
- `src/components/Faq.astro`, `ServiceFaqSection.astro`, `Breadcrumbs.astro`: FAQ and breadcrumb blocks with structured data (service FAQ answers live in `src/data/service-faqs.ts`)
- `src/components/ResourceThumb.astro`: code-built resource thumbnails
- `scripts/generate-og-images.mjs`: generates `public/og/*.png` share images (`npm run og:generate`)
- `src/components/AgiNetworkGraph.astro`: custom animated AGI service network
- `src/components/PageHero.astro`: shared dark page hero, fixed-header viewport sizing, service accents, and optional calls to action
- `src/components/demos/`: the three code-rendered service demos (one per service page); `demo-runtime.tsx` provides `DemoWindow`, `useSteps`, and `StepTimer`, and `src/data/demos.ts` holds the simulated data
- `src/components/SiteHeader.astro`, `MobileNav.astro`, `SiteFooter.astro`: header, mobile sheet, and footer driven by `src/data/navigation.ts`; behaviour in `src/scripts/site-nav.ts`
- `src/components/AboutVisualGallery.astro`: About page gallery of code-built tiles (approved content and partner logos, no generated imagery)
- `src/data/partner-logos.ts` / `src/components/PartnerLogo.astro`: approved partner logos reused on About; `/partners` remains the source of truth
- `src/pages/index.astro`: homepage sections and interactive islands
- `src/layouts/Layout.astro`: shared shell, SEO metadata, loader, navigation wiring, and Bob assistant
- `src/pages/work.astro`: provisional, non-fabricated case-study presentation
- `src/pages/resources/index.astro`: dark editorial resource index backed by `src/data/resources.ts`
- `scripts/security-headers-integration.mjs`: validates new-tab links, hashes final inline scripts and style blocks, and generates `dist/.htaccess`
- `src/middleware.ts`: hardens on-demand API responses, trusted-origin handling, reserved non-indexed routes, and privacy-preserving error logs
- `src/lib/server/forms.ts`: shared form schemas, safe delivery formatting, and endpoint handling
- `src/lib/server/form-security.ts`: signed CSRF tokens and bounded per-IP/per-endpoint rate limiting

## Visual System

The site is dark-first, so code-rendered product windows sit naturally on the page:

- Layered dark surfaces (`--surface-0` page, `--surface-1` bands via `agi-band` / `section-dark-raised`, `--surface-2` panels and windows, `--surface-3` raised states) with hairline borders (`--line-subtle`, `--line-strong`) carry heroes, services, demos, and partner logos. `agi-glow` adds restrained accent light from a section's top edge; `agi-grid-mask` adds a faint fading grid.
- Light and light-muted bands are reserved for forms, legal pages, and at most one deliberate editorial band per page. The Work and Resources indexes intentionally use dark graphite editorial sections.
- The theme is duotone (Linear-inspired): near-black and off-white with neutral greys, plus ONE muted indigo accent (`--color-accent: #7c80f0`; `--color-accent-ink` on light, `--color-accent-text` on dark) used sparingly for eyebrow dots, active nav, focus rings, links, network lines, and faint glows. The three services are distinguished by icon, name, and 01/02/03 numbering, not by colour. The only other hues are muted status colours inside demo status chips (always paired with text) and the partners' own logo artwork. Do not reintroduce per-service colours or multi-colour gradients.
- Shared design tokens live in `src/styles/global.css`: the fluid type scale (`text-display`, `text-h2`, `text-h3`, `text-lede`), `--section-space`, `--ease-out-expo`, durations, card shadows, the 12 px `--radius-card`, `--radius-control` (buttons, inputs), `--radius-window`, `--shadow-window`, and `--font-mono`. Navigation, band, step-strip, window, segment, and chip classes live in `src/styles/product-ui.css`.
- Text colors are surface-aware: use `text-strong` and `text-muted`, which resolve to light text on dark surfaces and ink inside `section-light`, `section-light-muted`, and `agi-card--light`. Do not put `text-white` or `text-gray-*` inside light bands.
- `accent-ai|security|global|governance` remain as aliases of the single accent (`--accent`, `--accent-ink`, `--accent-text`); prefer `--color-accent` in new code.
- Shared components: `Button.astro` (`tone` dark/light, `variant` primary/secondary, optional `accent` and `arrow`), `SectionHeading.astro` (eyebrow, title, lede), plus the `agi-section`, `agi-card` (`--light`/`--dark`/`--accent`/`--interactive`), `agi-eyebrow`, `agi-step-index`, `agi-field-label`, and `agi-input` classes, and from `product-ui.css` `agi-band`, `agi-steps` / `agi-step`, `agi-check-list`, `agi-window`, `agi-chip` (severity and status variants), `agi-segment`, and `agi-row`. Reuse them before adding page-specific styles.
- Use at most one demo window per service page, never in a hero or on the homepage. Each window shows a quiet "Simulated" label and a caption that the content is illustrative. Demo data uses only reserved example domains and documentation IP ranges, generic roles, and relative times; see HANDOFF.md "Code-rendered demos".
- Motion remains restrained and must respect `prefers-reduced-motion`. Scroll reveals use `data-reveal`, `data-reveal-left`, `data-reveal-right`, and `data-reveal-group` (staggered children). Hero text animates with transform only so it paints immediately. Infinite animations carry `data-motion` and pause while off-screen. Demo windows advance only while on screen and the tab is visible, have a pause/play control, and under reduced motion show Previous/Next step controls instead of autoplay.

## Navigation and Loading Behavior

- Astro `ClientRouter` provides site navigation and transition lifecycle events.
- The header shows Services ▾, Work, Partners, Resources, About, and the contact CTA. Services is a disclosure mega menu (click, keyboard, or hover intent; Escape returns focus). Below lg, a dialog sheet with a focus trap and a Services accordion replaces it. Menus close on route change; listeners are re-bound per page via one `AbortController` in `src/scripts/site-nav.ts`.
- A 650 ms threshold prevents the overlay from flashing during fast loads.
- The original loading presentation keeps Bob centered inside two decorative rings and uses a CSS-driven progress fill.
- The loader retains its polite status region, minimum visible duration, fade cleanup, and `aria-busy` behavior.
- Reduced motion disables ring rotation and the decorative progress scan.
- The former development-only loader preview and replay control are not present.

## Routes

- `/`
- `/ai`, `/security`, `/managed-it`
- `/work`
- `/resources` and `/resources/[slug]`
- `/operations-readiness-brief`
- `/partners`, `/about`, `/careers`, `/contact`
- `/legal/privacy`, `/legal/terms`

The Work page intentionally contains no fabricated case studies or performance results. Publish case studies only after client and business approval.

`/global` is a legacy redirect to `/managed-it` and is excluded from the sitemap.

## Form email setup

Follow [EMAIL-SETUP.md](./EMAIL-SETUP.md) for company Resend account access, `notify.aetas.ai` DNS, private configuration, mocked tests, and Hostinger's Node backend activation. The prepared sender is `forms@notify.aetas.ai`; the confirmed recipient is `info@aetas.ai`, with visitor email as Reply-To. `FORM_DELIVERY_ENABLED=false` keeps real delivery off even when credentials exist. No visitor receipt or provider fallback is enabled. The legacy webhook is a mutually exclusive alternative. Submit buttons show Sending… and a spinner until success/navigation, then recover on errors without clearing fields.

## Commands

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

When managing the Astro development server directly, follow the repository agent instructions:

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Run `npm run build` before pushing or uploading a deployment package.

`npm test` runs the security-focused test suite. `npm run build` runs the same security suite before the Astro production build. Use `npm run` to inspect available scripts and run `git diff --check` alongside the production build before handoff.
