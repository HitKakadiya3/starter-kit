# Task 06 — Create `public/.well-known/README.md` (Apple Pay deployment placeholder)

**Phase:** 5 · Apple Pay deployment placeholder
**Work plan task id:** T5.1
**Size:** Small (1 file new — documentation only)
**Dependencies:**
- `05-delete-use-google-pay.md` — ordering only; no compile-time dependency. The work plan places this after Task 05 to keep cleanup-adjacent commits together. Could land any time after Task 04 in principle.

## Purpose / why this task exists

Land a documentation-only README under `public/.well-known/` describing the deployment requirement for the `apple-developer-merchantid-domain-association` file. The actual association file is provisioned at deploy time and is NOT committed to source control (sensitive; per-environment).

This README captures the deployment task so it is not lost between implementation and release. Apple Pay live-mode requires `https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association` to be served. Test mode does not require the file; this is a live-mode-only prerequisite.

## PRD / Design Doc / ADR anchors

- Design Doc §Deployment prerequisites (Apple Pay live mode) — verbatim deployment task list.
- Design Doc AC-D11 — runtime resilience when association file is absent (verified informationally in Phase 6).
- ADR-0001 §Negative Consequences — "Apple Pay live-mode introduces net-new deployment prerequisites".
- PRD §10 O6 / O7 — Apple Pay live-mode open items (deployment-owned).
- PRD §3 — "Out of scope: Apple Pay live-mode prerequisites … cross-reference §10 Open items O6 / O7".
- PRD §7 — "Files added: `public/.well-known/README.md` — placeholder note".
- Work plan §Phase 5 / Task 5.1 — verbatim content requirements.

## AC coverage

**AC-D11** is a runtime property (no-association-file resilience) and is not blocked by this README. The README captures the deployment task. Verification of AC-D11 happens in the Phase 6 manual walkthrough (Task 99) and during live-mode release.

No AC is fully closed by this task in the implementation slice. The README's content is the deliverable.

## Scope

**Add:**

- `d:/Projects/TestIQ/typestest/public/.well-known/README.md`

**Do NOT touch** (in this task):

- Any source code.
- The actual `apple-developer-merchantid-domain-association` file is NOT committed (sensitive; per-environment; provisioned at deploy time per Design Doc §Deployment prerequisites).
- `package.json`, `vite.config.*`, hosting / CDN configs.

## Backend contract reference

None. This is a static-asset / deployment-task documentation artifact.

## Step-by-step implementation

### Step 1 — Confirm the directory does not exist

```sh
ls d:/Projects/TestIQ/typestest/public/.well-known/ 2>/dev/null
```

Expected: directory does not exist (per Design Doc §Existing Codebase Analysis: "No `.well-known/` directory yet"). Creating the directory is implicit when the README is written.

### Step 2 — Write `public/.well-known/README.md`

Create the file with content covering the points listed below. The exact wording is at the implementer's discretion; structure and required points are mandated.

**Required points (from work plan §Phase 5 / Task 5.1):**

1. **Why the file is needed**: Apple Pay live-mode requires `https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association` to be served.
2. **File name (no extension)**: `apple-developer-merchantid-domain-association` — no `.txt`, no `.html`, no extension at all.
3. **Source**: downloaded from Stripe Dashboard → Settings → Payment Methods → Apple Pay after registering the production domain. (Cross-reference PRD §10 O6.)
4. **Vite serving**: Vite serves anything under `public/` as static assets at the root path. The file under `public/.well-known/` will be served at `/.well-known/...`. (PRD §10 O7.)
5. **CDN / proxy verification**: verify production CDN, reverse proxy, or path-rewrite rules do not intercept `.well-known/` paths.
6. **Provisioning timing**: the file is provisioned at deploy time and is NOT committed to source control (sensitive; per-environment).
7. **Test-mode exclusion**: test mode does not require the file; this is a live-mode-only prerequisite.

**Suggested structure** (illustrative — adapt prose as needed):

