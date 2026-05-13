import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocale } from '@/hooks/useLocale';

const SubEn = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
    <p>These Subscription Policies govern the IQBooster brain training subscription service provided by Maxiq Limited. By subscribing, you acknowledge that you have read and agree to these Policies, which form an integral part of our Terms and Conditions.</p>
    <h2>1. Subscription Offerings</h2>
    <p>IQBooster is available only after completing an assessment on one of our test sites. Pricing and billing cadence are shown at checkout. Plans include 7-day trials that convert to auto-renewing subscriptions, fixed-term access, and recurring monthly or 4-week subscriptions.</p>
    <h2>2. Cancellation</h2>
    <p>You may cancel anytime via IQBooster → Settings → Billing → Cancel, or by emailing <a href="mailto:info@iqbooster.org">info@iqbooster.org</a>. Cancellation stops future renewals. To avoid the first charge after a trial, cancel before the trial ends.</p>
    <h2>3. Refunds</h2>
    <p>Subscription fees are generally non-refundable, except where required by law (duplicate charges, non-delivery, fraud). One-time digital items are non-refundable once delivered. EU consumers retain a 14-day withdrawal right unless they expressly consent to immediate performance. Japan: 8-day refund period if unused. South Korea: 7-day cancellation period if not accessed.</p>
    <h2>4. Payments and Renewals</h2>
    <p>Subscriptions auto-renew at the cadence shown at checkout (monthly or every 4 weeks) until canceled. Trials convert to paid subscriptions at the end of the trial period. We reserve the right to modify fees prospectively with notice.</p>
    <h2>5. Disclaimer</h2>
    <p>IQBooster is provided for personal enrichment and entertainment only. It is not a medical, psychological, or clinical tool. Service is provided "as is" without warranties.</p>
    <h2>6. Changes</h2>
    <p>We may amend these Policies. Material changes will be communicated and apply prospectively.</p>
    <h2>7. Contact</h2>
    <p>Questions: <a href="mailto:info@iqbooster.org">info@iqbooster.org</a></p>
    <p className="text-sm text-muted-foreground/60 mt-10"><strong>Last Revised: 16.04.2026</strong></p>
  </div>
);

const SubJa = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
    <p>本サブスクリプションポリシーは、Maxiq Limitedが提供するIQBooster脳トレーニングサブスクリプションサービスを規定します。サブスクリプションのご購入により、本ポリシー(利用規約の不可分の一部)を読み、同意したものとみなされます。</p>
    <h2>1. サブスクリプションの内容</h2>
    <p>IQBoosterは、当社のテストサイトでの診断完了後にのみご利用いただけます。価格と請求頻度はチェックアウト時に表示されます。プランには、自動更新サブスクリプションに移行する7日間トライアル、定期アクセス、月次または4週ごとの継続サブスクリプションが含まれます。</p>
    <h2>2. 解約</h2>
    <p>IQBooster → 設定 → お支払い → 解約 から、または <a href="mailto:info@iqbooster.org">info@iqbooster.org</a> 宛のメールでいつでも解約できます。解約により以後の更新が停止します。トライアル後の最初の請求を回避するには、トライアル終了前に解約してください。</p>
    <h2>3. 返金</h2>
    <p>サブスクリプション料金は、法令で要求される場合(重複請求、未配信、不正)を除き、原則として返金されません。一括払いのデジタル商品は配信後の返金不可です。日本の消費者契約法に基づき、未利用の場合は購入から8日以内に返金を請求できます。EU消費者には即時履行に明示的に同意しない限り14日間の撤回権があります。</p>
    <h2>4. お支払いと更新</h2>
    <p>サブスクリプションは、解約されるまでチェックアウト時に表示された頻度(月次または4週ごと)で自動更新されます。トライアルはトライアル期間終了時に有料サブスクリプションに移行します。当社は事前通知により料金を将来に向かって変更する権利を留保します。</p>
    <h2>5. 免責事項</h2>
    <p>IQBoosterは個人の充実と娯楽のみを目的に提供されます。医療、心理、臨床用ツールではありません。サービスは保証なく「現状のまま」提供されます。</p>
    <h2>6. 変更</h2>
    <p>本ポリシーは変更される場合があります。重要な変更は通知され、将来に向かって適用されます。</p>
    <h2>7. お問い合わせ</h2>
    <p>ご質問:<a href="mailto:info@iqbooster.org">info@iqbooster.org</a></p>
    <p className="text-sm text-muted-foreground/60 mt-10"><strong>最終改訂日:2026年4月16日</strong></p>
    <p className="text-xs text-muted-foreground/70">本日本語版は便宜のために提供されており、英語の原文との相違がある場合は英語版が優先されます。</p>
  </div>
);

const SubscriptionPolicyPage = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {locale === 'ja' ? 'サブスクリプションポリシー' : 'Subscription Policy'}
        </h1>
        {locale === 'ja' ? (
          <>
            <SubJa />
            <p className="mt-10 text-sm">
              <a href="/subscription-policy" className="text-primary underline">{t('legal.openInOriginal')}</a>
            </p>
          </>
        ) : (
          <SubEn />
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default SubscriptionPolicyPage;
