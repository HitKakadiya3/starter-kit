import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import type { NavigateOptions, To } from 'react-router-dom';

export type Locale = 'en' | 'ja';

/** Read the current locale from the pathname (`/ja/...` => `ja`, otherwise `en`). */
export function useLocale(): Locale {
  const { pathname } = useLocation();
  return pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en';
}

/** Prefix a path with the current locale segment if non-English. */
export function withLocalePrefix(path: string, locale: Locale): string {
  if (!path.startsWith('/')) return path;
  if (locale === 'en') return path;
  // Avoid double-prefixing
  if (path === '/ja' || path.startsWith('/ja/')) return path;
  if (path === '/') return '/ja';
  return `/ja${path}`;
}

/**
 * Drop-in replacement for react-router's useNavigate that automatically
 * preserves the active locale prefix. Existing pages can swap
 * `useNavigate` -> `useLocalizedNavigate` with no other changes.
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const locale = useLocale();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigate(to);
        return;
      }
      if (typeof to === 'string') {
        navigate(withLocalePrefix(to, locale), options);
        return;
      }
      // Path object
      const next = { ...to };
      if (next.pathname) next.pathname = withLocalePrefix(next.pathname, locale);
      navigate(next, options);
    },
    [navigate, locale],
  );
}

/** Swap the locale of the current path, e.g. `/quiz` <-> `/ja/quiz`. */
export function swapLocalePath(pathname: string, target: Locale): string {
  const isJa = pathname === '/ja' || pathname.startsWith('/ja/');
  const stripped = isJa ? (pathname === '/ja' ? '/' : pathname.slice(3)) : pathname;
  return target === 'ja' ? withLocalePrefix(stripped, 'ja') : stripped;
}
