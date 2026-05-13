import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_ID = 'recaptcha-v3-script';

// reCAPTCHA v3 injects a single global `.grecaptcha-badge` floating element
// site-wide. We keep the script loaded across navigations (cheap remount) but
// flip badge visibility per consumer mount so it only appears on the page
// using captcha.
const setBadgeVisible = (visible: boolean) => {
  const badge = document.querySelector<HTMLElement>('.grecaptcha-badge');
  if (badge) badge.style.visibility = visible ? 'visible' : 'hidden';
};

export const useRecaptcha = (siteKey: string | undefined) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;
    const onLoaded = () => {
      window.grecaptcha?.ready(() => {
        if (cancelled) return;
        setReady(true);
        setBadgeVisible(true);
      });
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      onLoaded();
    } else {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = onLoaded;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      setBadgeVisible(false);
    };
  }, [siteKey]);

  const execute = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey || !window.grecaptcha) return null;
      try {
        return await window.grecaptcha.execute(siteKey, { action });
      } catch {
        return null;
      }
    },
    [siteKey]
  );

  return { ready, execute };
};
