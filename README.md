# Aetas Global Innovation Company Website

Astro company website for **Aetas Global Innovation (AGI)**. `Aetas.ai` is the company's website and domain identity. The website presents one company with three specialized service areas:

- **AI & Automation**: Human Led AI and Business Process AI Assimilation, with Expert Human Oversight of AI (Expert in the Loop).
- **Cybersecurity**: MSSP expertise through Managed Extended Detection and Response (MXDR) and Offensive Security, including Network Security Testing and Application Security Testing (Pen Testing).
- **Managed IT**: MSP expertise through Help Desk as a Service, Product Support as a Service, managed IT, and Business Processes operations.

Read [HANDOFF.md](./HANDOFF.md) before changing positioning, services, partners, major routes, or shared functionality. Use [COLLABORATION.md](./COLLABORATION.md) for installation and team workflow instructions, and [SEO-DEPLOYMENT.md](./SEO-DEPLOYMENT.md) for production deployment and search indexing.

## Current Experience

- Responsive Astro pages for the company and all three service areas
- Custom AGI service-network hero built with inline SVG and CSS
- Interactive service responsibility selector and advisor quiz
- Bob chat assistant loaded as a non-critical React island
- Delayed loading feedback that appears only when a page is genuinely slow
- Partner logo experiences for approved cloud, AI, and cybersecurity partners
- AGI Operations Readiness Brief registration and download flow
- Canonical metadata, structured data, robots instructions, and generated sitemap

The homepage network is an original Aetas component. It does not use the Aceternity globe, Three.js, React Three Fiber, or a copied UI component.

## Technical Stack

- Astro 7 with static output
- React 19 islands through `@astrojs/react`
- Tailwind CSS 4
- Native scrolling and dependency-free Intersection Observer page reveals
- Framer Motion for React island transitions
- Lucide React icons

## Project Structure

```text
src/
  components/        Astro components and interactive React islands
  data/              Shared resource and approved case-study data
  layouts/           Shared layout, navigation, metadata, and scripts
  pages/             Astro routes
  styles/            Global Tailwind theme and CSS
public/              Optimized images, logos, icons, robots.txt
```

Important homepage files:

- `src/components/HomeHero.astro`: homepage hero structure and service rail
- `src/components/AgiNetworkGraph.astro`: custom animated AGI service network
- `src/components/AboutVisualGallery.astro`: lightweight About page visual gallery
- `src/pages/index.astro`: homepage sections and interactive islands
- `src/layouts/Layout.astro`: shared shell, SEO metadata, loader, navigation, and Bob assistant

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
