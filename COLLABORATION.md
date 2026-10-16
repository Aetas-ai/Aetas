# Collaboration Setup Guide

Use this guide to install, clone, run, update, and hand off the Aetas Global Innovation website.

Use [DEPENDENCY-SECURITY.md](./DEPENDENCY-SECURITY.md) for the repository-specific process to investigate, patch, verify, and redeploy vulnerable dependencies.

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
npm run
npm run build
git diff --check
```

`npm test` runs the security-focused test suite. `npm run build` runs that suite before the Astro production build. `npm run preview` remains available when a local production-server review is needed.

Before handing off a change:

1. Test the affected flow on mobile, tablet, and desktop.
2. Test reduced-motion behavior when changing transitions, reveals, the loader, or animated diagrams.
3. For navigation changes, check a direct load, repeated internal navigation, back/forward navigation, and the Astro body swap.
4. For loader changes, verify fast loads do not flash the overlay, slow loads complete and fade cleanly, and no page remains `aria-busy`.
5. Run `npm run build` and `git diff --check`.
6. Check `git status` and confirm that only intended files changed.
7. Push the branch and open a pull request only when explicitly requested and team review is required.

## 6. Content Rules

- Use **Aetas Global Innovation** as the company name. Do not add an `s` to Innovation.
- `Aetas.ai` is the website and domain identity for Aetas Global Innovation.
- Always spell out **Business Processes**; do not introduce an abbreviation on the public website.
- Present **AI & Automation**, **Cybersecurity**, and **Managed IT** as services offered directly by AGI.
- Do not present these service areas as separate Aetas companies or brands, and do not repeatedly explain the public structure with phrases such as "one company" or "one accountable company."
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
4. Keep the current Hostinger settings: Astro, Node.js 22.x, npm, build command `npm run build`, and output directory `dist`. Public pages and assets build directly into that directory.
5. `/api/forms/*` is unavailable from the frontend-only deployment. Keep `FORM_DELIVERY_ENABLED=false` while account/approval/DNS are pending. Activate a backend-supported Astro application with `npm start`, enable the flag, and configure `FORM_CSRF_SECRET`, `RESEND_API_KEY`, `FORM_SENDER_EMAIL`, and `CONTACT_RECIPIENT_EMAIL` together. Follow [EMAIL-SETUP.md](./EMAIL-SETUP.md); the confirmed recipient is `info@aetas.ai`. Remove obsolete Brevo settings before enabling. The legacy HTTPS webhook is an alternative, never concurrent. Never include secrets in source ZIPs, public variables, or client code.
6. Confirm the build generated `dist/index.html`, `dist/_headers.json`, and `dist/.htaccess`. The generated `.htaccess` applies the matching LiteSpeed security policy in the current frontend deployment. When the backend deployment is activated later, leave Hostinger's managed proxy `.htaccess` unchanged; `npm start` loads `dist/_headers.json` and applies the same policy in the Node application.
7. Confirm deployment success, inspect the live response headers, and test `https://aetas.ai` on multiple screen sizes.

### Hostinger production transport and domain setup

1. In **Websites → Dashboard → Connect domain**, connect `aetas.ai` to the current Astro Web App and complete the requested DNS changes. Wait for Hostinger's automatic certificate installation to finish.
2. Ensure the `www` DNS name also resolves to the Hostinger site and has a valid certificate before enabling its permanent redirect. Do not enable HSTS for a hostname that cannot complete TLS.
3. In **Websites → Dashboard → SSL**, open the options menu for the domain and select **Force HTTPS**. Keep the repository redirect rules as defense in depth.
4. In the current frontend deployment, deploy the generated `dist/.htaccess` with the rest of the `dist` output. After switching to the backend Node deployment, do not replace or manually merge into Hostinger's managed proxy `.htaccess`; the application startup wrapper then enforces the fixed `https://aetas.ai` origin and response headers.
5. Do not enable HSTS preload or `includeSubDomains` until every current and planned subdomain is confirmed to support HTTPS permanently. The repository safely starts with `max-age=31536000` for the responding host.
6. Review the deployment build log after every update. Once the backend Node deployment and forms are activated, also review **Website Dashboard → Runtime logs**. Application form logs must remain limited to event names and random request IDs. Do not paste unsanitized logs into tickets or third-party tools; runtime stack traces may contain filesystem details even though they are never returned to visitors.

If Cloudflare is later placed in front of Hostinger, set SSL/TLS mode to **Full (strict)**, enable **Always Use HTTPS**, and create a Redirect Rule from `www.aetas.ai` to the fixed `https://aetas.ai` origin while preserving path and query. Do not duplicate or replace the build-generated CSP with stale hashes at Cloudflare. Vercel and Netlify configuration does not apply to the current deployment.

### Post-deployment security verification

Run these checks against production after every deployment:

```sh
curl -I http://aetas.ai/contact
curl -I https://www.aetas.ai/contact
curl -I https://aetas.ai/
curl -I https://aetas.ai/_astro/REPLACE_WITH_CURRENT_HASHED_ASSET.js
curl -I https://aetas.ai/api/forms/csrf
curl -I https://aetas.ai/.well-known/security.txt
```

The first two responses must redirect to the same path on `https://aetas.ai` without accepting a caller-supplied destination. HTML should require revalidation and fingerprinted `/_astro/` assets should be immutable for one year. The frontend-only deployment does not serve `/api/forms/csrf`. In a backend deployment with delivery disabled or invalid it returns a generic 503; after explicit activation with valid configuration it returns 200. In both states it must remain non-cacheable with no `Access-Control-Allow-Origin` header. Confirm a cross-origin request returns 403:

```sh
curl -i -H 'Origin: https://example.invalid' https://aetas.ai/api/forms/csrf
```

Upload the repository source package, not an old `dist` folder, when using the Hostinger Web App build workflow. Avoid including `.git`, `node_modules`, local `.env` files, or unrelated local files in a manually prepared ZIP.

Environment variables must be configured in Hostinger's Web App settings. Never commit secrets or include production secrets in the uploaded ZIP.

`.env.example` prepares Resend sending to `info@aetas.ai` with `FORM_DELIVERY_ENABLED=false`. Disabled startup permits staged/incomplete credentials and ignores saved legacy secrets for activation. Once enabled, Resend requires the CSRF secret, API key, sender, and recipient; the legacy webhook requires its original three settings instead. Partial/mixed configuration or obsolete Brevo variables fail enabled startup. Astro dev/preview validates the active channel before issuing a session or sending.

The Content Security Policy hashes are derived from the final generated HTML on every build. Deploy the complete current source and build output together; `npm start` validates and loads `dist/_headers.json` so stale or missing policy output fails closed.

Production builds explicitly disable source maps and fail if a `.map`, log, environment, or common credential artifact appears in the public client output. Astro's standalone server gives content-hashed `/_astro/` assets immutable one-year caching; the generated LiteSpeed rules mirror that behavior and keep non-fingerprinted assets short-lived. All API/form responses are private and non-cacheable.

Resend receives one server-side authenticated request with plain-text and escaped HTML content, visitor Reply-To, and a reference-based idempotency key. Sender/recipient are private settings. The submit spinner remains active through acceptance and thank-you navigation; failures restore the button and preserve entries. No visitor acknowledgment, automatic retry, or provider fallback is enabled. Logs contain safe events and random IDs only. Provider acceptance is not inbox delivery; verify Resend logs and mailbox receipt after approval/DNS. The legacy webhook remains an alternative with Resend settings absent. Mocked built-backend checks: `node scripts/check-form-security.mjs`; real-browser checks: `node scripts/check-form-browser.mjs` with Astro running in background. See `EMAIL-SETUP.md`.

The prepared backend rate limiter counts only verified, well-formed submissions. It is process-local and is designed for a future single-process Hostinger Node deployment. It removes expired records and enforces a strict 10,000-record least-recently-used cap. If production is later scaled to multiple Node processes or instances, add an equivalent Cloudflare rule or replace the store with a shared rate-limit service so limits remain global.

The Content Security Policy allows no external origins: Inter is self-hosted from the `@fontsource-variable/inter` package and bundled with the site. Scripts, images, API connections, workers, media, and frames are restricted to the exact capabilities currently used by the site; unused WebAssembly, unpkg, and Webflow access is not allowed. JavaScript libraries must be bundled and served from the site origin. Analytics is not currently configured; add only the exact origins required by the selected provider when analytics is approved.

Do not enable Cloudflare Rocket Loader or any edge transformation that rewrites inline scripts or style blocks after the Astro build. CSP hashes match the exact generated bytes, so post-build rewriting can invalidate them.

## 8. Documentation Maintenance

- Update `HANDOFF.md` when positioning, service scope, routes, partners, shared components, deployment, or known gaps change.
- Update `README.md` when setup, architecture, commands, or major features change.
- Update `SEO-DEPLOYMENT.md` when routes, canonical domains, sitemap exclusions, or deployment steps change.
- Keep `AGENTS.md` and `CLAUDE.md` aligned when shared repository safeguards or required verification commands change.
