# Collaboration Setup Guide

Use this guide when a developer or AI coding assistant needs to access, run, and collaborate on the Aetas.ai website locally.

## 1. Clone the Repository

```sh
git clone <repository-url> Aetas.AI
cd Aetas.AI
```

Replace `<repository-url>` with the actual Git remote URL.

## 2. Read the Project Context

Before making changes, read:

```text
HANDOFF.md
README.md
AGENTS.md
```

`HANDOFF.md` explains what the company website is, current positioning rules, what is complete, and what should not be claimed publicly without verification.

## 3. Install Requirements

Use Node.js `22.12.0` or newer.

Install dependencies:

```sh
npm install
```

## 4. Start Local Development

Standard local dev server:

```sh
npm run dev
```

The site normally runs at:

```text
http://localhost:4321
```

For AI coding agents following this repository's agent instructions, prefer Astro background mode:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

If using the local dependency binary:

```sh
npx astro dev --background
```

## 5. Build and Preview

Run a production build:

```sh
npm run build
```

Preview the built site:

```sh
npm run preview
```

## 6. Collaboration Rules

- Keep Aetas AI positioned as roadmap / early access unless the business confirms it is launched.
- Do not invent certifications, partner tiers, client logos, office addresses, testimonials, or performance metrics.
- Update `HANDOFF.md` whenever a change affects site positioning, major routes, known gaps, or future implementation context.
- Update `README.md` when setup, commands, or project structure changes.
- Run `npm run build` before handing off work.

## 7. Useful Routes

- `/` homepage
- `/ai`
- `/security`
- `/global`
- `/work`
- `/resources`
- `/partners`
- `/about`
- `/contact`
