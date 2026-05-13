import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import i18n from '@/i18n';

/**
 * Keeps i18next.language in sync with the URL: paths under /ja/* force
 * Japanese; everything else is English. Mounted once near the router root.
 */
const LocaleSync = () => {
  const { pathname } = useLocation();
  const target = pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en';
  useEffect(() => {
    if (i18n.language !== target) i18n.changeLanguage(target);
  }, [target]);
  return null;
};

export default LocaleSync;
