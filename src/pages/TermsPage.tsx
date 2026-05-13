import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocale } from '@/hooks/useLocale';

const TermsEn = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
    <p>These Terms and Conditions govern your use of websites operated by <strong>Maxiq Limited</strong>, registered at Markou Drakou 2A, Livadia 7060, Larnaca, Cyprus, including <a href="https://16types.ai">https://16types.ai</a>. By using the Service, you agree to these Terms and our <a href="/privacy-policy">Privacy Policy</a>.</p>
    <h2>Eligibility</h2>
    <p>The Service is available only to individuals 18 years or older with legal capacity to enter into binding agreements.</p>
    <h2>Paid Services & Subscriptions</h2>
    <p>We offer one-time digital items (Personality results, Detailed Report) and IQ Booster access (trial, fixed-term, or auto-renewing subscription). Pricing and billing cadence are shown at checkout. Trials convert to paid subscriptions unless canceled before the trial ends. Subscriptions auto-renew until canceled.</p>
    <h2>How to Cancel</h2>
    <p>You may cancel anytime via Account → Billing → Cancel, or by emailing <strong>info@16types.ai</strong>. Cancellation takes effect at the end of the current billing cycle.</p>
    <h2>Refunds</h2>
    <p>Subscription fees are generally non-refundable except where required by law (duplicate charges, non-delivery, fraud). Digital items are non-refundable once delivered.</p>
    <h2>Disclaimer</h2>
    <p>The tests and Service are provided <strong>for entertainment purposes only</strong> and are not professional diagnostic tools. Reliance on results is at your own risk.</p>
    <h2>Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, our total liability is limited to the amount you paid for the current subscription period or USD $1, whichever is greater. We are not liable for indirect, consequential, or punitive damages.</p>
    <h2>Privacy</h2>
    <p>We handle personal data in accordance with our <a href="/privacy-policy">Privacy Policy</a> and applicable laws (GDPR, CPRA, APPI, PIPA).</p>
    <h2>Changes</h2>
    <p>We may amend these Terms; material changes will be communicated and apply prospectively.</p>
    <h2>Contact</h2>
    <p>Questions: <a href="mailto:info@16types.ai">info@16types.ai</a></p>
    <p className="text-sm text-muted-foreground/60 mt-10"><strong>Last Revised: 16.04.2026</strong></p>
  </div>
);

const TermsJa = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
    <p>本利用規約は、<strong>Maxiq Limited</strong>(登録住所:Markou Drakou 2A, Livadia 7060, Larnaca, Cyprus)が運営するウェブサイト(<a href="https://16types.ai">https://16types.ai</a> を含む)のご利用を規定します。本サービスをご利用いただくことにより、本規約および<a href="/ja/privacy-policy">プライバシーポリシー</a>に同意したものとみなされます。</p>
    <h2>利用資格</h2>
    <p>本サービスは、契約締結能力を有する18歳以上の個人のみが利用できます。</p>
    <h2>有料サービスとサブスクリプション</h2>
    <p>当社は、一括払いのデジタル商品(性格診断結果、詳細レポート)およびIQ Boosterへのアクセス(トライアル、定期、自動更新サブスクリプション)を提供しています。価格と請求頻度はチェックアウト時に表示されます。トライアルは終了前に解約されない限り、有料サブスクリプションに自動移行します。サブスクリプションは解約されるまで自動更新されます。</p>
    <h2>解約方法</h2>
    <p>アカウント → お支払い → 解約 から、または <strong>info@16types.ai</strong> 宛のメールでいつでも解約できます。解約は現在の請求期間の終了時に有効となります。</p>
    <h2>返金について</h2>
    <p>サブスクリプション料金は、法令で要求される場合(重複請求、未配信、不正)を除き、原則として返金されません。デジタル商品は配信後の返金不可です。日本の消費者契約法に基づき、未利用の場合は購入から8日以内に返金を請求できます。</p>
    <h2>免責事項</h2>
    <p>本テストおよびサービスは<strong>娯楽目的のみ</strong>で提供されており、専門的な診断ツールではありません。結果への依拠はお客様ご自身の責任で行ってください。</p>
    <h2>責任の制限</h2>
    <p>法令で認められる最大限の範囲において、当社の総責任は、現在のサブスクリプション期間にお支払いいただいた金額または1米ドルのうちいずれか大きい方を上限とします。間接的、結果的、または懲罰的損害について当社は責任を負いません。</p>
    <h2>プライバシー</h2>
    <p>個人データは<a href="/ja/privacy-policy">プライバシーポリシー</a>および適用法令(GDPR、CPRA、APPI、PIPA)に従って取り扱います。</p>
    <h2>規約の変更</h2>
    <p>本規約は変更される場合があります。重要な変更は事前に通知され、将来に向かってのみ適用されます。</p>
    <h2>お問い合わせ</h2>
    <p>ご質問:<a href="mailto:info@16types.ai">info@16types.ai</a></p>
    <p className="text-sm text-muted-foreground/60 mt-10"><strong>最終改訂日:2026年4月16日</strong></p>
    <p className="text-xs text-muted-foreground/70">本日本語版は便宜のために提供されており、英語の原文との相違がある場合は英語版が優先されます。</p>
  </div>
);

const TermsPage = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {locale === 'ja' ? '利用規約' : 'Terms & Conditions'}
        </h1>
        {locale === 'ja' ? (
          <>
            <TermsJa />
            <p className="mt-10 text-sm">
              <a href="/terms-conditions" className="text-primary underline">{t('legal.openInOriginal')}</a>
            </p>
          </>
        ) : (
          <TermsEn />
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default TermsPage;
