import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const rows: [string, string][] = [
  ['販売業者', 'MAXIQ LIMITED'],
  ['代表者', 'Despina Vasileiou'],
  ['所在地', 'Markou Drakou, 2A, Livadia 7060, Larnaka, Cyprus'],
  ['電話番号', '+357 (24) 020235'],
  ['メールアドレス', 'info@max-iq.com'],
  ['販売価格', '¥199(初回) / ¥4,990(以降28日ごと)'],
  ['商品代金以外の必要料金', 'オプション:フルレポートを¥1,990にてご購入いただけます'],
  ['支払方法', 'クレジット/デビットカード、PayPal、Google Pay、Apple Pay'],
  ['支払時期', 'チェックアウト時に初回請求、以降28日ごとに自動更新'],
  ['引渡時期', '支払完了直後(即時電子配信)'],
  ['返品の特約', 'デジタル商品配信後は原則返金不可。日本の消費者契約法に基づき、購入後8日以内かつ未使用の場合に限り返金可能'],
  ['動作環境', 'モダンブラウザ(Chrome / Safari / Edge / Firefox など)'],
  ['販売条件', '自動更新サブスクリプション。キャンセルされるまで28日ごとに請求が継続されます'],
];

const LegalNoticePage = () => {
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
