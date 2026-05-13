import type { ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { usePricing } from '@/hooks/usePricing';
import { DEFAULT_SUBSCRIPTION_DAYS } from '@/lib/pricingConstants';

const LegalNoticePage = () => {
  const { current, isLoading, isError, refetch } = usePricing();

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-16 flex items-center">
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 w-full text-center space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              Couldn&apos;t load pricing. Please try again.
            </h2>
            <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const pricePlaceholder = (
    <span
      className="inline-block h-4 w-16 bg-muted rounded animate-pulse align-baseline"
      aria-hidden="true"
    />
  );

  const showPlaceholder = isLoading || !current;
  const firstPrice: ReactNode = showPlaceholder ? pricePlaceholder : current.first_sale_price_label;
  const subscriptionPrice: ReactNode = showPlaceholder ? pricePlaceholder : current.subscription_price_label;
  const crossSalePrice: ReactNode = showPlaceholder ? pricePlaceholder : current.cross_sale_price_label;
  const billingDays = DEFAULT_SUBSCRIPTION_DAYS;

  const rows: [string, ReactNode][] = [
    ['販売業者', 'MAXIQ LIMITED'],
    ['代表者', 'Despina Vasileiou'],
    ['所在地', 'Markou Drakou, 2A, Livadia 7060, Larnaka, Cyprus'],
    ['電話番号', '+357 (24) 020235'],
    ['メールアドレス', 'info@max-iq.com'],
    ['販売価格', <>{firstPrice}(初回) / {subscriptionPrice}(以降{billingDays}日ごと)</>],
    ['商品代金以外の必要料金', <>オプション:フルレポートを{crossSalePrice}にてご購入いただけます</>],
    ['支払方法', 'クレジット/デビットカード、PayPal、Google Pay、Apple Pay'],
    ['支払時期', `チェックアウト時に初回請求、以降${billingDays}日ごとに自動更新`],
    ['引渡時期', '支払完了直後(即時電子配信)'],
    ['返品の特約', 'デジタル商品配信後は原則返金不可。日本の消費者契約法に基づき、購入後8日以内かつ未使用の場合に限り返金可能'],
    ['動作環境', 'モダンブラウザ(Chrome / Safari / Edge / Firefox など)'],
    ['販売条件', `自動更新サブスクリプション。キャンセルされるまで${billingDays}日ごとに請求が継続されます`],
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">
          特定商取引法に基づく表記
        </h1>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([label, value], i) => (
                <tr key={label} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                  <th className="text-left align-top font-semibold text-foreground p-4 w-1/3 border-b border-border">
                    {label}
                  </th>
                  <td className="text-muted-foreground p-4 border-b border-border">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LegalNoticePage;
