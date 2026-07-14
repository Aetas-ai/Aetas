# Collaboration Setup Guide

Use this guide when a developer or AI coding assistant needs to access, run, and collaborate on the Aetas Global Innovation website locally.

## 1. Install Prerequisites

Install these before cloning the project:

- **Git**: required to clone the repository and manage source control.
- **Node.js 22.12.0 or newer**: required to install dependencies and run Astro.
- **npm**: included with Node.js and used for project scripts.
- **A code editor**: Visual Studio Code is recommended, but any editor works.

Verify the required command-line tools are available:

```sh
git --version
node --version
npm --version
```

If any command is missing, install or repair that tool before continuing.

## 2. Clone the Repository

```sh
git clone <repository-url> Aetas.AI
cd Aetas.AI
```

Replace `<repository-url>` with the actual Git remote URL.

## 3. Read the Project Context

Before making changes, read:

```text
HANDOFF.md
README.md
AGENTS.md
```

`HANDOFF.md` explains what the company website is, current positioning rules, what is complete, and what should not be claimed publicly without verification.

## 4. Install Project Dependencies

Install dependencies:

```sh
npm install
```

## 5. Start Local Development

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

## 6. Build and Preview

Run a production build:

```sh
npm run build
```

Preview the built site:

```sh
npm run preview
```

## 7. Collaboration Rules

- Use Aetas Global Innovation as the company name. Aetas.ai is the domain and service-facing digital brand.
- Do not invent certifications, partner tiers, client logos, office addresses, testimonials, or performance metrics.
- Update `HANDOFF.md` whenever a change affects site positioning, major routes, known gaps, or future implementation context.
- Update `README.md` when setup, commands, or project structure changes.
- Run `npm run build` before handing off work.

## 8. Useful Routes

- `/` homepage
- `/ai`
- `/security`
- `/global`
- `/work`
- `/resources`
- `/partners`
- `/about`
- `/contact`
