# Manual E2E Acceptance — Checkout ECE Wallet Path

**Status:** Manual walkthrough. **Generated:** 2026-04-29.
**Sources:**
- PRD `docs/prd/module-3-first-payment.md` §11 step 9 (manual QA bullets — ECE-specific items)
- Design Doc `docs/design/module-3-stripe-wallets-ece.md` §Test Strategy → "E2E and manual acceptance"
- Design Doc AC-D01..AC-D11; PRD §8 ACs 20–25a
- ADR-0001 — ECE migration decision context

## Why this is a markdown checklist (not a Playwright spec)

Playwright is configured at `typestest/playwright.config.ts` (via `lovable-agent-playwright-config`), but **no `*.spec.ts` files exist** in `typestest/`. The Design Doc §Test Strategy explicitly classifies E2E for this slice as a manual acceptance walkthrough until a Playwright suite is established (see Design Doc §Test Strategy → "E2E and manual acceptance"; §Open questions DD-OQ-2). Establishing an automated E2E suite is a separate initiative.

Apple Pay specifically **cannot** be automated in this repo today: it requires Safari (macOS or iOS) and is gated by Stripe Dashboard domain registration + the `apple-developer-merchantid-domain-association` file (PRD §10 O6 / O7; Design Doc Risk R-D7 / R-D2).

## Prerequisites

