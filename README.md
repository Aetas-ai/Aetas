# Aetas Global Innovation Company Website

Astro company website for **Aetas Global Innovation (AGI)**. `Aetas.ai` is the company's website and domain identity. The website presents three specialized service areas offered directly by AGI:

- **AI & Automation**: Human Led AI and Business Process AI Assimilation, with Expert Human Oversight of AI (Expert in the Loop).
- **Cybersecurity**: MSSP expertise through Managed Extended Detection and Response (MXDR) and Offensive Security, including Network Security Testing and Application Security Testing (Pen Testing).
- **Managed IT**: MSP expertise through Help Desk as a Service, Product Support as a Service, managed IT, and Business Processes operations.

Read [HANDOFF.md](./HANDOFF.md) before changing positioning, services, partners, major routes, or shared functionality. Use [COLLABORATION.md](./COLLABORATION.md) for installation and team workflow instructions, and [SEO-DEPLOYMENT.md](./SEO-DEPLOYMENT.md) for production deployment and search indexing.

Current messaging anchors are maintained in `HANDOFF.md`. Public copy should present AGI naturally as the company and should not repeatedly explain the structure with phrases such as "one company" or "one accountable company."

## Current Experience

- Responsive Astro pages for the company and all three service areas
- Hybrid enterprise visual system with dark technical sections, light editorial bands, and distinct service accents
- Custom AGI service-network hero built with inline SVG and CSS
- Interactive service responsibility selector and advisor quiz
- Bob chat assistant loaded as a non-critical React island
- Delayed loading feedback that appears only when a page is genuinely slow
- Partner logo experiences for approved cloud, AI, and cybersecurity partners
- AGI Operations Readiness Brief registration and download flow
- Prepared server-side contact and consultation endpoints with validation, CSRF and bot controls, rate limiting, and server-only delivery credentials; public form processing remains deferred until its complete environment configuration is enabled
- Canonical metadata, structured data, robots instructions, and generated sitemap
- Application-controlled Node and Hostinger/LiteSpeed security headers with a build-generated, SHA-256 hash-based Content Security Policy
- Canonical HTTPS enforcement, private API caching/CORS policy, public artifact checks, and a published security contact

The homepage network is an original Aetas component. It does not use the Aceternity globe, Three.js, React Three Fiber, or a copied UI component.

## Technical Stack

- Astro 7 with prerendered pages and standalone Node endpoints
- React 19 islands through `@astrojs/react`
- Tailwind CSS 4
- Shadcn-compatible `src/components/ui` organization adapted for Astro rather than Next.js
- Native scrolling and dependency-free Intersection Observer page reveals
- Framer Motion for React island transitions
- Lucide React icons

## Project Structure

```text
src/
  components/        Astro components and interactive React islands
  data/              Shared resource and approved case-study data
  lib/server/        Server-only form validation, abuse controls, and delivery handling
  layouts/           Shared layout, navigation, metadata, and scripts
  pages/             Astro routes
  styles/            Global Tailwind theme and CSS
scripts/             Build integrations, including production security-header generation
public/              Optimized images, logos, icons, robots.txt
```

Important homepage files:

- `src/components/HomeHero.astro`: homepage hero structure and service rail
- `src/components/AgiNetworkGraph.astro`: custom animated AGI service network
- `src/components/AboutVisualGallery.astro`: lightweight About page visual gallery
- `src/pages/index.astro`: homepage sections and interactive islands
- `src/layouts/Layout.astro`: shared shell, SEO metadata, loader, navigation, and Bob assistant
- `scripts/security-headers-integration.mjs`: validates new-tab links and public artifacts, hashes final inline scripts and style blocks, and generates `dist/client/_headers.json` plus the optional LiteSpeed `.htaccess`
- `scripts/start-server.mjs`: validates production configuration and starts the application-controlled secure Node listener
- `src/middleware.ts`: hardens on-demand API responses, trusted-origin handling, reserved non-indexed routes, and privacy-preserving error logs
- `src/lib/server/forms.ts`: shared form schemas, safe delivery formatting, and endpoint handling
- `src/lib/server/form-security.ts`: signed CSRF tokens and bounded per-IP/per-endpoint rate limiting

## Visual System

The site uses a hybrid enterprise contrast system instead of a single dark surface across every page:

- Dark surfaces frame heroes, technical workflows, partner logos, and operational visuals.
- Light and light-muted bands support service explanations, forms, resources, and conversion content.
- AI & Automation uses violet, Cybersecurity uses cyan, Managed IT uses amber, and governance states use green.
- Shared surface, card, button, media, and form treatments live in `src/styles/global.css`. Reuse those utilities before adding page-specific colors.
- Motion remains restrained and must respect `prefers-reduced-motion`.

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

Run `npm test` and `npm run build` before pushing or uploading a deployment package.
