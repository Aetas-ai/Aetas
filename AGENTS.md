# Repository Agent Instructions

Astro 7 website for **Aetas Global Innovation (AGI)**, served at `aetas.ai`.

## Required Project Context

Before modifying website code or content, read:

- `HANDOFF.md` for authoritative company positioning, approved messaging, service scope, routes, partners, architecture, and content restrictions
- `README.md` for the current project structure and visual system
- `COLLABORATION.md` for verification and deployment workflow
- `SEO-DEPLOYMENT.md` when changing routes, metadata, public copy, indexing, or deployment behavior
- `EMAIL-SETUP.md` when changing forms, form endpoints, or email delivery
- `DEPENDENCY-SECURITY.md` when a dependency vulnerability is reported

Treat `HANDOFF.md` as the primary context source. Do not invent services, partners, client results, certifications, metrics, testimonials, or internal delivery details. When positioning or architecture changes, update the relevant documentation in the same change.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Commands

- `npm test`: Node's built-in test runner (`--experimental-strip-types`) over `tests/*.test.mjs`. Tests import TypeScript from `src/lib/server/` directly; there is no separate test framework.
- Single test file: `node --experimental-strip-types --test tests/csrf.test.mjs`. Filter by name with `--test-name-pattern "<regex>"`.
- `npm run build`: runs the test suite first, then `astro build`. A failing test fails the build.
- `npm start`: runs `scripts/start-server.mjs`. It requires a prior build, because it loads `dist/_headers.json` and `dist-server/entry.mjs`, and it exits on missing headers or invalid form environment variables.
- `node scripts/check-form-security.mjs`: mocked checks against the built backend.
- `node scripts/check-form-browser.mjs`: real-browser form checks through headless Edge and CDP. It requires the background dev server and sends no email.
- There is no lint script.

## Architecture

- **Hybrid output.** Pages are prerendered. Only `src/pages/api/forms/*` set `prerender = false`. `astro.config.mjs` writes public files to `dist/`, which is the current Hostinger frontend-only deployment, and the Node server bundle to `dist-server/`. The production site currently serves static `dist/` only, so form APIs are unavailable there.
- **Build-time security headers and CSP.** `scripts/security-headers-integration.mjs` runs after the build. It SHA-256-hashes the final inline scripts and style blocks, rejects `target="_blank"` links without `rel="noopener noreferrer"`, fails on public source maps, logs, env files, or credential artifacts, and writes `dist/_headers.json` and `dist/.htaccess`. The policy itself lives in `scripts/security-policy.mjs`. `scripts/server-runtime.mjs` applies the same headers under `npm start`. New external origins must be added to the policy. Never edit the generated `.htaccess` by hand, and never rewrite HTML after the build.
- **Forms pipeline.**
  - On the client, `src/scripts/secure-forms.ts` and `src/components/FormSubmitButton.astro` fetch a token from `/api/forms/csrf` and submit.
  - Each endpoint is `createFormEndpoint(definition)` from `src/lib/server/forms.ts`. It handles zod form schemas, same-origin checks, signed CSRF tokens (`csrf.ts`, `form-security.ts`), and a process-local bounded rate limit (`rate-limit.ts`).
  - `email.ts` selects delivery through either Resend (`email-delivery.ts`) or the legacy webhook. The two channels are mutually exclusive.
- **Environment.** Server secrets are typed in `astro.config.mjs` `env.schema`. `FORM_DELIVERY_ENABLED` defaults to `false`. Partial or mixed channel configuration fails enabled startup. See `.env.example` and `EMAIL-SETUP.md`.
- **Middleware.** `src/middleware.ts` hardens API responses, enforces trusted origins, sets `noindex` on reserved routes, and keeps logs privacy-preserving.
- **UI.** `src/layouts/Layout.astro` is the shared shell: ClientRouter, SEO and structured data, the loader, navigation, and the delayed Bob island. React islands live in `src/components/`, with shadcn-style `ui/` components and the `cn` helper in `src/lib/utils.ts`. This is not a Next.js app, so do not use Next.js APIs. Reuse the shared tokens and utilities in `src/styles/global.css`. Service accents are violet for AI & Automation, cyan for Cybersecurity, amber for Managed IT, and green for governance. Resource and case-study data live in `src/data/`.
- **Sitemap.** The sitemap filter in `astro.config.mjs` excludes the thanks pages and `/global`. Update it, and `SEO-DEPLOYMENT.md`, when adding non-indexed routes.

## Current Shared Experience Safeguards

- `src/layouts/Layout.astro` uses Astro `ClientRouter` and the original delayed loading overlay. Preserve its singleton guard, 650 ms delayed appearance, minimum visibility, fade cleanup, and `aria-busy` handling.
- The original loader keeps Bob centered inside decorative rings and uses a CSS-driven progress fill. It does not move Bob with progress, display a percentage, or use phase-specific gesture states.
- Bob remains the single raster asset at `public/bob.webp`; do not imply that individual body parts are independently animated.
- Root document surfaces and view transitions use the existing dark brand token. Shared full-screen heroes account for `--site-header-height` and use viewport-height fallbacks.
- The Work and Resources indexes use dark editorial surfaces. The approved Partners implementation, partner list, links, logo proportions, and marquee behavior must remain unchanged unless specifically scoped.
- There is no development loader preview mode. Do not restore query-string preview controls or replay markup without an explicit temporary testing request.

Before handoff, inspect `npm run`, run `npm test`, run `npm run build`, and run `git diff --check`. Report test results accurately. Keep `AGENTS.md` and `CLAUDE.md` aligned when shared safeguards, commands, or architecture notes change.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