```markdown
# `.well-known/` — Apple Pay live-mode association file

This directory exists to host the Apple Pay domain-association file required by Stripe in live mode.

## What goes here

A file named exactly `apple-developer-merchantid-domain-association` (NO extension) at:

```
public/.well-known/apple-developer-merchantid-domain-association
```

Vite serves anything under `public/` verbatim at the root path. After build, the file is accessible at:

```
https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association
```

## When it is needed

Apple Pay live-mode only. Stripe **test mode** does not require this file — Apple Pay availability detection on Safari works without it.

## How to obtain the file

1. Register the production domain in Stripe Dashboard → Settings → Payment Methods → Apple Pay.
2. Download the association file Stripe generates after domain verification.
3. Place it at `public/.well-known/apple-developer-merchantid-domain-association` (no extension).

## NOT committed to source control

This file is sensitive (per-environment) and is provisioned at deploy time, not in source. This README is the only artefact in this directory tracked in git.

## Deployment verification checklist

- [ ] CDN, reverse proxy, and any path-rewrite rules do NOT intercept `.well-known/` paths.
- [ ] After deploy, `curl -i https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association` returns the file content with `200 OK`.
- [ ] Stripe Dashboard shows the production domain as verified for Apple Pay.

## Cross-references

- PRD `docs/prd/module-3-first-payment.md` §10 O6 / O7.
- Design Doc `docs/design/module-3-stripe-wallets-ece.md` §Deployment prerequisites.
- ADR `docs/adr/ADR-0001-stripe-wallets-via-express-checkout-element.md` §Negative Consequences.
```

### Step 3 — Verify the file is the only new artifact

```sh
ls d:/Projects/TestIQ/typestest/public/.well-known/
```

Expected: only `README.md`. No `apple-developer-merchantid-domain-association` file (that is provisioned at deploy time, not committed).

```sh
git status
```

Expected: only the new `public/.well-known/README.md` file is staged. No other change.

### Step 4 — Verify Vite copies the README to the build output

```sh
npm run build
ls d:/Projects/TestIQ/typestest/dist/.well-known/
```

Expected: `dist/.well-known/README.md` is present. Confirms the deploy-time path is correct (Vite copies `public/` verbatim into `dist/`).

The README is harmless content at the deployed URL `<prod-domain>/.well-known/README.md` — Apple's verification process checks for the specific association file name; the README does not interfere.

### Step 5 — Run quality gate

Although this is a doc-only commit, the standard quality gate must still pass to confirm no accidental ripple:

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run test
```

All must pass (no code change; should be a no-op).

## Completion criteria (done-when)

- [x] `public/.well-known/README.md` created.
- [x] README content covers all 7 required points listed in Step 2.
- [x] No actual `apple-developer-merchantid-domain-association` file committed.
- [x] `npm run build` produces a `dist/.well-known/README.md` artifact (Vite copies `public/` verbatim).
- [x] `npx tsc --noEmit` + `npm run lint` + `npm run build` + `npm run test` all green.
- [x] `git status` for the commit shows only the one new file.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
cat public/.well-known/README.md                                  # Content covers the 7 required points.
ls public/.well-known/                                            # → only README.md.
npm run build && ls dist/.well-known/                             # → dist/.well-known/README.md exists.
git status                                                        # → only public/.well-known/README.md staged.
npx tsc --noEmit                                                  # Zero errors.
npm run lint                                                      # Zero errors.
npm run test                                                      # Full suite green (no code change; no-op).
```

## Notes / ambiguities

- **Why a README and not the actual file**: the association file is sensitive (per-environment, generated by Apple/Stripe for the specific production domain). Committing it is a security and per-env-correctness risk. The README captures the deployment requirement so the deployment owner has unambiguous instructions.
- **Test-mode exclusion**: the README must explicitly state that test mode does NOT require the file. Stripe's Apple Pay availability detection on Safari works in test mode without the association file (per Design Doc §Deployment prerequisites and PRD R13).
- **Vite static-asset behaviour**: Vite serves `public/` verbatim at the root. The `.well-known/` directory naming is a standard web convention for well-known resources (RFC 8615); no special config is needed in Vite.
- **CDN gotcha**: some CDNs and reverse proxies (notably Cloudflare with certain rule sets) intercept `.well-known/` paths for ACME / certbot purposes. The README's "Deployment verification checklist" calls this out.
- **Risk note**: None. Documentation-only commit.
- **Commit message body**: "Adds `public/.well-known/README.md` — Apple Pay live-mode deployment placeholder per Design Doc §Deployment prerequisites + PRD §10 O6/O7. Actual association file is provisioned at deploy time and not committed."