- [ ] Frontend running against a Stripe **test-mode** publishable key (`pk_test_…`); backend `payment_mode === 'sandbox'`. Verify `assertKeyMatchesMode` does NOT throw on dev mount (PRD §4.1; Design Doc KDD-5).
- [ ] Backend `POST /payment/stripe/create-payment-intent` accepts the resolved wallet `payment_method_type` value (default `'card'` per Design Doc KDD-3; confirm via the §Backend probe procedure).
- [ ] Module 1 resume guard + Module 2 pricing have shipped and `pricing` is reliably present at `<CheckoutForm>` mount (Design Doc R-D1 / PRD R11').
- [ ] At least one test session URL with a valid `?qid=…` query param.

## Walkthrough A — Chrome with Google Pay (AC-D03..AC-D06; PRD §8 AC 21)

**Setup:** Chrome browser, signed into a Google account that has at least one saved card under pay.google.com. Use a Stripe test card via Google Pay (e.g., `4242 4242 4242 4242`).

- [ ] Navigate to `/checkout?qid=<valid-qid>`.
- [ ] **Pricing dependency:** Verify the Stripe wallets slot does NOT render until `pricing` resolves; once pricing is present, the Google Pay button is rendered by ECE inside the wallets slot. (AC-D01, AC-D02)
- [ ] Verify ZERO calls to `POST /payment/stripe/create-payment-intent` have fired in DevTools → Network. (PRD §8 AC 1)
- [ ] Tick the consent checkbox above the three buttons. Confirm the GPay button (rendered by ECE) and other surfaces become interactable. (Design Doc AC-D10; PRD §4.7)
- [ ] Click the Google Pay button rendered inside the ECE slot.
- [ ] **Inside the GPay sheet**, complete the payment with the test card.
- [ ] Observe Network panel: exactly ONE `POST /payment/stripe/create-payment-intent` fires with `payment_method_type` set to the resolved wallet value (default `'card'`). (AC-D03; PRD §8 AC 21)
- [ ] Verify the request also includes `user_on_iqbooster: ''` and any active promo params (`prc_id` / `mdid`). (PRD §8 AC 5, AC 6)
- [ ] Verify exactly ONE `stripe.confirmPayment` call (visible via Stripe SDK debug logs or by Network → Stripe API requests). The call MUST carry `confirmParams.return_url` and `redirect: 'if_required'`. (AC-D03)
- [ ] On success, `POST /payment/stripe/first-sale/payments/confirm` fires exactly once. (AC-D04 / AC-D06)
- [ ] User is navigated to the route mapped from `redirect_page` (typically `/cross-sell?qid=<qidEncrypted>`). (PRD §8 AC 9; AC-D04 / AC-D06)
- [ ] `session.paymentIntent` is cleared after the navigate. (PRD §8 AC 9)

## Walkthrough B — Safari with Apple Pay (PRD §8 AC 22)

**Setup:** Safari on macOS or iOS Simulator, with Apple Pay configured (a card in Wallet, signed into iCloud, Touch ID / Face ID available). **Test-mode environment.** Apple Pay live-mode prerequisites (Dashboard domain registration + `apple-developer-merchantid-domain-association` file) are NOT required for Stripe test mode. (Design Doc R-D2; PRD R13)

- [ ] Navigate to `/checkout?qid=<valid-qid>` in Safari.
- [ ] Verify the Apple Pay button is rendered by ECE inside the wallets slot. (Browser-controlled by ECE; no application-level gate.)
- [ ] Tick the consent checkbox.
- [ ] Click the Apple Pay button → confirm via Touch ID / Face ID / passcode in Apple's sheet.
- [ ] Observe the same network sequence as Walkthrough A: one create-intent POST → one Stripe confirm → one backend confirm.
- [ ] User is navigated per `redirect_page`.
- [ ] **Cannot be automated** — flag in the release checklist.

## Walkthrough C — Firefox (or any browser) with no wallet support (AC-D11; PRD §8 AC 23)

**Setup:** Firefox (no Google Pay support natively) OR Chrome with NO saved Google Pay card OR an incognito Safari window with no Wallet card.

- [ ] Navigate to `/checkout?qid=<valid-qid>`.
- [ ] Verify the ECE slot renders nothing or a Stripe-controlled placeholder (no clickable wallet button). (PRD §8 AC 23; Design Doc AC-D11 — runtime portion)
- [ ] DevTools → Console: confirm there are NO uncaught errors related to ECE / wallets.
- [ ] PayPal button container renders and is interactable.
- [ ] "Credit or debit card" button renders and opens the inline `<CardForm>` on click.
- [ ] Consent checkbox toggles the enabled state of PayPal + Card surfaces correctly.
- [ ] Complete a card payment with `4242 4242 4242 4242` to confirm the rest of the form remains fully functional.

## Walkthrough D — Legacy cache-key migration (AC-D07 / KDD-2; PRD §8 AC 25a)

**Setup:** Simulate a session that was created under the prior `useGooglePay` architecture (legacy `keyedBy.methodType === 'google_pay'`).

- [ ] Open DevTools → Application → Session Storage on `/checkout`.
- [ ] Manually populate the `funnel-session` (or whatever the storage key is, per `src/lib/session.ts`) with a `paymentIntent` object whose `keyedBy.methodType === 'google_pay'`. Use a fresh-looking `id` and `clientSecret` (e.g., `pi_legacy_test`, `cs_legacy_test`) and a `createdAt` within the last 23h.
- [ ] Reload `/checkout` (do NOT clear sessionStorage between reloads).
- [ ] Tick consent and click the GPay button rendered by ECE.
- [ ] Observe DevTools → Network: exactly ONE NEW `POST /payment/stripe/create-payment-intent` fires. (Cache treated as a miss because the legacy `'google_pay'` value does not match the new wallet `payment_method_type`.) (AC-D07)
- [ ] No console errors. No duplicate session entry persists.
- [ ] Inspect Session Storage post-click: the legacy entry is overwritten — `keyedBy.methodType` now matches the new wallet value (default `'card'`), and `id`/`clientSecret` reflect the freshly-created intent.

## Walkthrough E — Confirm error path (AC-D05; PRD §8 AC 24)

**Setup:** A Stripe test card configured to decline (e.g., `4000 0000 0000 0002`) — only relevant if your test wallet allows you to choose the underlying card. Otherwise, fall back to forcing a confirm-time error via Stripe Dashboard test-mode tools.

- [ ] Navigate to `/checkout?qid=<valid-qid>`, tick consent, click the wallet button.
- [ ] Complete the wallet sheet with the declining card.
- [ ] Verify Stripe's `error.message` is rendered as an inline alert in the per-method error slot. (AC-D05)
- [ ] Verify NO `POST /payment/stripe/first-sale/payments/confirm` call is fired. (AC-D05)
- [ ] Verify the form remains interactable (other surfaces re-enable; user can retry).

## Walkthrough F — Card-path PaymentElement non-regression (AC-D08, AC-D09)

**Setup:** Any browser; goal is to verify the hoisted `<Elements>` refactor did not break the card path.

- [ ] Navigate to `/checkout?qid=<valid-qid>`, tick consent.
- [ ] Click "Credit or debit card" → confirm `<PaymentElement>` mounts under a NESTED scoped `<Elements>` (not the hoisted deferred-mode one). (Design Doc KDD-1; AC-D08)
- [ ] Toggle `activeMethod` by clicking the Card button again (collapses) and once more (expands). Verify the hoisted `<Elements>` provider does NOT remount — the GPay/Apple Pay button visible in the wallets slot stays mounted across toggles. (AC-D09)
- [ ] Complete a card payment (`4242 4242 4242 4242`) end-to-end.

## Walkthrough G — Apple Pay live-mode (deployment task; out of scope for implementation slice)

This walkthrough is **not** part of the implementation acceptance. It is recorded here so the deployment owner does not lose track of it.

- [ ] **Pre-launch only:** register the production domain in Stripe Dashboard → Settings → Payment Methods → Apple Pay. (PRD §10 O6; Design Doc Deployment prerequisites table)
- [ ] **Pre-launch only:** place the `apple-developer-merchantid-domain-association` file at `typestest/public/.well-known/` (file has no extension). (PRD §10 O7)
- [ ] Verify the file is reachable at `https://<prod-domain>/.well-known/apple-developer-merchantid-domain-association` (no CDN / proxy rewrite blocks the path).
- [ ] **Live-mode smoke** with a real Apple Pay card on Safari on the production domain.
- [ ] Verify `<CheckoutForm>` still renders and Apple Pay button appears. (AC-D11 — live-mode portion)
- [ ] If the association file is missing, AC-D11 says the wallet slot still renders; Apple Pay simply does not appear. No throw.

## Verification matrix

| AC | Walkthrough |
|---|---|
| AC-D01 (hoisted Elements options) | A (visual verification) + integration test in `CheckoutForm.test.tsx` |
| AC-D02 (no-pricing graceful path) | Integration test only (cannot be reproduced manually without breaking Module 2) |
| AC-D03 (onConfirm calls createIntent then confirmPayment) | A, B |
| AC-D04 / AC-D06 (success path) | A, B |
| AC-D05 (error path) | E |
| AC-D07 / PRD AC 25a (legacy cache miss) | D |
| AC-D08 / AC-D09 (nested card Elements + no remount) | F |
| AC-D10 (consent gate) | A (verify disabled state pre-tick) |
| AC-D11 (no association file resilience — live mode) | G |
| PRD §8 AC 21 (Chrome / GPay) | A |
| PRD §8 AC 22 (Safari / Apple Pay) | B |
| PRD §8 AC 23 (unsupported browsers) | C |
| PRD §8 AC 24 (onConfirm failure path) | E |
| PRD §8 AC 25 (single-stage confirm; absence of confirmCardPayment / handleCardAction) | Code review only |

## Sign-off

- [ ] Walkthrough A complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough B complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough C complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough D complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough E complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough F complete — Reviewer: ______________ Date: __________
- [ ] Walkthrough G — **deployment-owner only, pre-launch.**

## Future automation pointer

Once a Playwright suite is established (DD-OQ-2), Walkthroughs A, C, D, E, F should be ported to `*.spec.ts` files under `typestest/tests/e2e/`. Walkthrough B (Safari / Apple Pay) will likely remain manual unless cross-browser cloud infrastructure is added. Walkthrough G is permanently a deployment-owner manual gate.
