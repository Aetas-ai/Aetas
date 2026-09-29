# Dependency Security and Remediation Guide

Use this guide when Hostinger, GitHub, npm, or another approved scanner reports a vulnerable dependency in the Aetas Global Innovation website.

## Current Project Baseline

- Runtime requirement: Node.js 22.12.0 or newer
- Package manager: npm
- Lockfile: `package-lock.json`
- Test command: `npm test`
- Production build: `npm run build`
- Current Hostinger output directory: `dist`
- Current deployment method: upload the latest source ZIP to the Hostinger Astro Web App

Do not edit files inside `node_modules` or place `node_modules` in the deployment ZIP. Do not run `npm audit fix --force` without reviewing the major-version changes it proposes.

## 1. Record and Verify the Alert

Record the package name, installed version, affected versions, first patched version, severity, and CVE or GHSA identifier.

Verify the advisory through authoritative sources such as:

- GitHub Advisory Database
- The package's official repository or release notes
- The npm package registry

An alert means an affected package is installed. It does not automatically prove the production website is exploitable. Assess how the package is used, but patch valid advisories promptly.

## 2. Start from an Updated Branch

```powershell
cd C:\Users\MarkTabotabo\Aetas.AI
git switch main
git pull --ff-only origin main
git status
git switch -c fix/PACKAGE-vulnerability
```

Replace `PACKAGE` with the affected package name. Start only from a clean working tree.

## 3. Reproduce the Installed Dependency Tree

```powershell
npm ci
npm ls PACKAGE_NAME --all
npm explain PACKAGE_NAME
```

`npm ls` shows every installed version. `npm explain` identifies which direct dependency introduced the package.

For the July 2026 PostCSS advisory, the dependency path was:

```text
@astrojs/react
└── vite
    └── postcss
```

## 4. Find the Patched Version

```powershell
npm view PACKAGE_NAME version
npm view PACKAGE_NAME@PATCHED_VERSION version
```

Confirm that the selected version is outside the advisory's affected range and compatible with the parent dependency.

## 5. Apply the Update

Choose the appropriate update path depending on how the package is brought into the project:

### Path A: Astro Core Integration Upgrades
When Astro core packages (`astro`, `@astrojs/node`, `@astrojs/react`, `@astrojs/sitemap`) need security or feature updates:

```powershell
npx @astrojs/upgrade
```

- When prompted about breaking changes in an integration (e.g., `@astrojs/react` upgrading major versions), review the integration's release notes. Check if the project uses the deprecated/removed feature (such as legacy Babel options). If the codebase uses only standard features, proceed.
- If upgrading a specific integration without upgrading everything:
  ```powershell
  npm install astro@latest @astrojs/node@latest @astrojs/react@latest @astrojs/sitemap@latest
  ```

### Path B: Direct Dependencies in package.json
For a direct dependency listed in `package.json`:

```powershell
npm install PACKAGE_NAME@PATCHED_VERSION
```

### Path C: Transitive (Sub-dependency) Updates
For a vulnerability inside a sub-dependency, first attempt:

```powershell
npm update PACKAGE_NAME
npm ls PACKAGE_NAME --all
```

If the parent dependency has a compatible semver range, `npm update` will bump the sub-dependency in `package-lock.json`.

### Path D: Transitive Dependency Pinning via Overrides
If parent packages restrict the version range or do not release an immediate patch, enforce the patched version globally in `package.json`:

```json
"overrides": {
  "PACKAGE_NAME": "PATCHED_VERSION"
}
```

Then regenerate the lockfile and verify:

```powershell
npm install
npm ls PACKAGE_NAME --all
```

Review overrides periodically when parent packages release updates. Remove an override once parent packages natively pull safe versions.

## 6. Verify the Remediation

Run the full verification battery locally before committing:

```powershell
npm ls PACKAGE_NAME --all
npm audit
npm test
npm run build
git diff --check
```

Confirm all of the following:

- No affected package version remains in `npm ls`. (If the package was eliminated by upstream changes, `npm ls PACKAGE_NAME` will report `(empty)`, confirming complete removal).
- `npm audit` reports zero vulnerabilities.
- All 16 repository security tests pass (`npm test`).
- The production build completes without errors (`npm run build`).
- `git diff --check` reports no trailing whitespace or merge marker issues.
- `dist/index.html`, `dist/.htaccess`, and `dist/_headers.json` exist.
- `dist-server/entry.mjs` exists outside the public `dist` directory.

