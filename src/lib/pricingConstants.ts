/**
 * Static pricing-copy constants.
 *
 * These back the handful of duration strings the backend does NOT ship in
 * POST /price responses (pre-submit pages need a value for "every N days"
 * copy before session.pricingInfo is populated). Post-submit surfaces prefer
 * the backend's `subscription_day_label` with these as fallbacks.
 *
 * See PRD §4.5, §4.6.
 */

// String on purpose — backend's post-submit `subscription_day_label` is also
// a string, so consumers concatenate without type gymnastics.
export const DEFAULT_SUBSCRIPTION_DAYS = "28" as const;

// Number on purpose — used only inside `${TRIAL_DAYS}-Day Trial` template
// literals; widening to `number` doesn't matter for the string output but
// const-asserting keeps the intent visible.
export const TRIAL_DAYS = 7 as const;
