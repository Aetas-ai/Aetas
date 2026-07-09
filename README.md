# Aetas.ai Company Website

Astro marketing site for Aetas.ai, a unified company brand with three disciplines:

- **Aetas AI**: early-access roadmap for human-in-the-loop workflow automation.
- **Aetas Security**: active MSSP services including SOC/MDR, pentesting, response planning, and security tooling.
- **Aetas Global**: active MSP/BPO operations including helpdesk, identity, device, tenant, and support queue management.

For future coding assistants, read [HANDOFF.md](./HANDOFF.md) before making changes. It records the current site status, positioning rules, known gaps, and next improvement priorities.

## Project Structure

```text
src/
  components/        React islands for interactive widgets
  data/              Shared case study and resource data
  layouts/           Shared Astro layout, navigation, footer, scripts
  pages/             Astro routes
  styles/            Global Tailwind/CSS
public/              Static images and icons
```

Key routes:

- `/` homepage
- `/ai`, `/security`, `/global`
- `/work` and `/work/[slug]`
- `/resources` and `/resources/[slug]`
- `/partners`, `/about`, `/careers`, `/contact`

Current content note: `/about` is intentionally blank while the company story and leadership content are being planned.

## Commands

Install dependencies:

```sh
npm install
```

Start development server:

```sh
npm run dev
```

Per repository agent instructions, use Astro background mode when starting a dev server manually:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

Build production output:

```sh
npm run build
```

Preview production build:

```sh
npm run preview
```

## Notes

- This is a static Astro site with React islands for interactivity.
- The homepage partnership marquee pauses the full scrolling strip on hover/focus.
- The homepage uses a static operating-model section instead of an operational dashboard simulation.
- Forms use static form attributes suitable for Netlify-style handling; confirm hosting support before launch.
- Do not publish unverified claims for certifications, partner tiers, office addresses, testimonials, or client metrics.
