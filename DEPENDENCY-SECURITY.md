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

For a direct dependency already listed in `package.json`:

```powershell
npm install PACKAGE_NAME@PATCHED_VERSION
```

For a transitive dependency, first try:

```powershell
npm update PACKAGE_NAME
npm ls PACKAGE_NAME --all
```

If the parent dependency still resolves a vulnerable version, add or update an npm override in `package.json`:

```json
"overrides": {
  "PACKAGE_NAME": "PATCHED_VERSION"
}
```

Then regenerate the installation and lockfile:

```powershell
npm install
```

The current PostCSS remediation uses:

```json
"overrides": {
  "postcss": "8.5.25"
}
```

Review overrides whenever Astro, Vite, or another parent dependency is upgraded. Remove an override only after a clean install resolves a non-vulnerable compatible version without it.

## 6. Verify the Remediation

```powershell
npm ls PACKAGE_NAME --all
npm audit
npm test
npm run build
git diff --check
```

Confirm all of the following:

- No affected package version remains in `npm ls`.
- `npm audit` does not report the advisory.
- All repository tests pass.
- The production build completes.
- `git diff --check` reports no whitespace errors.
- `dist/index.html`, `dist/.htaccess`, and `dist/_headers.json` exist.
- `dist-server/entry.mjs` exists outside the public `dist` directory.

## 7. Review and Commit

```powershell
git status
git diff -- package.json package-lock.json
```

Dependency remediation normally changes `package.json` and `package-lock.json`. Documentation may also change when a pin, override, deployment requirement, or maintenance rule is introduced.

```powershell
git add package.json package-lock.json
git commit -m "fix: patch PACKAGE_NAME dependency vulnerability"
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
6. Confirm the original vulnerability alert is resolved.

Hostinger may not clear an alert immediately because dependency scans can run on a schedule. If the alert remains after a rescan, confirm that the deployment used the latest ZIP and inspect the build log for the installed package version.

## Current PostCSS Remediation

The July 2026 alert `GHSA-r28c-9q8g-f849` affects PostCSS through version 8.5.17. The project pins PostCSS to patched version 8.5.25 through npm overrides.

Verification completed before handoff:

- `npm ls postcss --all` resolved `postcss@8.5.25`.
- `npm audit` reported zero vulnerabilities.
- All 16 security tests passed.
- The production build passed.

The fix reaches Hostinger only after the updated source is committed, merged into `main`, and redeployed. Future advisories must be assessed independently; resolving one advisory does not guarantee that unrelated vulnerabilities will never be discovered.
