import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocale } from '@/hooks/useLocale';
import PrivacyPolicyEn from './privacy/PrivacyPolicyEn';
import PrivacyPolicyJa from './privacy/PrivacyPolicyJa';

const PrivacyPolicyPage = () => {
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
        </h1>

        {locale === 'ja' ? (
          <>
            <PrivacyPolicyJa />
            <p className="mt-10 text-sm">
              <a href="/privacy-policy" className="text-primary underline">
                {t('legal.openInOriginal')}
              </a>
            </p>
          </>
        ) : (
          <PrivacyPolicyEn />
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
