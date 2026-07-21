# Collaboration Setup Guide

Use this guide to install, clone, run, update, and hand off the Aetas Global Innovation website.

## 1. Install Prerequisites

Install these tools before cloning the repository:

- **Git** for source control
- **Node.js 22.12.0 or newer**
- **npm**, included with Node.js
- **A code editor**, such as Visual Studio Code
- **A modern browser** for responsive testing

Verify the required command-line tools:

```sh
git --version
node --version
npm --version
```

If any command is missing, install or repair that tool before continuing.

## 2. Clone the Private Repository

Your GitHub account must have access to the `Aetas-ai/Aetas` organization repository. Clone it into the intended local folder:

```sh
git clone https://github.com/Aetas-ai/Aetas.git Aetas.AI
cd Aetas.AI
```

`Aetas.AI` at the end of the clone command is the local folder name. Cloning does not rename the GitHub repository.

If GitHub requests authentication, use the browser/Git Credential Manager flow or a GitHub personal access token that is authorized for the organization. Do not commit credentials to the repository.

## 3. Read the Project Context

Before making changes, read:

```text
HANDOFF.md
README.md
AGENTS.md
SEO-DEPLOYMENT.md
```

## 4. Install and Run

```sh
npm install
npm run dev
```

The default local URL is usually `http://localhost:4321`. If that port is occupied, Astro selects another available port.

For repository agents or direct background management:

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## 5. Build and Verify

```sh
npm run build
npm run preview
```

Before handing off a change:

1. Test the affected flow on mobile, tablet, and desktop.
2. Run `npm run build`.
3. Check `git status` and confirm that only intended files changed.
4. Push the branch and open a pull request when team review is required.

## 6. Content Rules

- Use **Aetas Global Innovation** as the company name. Do not add an `s` to Innovation.
- `Aetas.ai` is the website and domain identity for Aetas Global Innovation.
- Always spell out **Business Processes**; do not introduce an abbreviation on the public website.
- Present AGI as one company with three service areas: **AI & Automation**, **Cybersecurity**, and **Managed IT**.
- Do not present these service areas as separate Aetas companies or brands.
- Use **Human Led AI** and **Expert Human Oversight of AI (Expert in the Loop)** for AI governance messaging.
- Do not expose specific internal service-delivery platforms or tools.
- Do not invent certifications, partner tiers, customers, office addresses, testimonials, results, or metrics.
- Publish case studies only after business and client approval.

## 7. Current Hostinger Deployment Workflow

The current production website is a Hostinger Web App created from a source ZIP upload. It is not currently connected directly to GitHub.

After approved changes are merged:

1. Update the local `main` branch or download the newest repository ZIP from GitHub.
2. If preparing locally, run `npm install` and `npm run build` to catch errors before deployment.
3. In Hostinger, redeploy the Web App and upload the latest source ZIP.
4. Allow Hostinger to install dependencies and run the Astro build.
5. Confirm deployment success and test `https://aetas.ai` on multiple screen sizes.

Upload the repository source package, not an old `dist` folder, when using the Hostinger Web App build workflow. Avoid including `.git`, `node_modules`, local `.env` files, or unrelated local files in a manually prepared ZIP.

Environment variables must be configured in Hostinger's Web App settings. Never commit secrets or include production secrets in the uploaded ZIP.

## 8. Documentation Maintenance

- Update `HANDOFF.md` when positioning, service scope, routes, partners, shared components, deployment, or known gaps change.
- Update `README.md` when setup, architecture, commands, or major features change.
- Update `SEO-DEPLOYMENT.md` when routes, canonical domains, sitemap exclusions, or deployment steps change.
