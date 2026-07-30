# Claude Project Instructions

## Required Project Context

Before modifying website code or content, read:

- `HANDOFF.md` for authoritative company positioning, approved messaging, service scope, routes, partners, architecture, and content restrictions
- `README.md` for the current project structure and visual system
- `COLLABORATION.md` for verification and deployment workflow
- `SEO-DEPLOYMENT.md` when changing routes, metadata, public copy, indexing, or deployment behavior

Treat `HANDOFF.md` as the primary context source. Do not invent services, partners, client results, certifications, metrics, testimonials, or internal delivery details. When positioning or architecture changes, update the relevant documentation in the same change.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Current Shared Experience Safeguards

- `src/layouts/Layout.astro` uses Astro `ClientRouter` and the original delayed loading overlay. Preserve its singleton guard, 650 ms delayed appearance, minimum visibility, fade cleanup, and `aria-busy` handling.
- The original loader keeps Bob centered inside decorative rings and uses a CSS-driven progress fill. It does not move Bob with progress, display a percentage, or use phase-specific gesture states.
- Bob remains the single raster asset at `public/bob.webp`; do not imply that individual body parts are independently animated.
- Root document surfaces and view transitions use the existing dark brand token. Shared full-screen heroes account for `--site-header-height` and use viewport-height fallbacks.
- The Work and Resources indexes use dark editorial surfaces. The approved Partners implementation, partner list, links, logo proportions, and marquee behavior must remain unchanged unless specifically scoped.
- There is no development loader preview mode. Do not restore query-string preview controls or replay markup without an explicit temporary testing request.

Before handoff, inspect `npm run`, run `npm test`, run `npm run build`, and run `git diff --check`. Report test results accurately.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
