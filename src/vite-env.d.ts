/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TOKEN: string;
  readonly VITE_X_HOST: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY_SANDBOX: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY_LIVE: string;
  readonly VITE_PAYPAL_CLIENT_ID_SANDBOX: string;
  readonly VITE_PAYPAL_CLIENT_ID_LIVE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
