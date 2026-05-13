# `.well-known/` — Apple Pay live-mode association file

This directory exists to host the Apple Pay domain-association file required by Stripe to surface the Apple Pay button in live mode.

## What goes here

A file named exactly `apple-developer-merchantid-domain-association` (NO extension) at:

```
public/.well-known/apple-developer-merchantid-domain-association
```

Vite serves anything under `public/` as a static asset at the site root, so once the file exists it is served at:

```
https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association
```

## Why it is needed

Apple Pay in live mode requires Stripe to verify the production domain. The verification flow is:

1. Register the production domain in Stripe Dashboard → Settings → Payment Methods → Apple Pay.
2. Stripe issues an `apple-developer-merchantid-domain-association` file for download.
3. The file is uploaded to / committed at deploy time so it is served from the path above.
4. Stripe re-checks the file presence and content, then enables Apple Pay for the registered domain.

Without this file in production, Stripe's Express Checkout Element will not surface the Apple Pay button on Safari (macOS or iOS) in live mode.

**Test mode does not require this file.** The implementation slice for the ECE migration is verified entirely against `pk_test_…` and Stripe test mode; live-mode prerequisites land at deploy time.

## Provisioning at deploy

- The actual association file is **NOT committed to source control** — it is treated as per-environment / sensitive and provisioned at deploy time alongside other environment-specific assets.
- Each environment that should support live Apple Pay (typically `production`) gets its own file from Stripe Dashboard.
- Confirm any production CDN, reverse proxy, or path-rewrite rule does NOT intercept `/.well-known/` paths — they must reach the Vite-served static asset.

## Cross-references

- Stripe docs: <https://docs.stripe.com/apple-pay#web>
- PRD `docs/prd/module-3-first-payment.md` §10 O6 (Stripe Dashboard registration) and §10 O7 (well-known file serving).
- Design Doc `docs/design/module-3-stripe-wallets-ece.md` — Deployment prerequisites table and AC-D11 (runtime resilience when the file is absent).
- ADR-0001 `docs/adr/ADR-0001-stripe-wallets-via-express-checkout-element.md` — Negative Consequences (live-mode prerequisites).
