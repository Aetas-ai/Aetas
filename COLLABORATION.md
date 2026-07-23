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
4. Deploy it as a backend-supported Astro application. Run `npm run build`, then start `dist/server/entry.mjs` with `npm start`; a frontend-only/static deployment will not serve `/api/forms/*`.
5. Configure `FORM_CSRF_SECRET`, `FORM_DELIVERY_URL`, and `FORM_DELIVERY_BEARER_TOKEN` in Hostinger's Web App environment settings. Never put their values in a source ZIP, a repository file, a public variable, or client code. The delivery URL must use HTTPS.
6. Confirm the build generated `dist/client/.htaccess`. Hostinger's managed backend Web App stores application output under `/home/{username}/domains/{domain}/nodejs` and maintains its proxy `.htaccess` separately at `/home/{username}/domains/{domain}/public_html/.htaccess`. In File Manager, preserve the Hostinger-generated proxy/routing directives and merge the contents of `nodejs/dist/client/.htaccess` into `public_html/.htaccess`; do not replace the routing file wholesale. Repeat this merge after a deployment if Hostinger regenerates the proxy file, because the CSP hashes are build-specific.
7. Confirm deployment success, inspect the live response headers, test each form, and test `https://aetas.ai` on multiple screen sizes.

### Hostinger production transport and domain setup

1. In **Websites → Dashboard → Connect domain**, connect `aetas.ai` to the backend Node.js Web App and complete the requested DNS changes. Wait for Hostinger's automatic certificate installation to finish.
2. Ensure the `www` DNS name also resolves to the Hostinger site and has a valid certificate before enabling its permanent redirect. Do not enable HSTS for a hostname that cannot complete TLS.
3. In **Websites → Dashboard → SSL**, open the options menu for the domain and select **Force HTTPS**. Keep the repository redirect rules as defense in depth.
4. In **File Manager**, merge the generated security block as described above. Its redirects always target the fixed `https://aetas.ai` origin, preserve the path/query, and cannot be influenced by the incoming Host header.
5. Do not enable HSTS preload or `includeSubDomains` until every current and planned subdomain is confirmed to support HTTPS permanently. The repository safely starts with `max-age=31536000` for the responding host.
6. Review **Website Dashboard → Runtime logs** after deployment. Application form logs must remain limited to event names and random request IDs. Do not paste unsanitized logs into tickets or third-party tools; Hostinger/runtime stack traces may contain filesystem details even though they are never returned to visitors.

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

The first two responses must redirect to the same path on `https://aetas.ai` without accepting a caller-supplied destination. HTML should require revalidation, fingerprinted `/_astro/` assets should be immutable for one year, and `/api/forms/csrf` must be `private, no-store` with no `Access-Control-Allow-Origin` header. Confirm a cross-origin request returns 403:

```sh
curl -i -H 'Origin: https://example.invalid' https://aetas.ai/api/forms/csrf
```

Upload the repository source package, not an old `dist` folder, when using the Hostinger Web App build workflow. Avoid including `.git`, `node_modules`, local `.env` files, or unrelated local files in a manually prepared ZIP.

Environment variables must be configured in Hostinger's Web App settings. Never commit secrets or include production secrets in the uploaded ZIP.

`.env.example` lists required variable names with blank values. `npm start` validates their presence and format before importing the production server and exits without starting if any required secret is missing or invalid.

The Content Security Policy hashes are derived from the final generated HTML on every build. Do not hand-edit or reuse an older `dist/client/.htaccess`, because its hashes will not authorize changed Astro hydration scripts or component styles.

Production builds explicitly disable source maps and fail if a `.map`, log, environment, or common credential artifact appears in the public client output. Astro's standalone server gives content-hashed `/_astro/` assets immutable one-year caching; the generated LiteSpeed rules mirror that behavior and keep non-fingerprinted assets short-lived. All API/form responses are private and non-cacheable.

The form delivery service must accept an authenticated JSON POST containing a plain-text body and an HTML-encoded body. Keep its endpoint and bearer token server-only. Valid forms deliberately return a generic 503 until delivery is configured and reachable; do not replace this fail-closed behavior with client-side email or API credentials.

The current rate limiter is process-local and matches the current single-process Hostinger Node deployment. If production is scaled to multiple Node processes or instances, add an equivalent Cloudflare rule or replace the store with a shared rate-limit service so limits remain global.

The current external CSP sources are limited to Google Fonts, Webflow CMS API/media origins, and `unpkg.com` connections for Rive's default WASM fetch. JavaScript libraries must be bundled and served from the site origin. Analytics is not currently configured; add only the exact script, image, and connection origins required by the selected provider when analytics is approved.

Do not enable Cloudflare Rocket Loader or any edge transformation that rewrites inline scripts or style blocks after the Astro build. CSP hashes match the exact generated bytes, so post-build rewriting can invalidate them.

## 8. Documentation Maintenance

- Update `HANDOFF.md` when positioning, service scope, routes, partners, shared components, deployment, or known gaps change.
- Update `README.md` when setup, architecture, commands, or major features change.
- Update `SEO-DEPLOYMENT.md` when routes, canonical domains, sitemap exclusions, or deployment steps change.
