export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://api-cellonnexus-dev.project-demo.info/api/v1/",
  apiToken: import.meta.env.VITE_API_TOKEN || "39329d19006189abdf96bde071b66d04f81c0b0fa9ea5a4609f2c2bde1b4859b",
  xHost: import.meta.env.VITE_X_HOST || "16types.ai",
  stripePublishableKeySandbox: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_SANDBOX || "pk_test_51TOe1mGl8AtGrz5nYouVNoZb2aZfcZbfQRpOWmw28YdqgTYtFfUo3NZihAgqnVuj4cZDhnQAGnHPvx9SIlxwiVbw00PJ12MK7B",
  stripePublishableKeyLive: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE || "pk_test_51TOe1mGl8AtGrz5nYouVNoZb2aZfcZbfQRpOWmw28YdqgTYtFfUo3NZihAgqnVuj4cZDhnQAGnHPvx9SIlxwiVbw00PJ12MK7B",
  paypalClientIdSandbox: import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX || "ASNSGvzfpBPvQzt2HzN9kj-j_vNHPB4dtL2SnZJWkRezp_O8vlwLx72eyboaI5uNjadICxDW6U7kNsHw",
  paypalClientIdLive: import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE || "ASNSGvzfpBPvQzt2HzN9kj-j_vNHPB4dtL2SnZJWkRezp_O8vlwLx72eyboaI5uNjadICxDW6U7kNsHw",
};
