# Aetas Global Innovations Company Website

Astro marketing site for Aetas Global Innovations, also branded through the Aetas.ai domain and service identity. AGI is the company acronym and intentionally connects the brand to AI-driven operating systems.

- **Aetas AI**: AI-augmented workflow automation for BPO, support, helpdesk, IT operations, and back-office teams.
- **Aetas Security**: active MSSP services including SOC/MDR, pentesting, response planning, and security tooling.
- **Aetas Global**: active MSP/BPO operations including helpdesk, identity, device, tenant, and support queue management.

For future coding assistants, read [HANDOFF.md](./HANDOFF.md) before making changes. It records the current site status, positioning rules, known gaps, and next improvement priorities.

For clone/install/local-run instructions, read [COLLABORATION.md](./COLLABORATION.md).

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

Current content note: `/about` now introduces Aetas Global Innovations, the AGI name, operating principles, and the relationship between Aetas AI, Aetas Security, and Aetas Global.

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