## 7. Review and Commit

```powershell
git status
git diff -- package.json package-lock.json
```

Dependency remediation changes `package.json` and `package-lock.json`. Documentation should also be updated when an upgrade, pin, or override is added or modified.

```powershell
git add package.json package-lock.json DEPENDENCY-SECURITY.md HANDOFF.md
git commit -m "fix: remediate dependency vulnerabilities"
git push -u origin fix/PACKAGE-vulnerability
```

Include any intentionally updated documentation in the commit. Open a pull request when team review is required.

## 8. Redeploy to Hostinger

After the pull request is merged:

```powershell
git switch main
git pull --ff-only origin main
```

Download or prepare a new source ZIP from the updated `main` branch. Do not reuse an older ZIP. Keep the current Hostinger settings:

```text
Framework: Astro
Node.js: 22.x
Package manager: npm
Build command: npm run build
Output directory: dist
```

Upload the new ZIP and redeploy. Hostinger will perform a clean dependency installation from `package.json` and `package-lock.json`.

## 9. Verify Hostinger After Deployment

1. Confirm the Hostinger deployment completed successfully.
2. Review the build log for dependency or build errors.
3. Confirm `https://aetas.ai` and the changed pages load correctly.
4. Confirm the expected security response headers remain present.
5. Allow Hostinger to rescan the deployment.
6. Confirm the original vulnerability alerts are resolved.

Hostinger may not clear an alert immediately because dependency scans can run on a schedule. If the alert remains after a rescan, confirm that the deployment used the latest ZIP and inspect the build log for the installed package version.

---

## Remediation History

### September 2026: Astro Core & Transitive Vulnerability Remediation
Resolved multiple high- and moderate-severity advisories reported in the Astro ecosystem:

| Package | Affected Versions | Resolved Version | Vulnerabilities / Advisories Addressed | Resolution Method |
| :--- | :--- | :--- | :--- | :--- |
| **astro** | 7.1.3 | **7.3.5** | GHSA-26w7-cxv4-gfx2 (RCE in AVIF image optimization), CVE-2026-84376 (base path bypass) | `npx @astrojs/upgrade` |
| **sharp** | 0.35.3 | **0.35.5** | GHSA-rgj7-g3m4-5g8c (libheif RCE) | Transitive update via `astro@7.3.5` |
| **js-yaml** | 4.3.1 | **4.3.2** | CVE-2026-84375 (CPU DoS via maxTotalMergeKeys) | Transitive update via `astro@7.3.5` & internal helpers |
| **svgo** | 4.0.2 | **4.1.0** | CVE-2026-84370 & CVE-2026-84369 (SVG script/HTML bypass) | Transitive update via `astro@7.3.5` |
| **devalue** | 5.8.1 | **5.9.4** | CVE-2026-81176 (DoS via malformed input) | Transitive update via `astro@7.3.5` & `@astrojs/react@7.0.0` |
| **browserslist** | 4.28.4 | **Eliminated** | CVE-2026-73089 & CVE-2026-73088 (OOM cache growth & prototype crash) | Removed upstream with Babel removal in `@astrojs/react@7.0.0` |
| **baseline-browser-mapping** | 2.10.41 | **Eliminated** | CVE-2026-45819 (process termination DoS) | Removed upstream with Babel removal in `@astrojs/react@7.0.0` |

**Verification results:**
- `npm ls` confirmed all patched sub-dependencies; `browserslist` and `baseline-browser-mapping` verified removed (`empty`).
- `npm audit` returned 0 vulnerabilities.
- All 16 repository security tests passed.
- Production build succeeded (`npm run build`).

### July 2026: PostCSS Transitive Remediation
The alert `GHSA-r28c-9q8g-f849` affected PostCSS through version 8.5.17. The project pins PostCSS to patched version 8.5.25 through npm overrides:

```json
"overrides": {
  "postcss": "8.5.25"
}
```

Verification completed before handoff:
- `npm ls postcss --all` resolved `postcss@8.5.25`.
- `npm audit` reported zero vulnerabilities.
- All 16 security tests passed.
- Production build passed.
