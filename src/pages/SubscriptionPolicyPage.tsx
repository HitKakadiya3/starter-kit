import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocale } from '@/hooks/useLocale';

const SubEn = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
    <p>These Subscription Policies (the "Policies") govern the subscription service exclusively available to clients who have completed an assessment on IQBooster.org and/or WW IQ Test and/or 16types and/or WW Personality Test, and/or IQ Pro, and/or 16 Persons or others, ("we," "us," or the "Company") for its brain training services. These Policies are an integral part of our Terms and Conditions and must be read together with any other terms and legal documents we may provide. By subscribing to or purchasing our plans, you acknowledge that you have read, understood and agree to be bound by these Policies. Unless you agree to these Policies, you are not authorized to purchase or use any subscription plan offered by IQ Booster.</p>

    <h2>1. Subscription Offerings and Fees</h2>
    <p><strong>Availability.</strong> IQBooster is a premium brain-training service <strong>available only after you complete an assessment</strong> on one of our test sites, including <strong>WWIQTest.com</strong>, <strong>IQBooster.org</strong>, <strong>16types.ai</strong>, <strong>WWPersonalityTest.com</strong>, <strong>16persons.com</strong>, <strong>IQPro.ai</strong> or other Company-operated test websites (collectively, the "Sites").</p>
    <p><strong>Paid Services.</strong> After you finish a test, we may offer (i) <strong>One-Time Digital Items</strong> (for example, IQ score/results, IQ certificate, optional Detailed Report) and/or (ii) access to <strong>IQBooster</strong> as described below.</p>
    <p><strong>Fees.</strong> We reserve the right to charge fees, at our discretion, for any service provided via the Sites (including the Tests). <strong>Current pricing, taxes and any applicable fees are displayed at checkout</strong> and may also appear on a Pricing page. Prices for optional post-purchase offers (e.g., the Detailed Report) are <strong>disclosed when presented</strong>. Prices and promotions may vary by plan or offer.</p>
    <p><strong>Age requirement.</strong> The subscription service is offered only to individuals <strong>18 years or older</strong>. By subscribing, you represent that you meet this requirement.</p>

    <h3>1.1 One-Time Digital Items</h3>
    <p>Delivery is electronic—typically on-screen and/or by email to the address you provide. One-Time Digital Items are licensed for your <strong>personal, non-commercial</strong> use under our Terms.</p>

    <h3>1.2 IQBooster Access Types</h3>
    <p>Depending on availability, IQBooster may be offered in one or more of the following forms:</p>
    <ul>
      <li><strong>Trial Access (7 days).</strong> Trial access may be included with your one-time purchase of IQ results/certificate. <strong>Unless you cancel before the trial ends</strong>, access <strong>converts to a paid, auto-renewing subscription</strong> on the cadence shown at checkout (<strong>monthly or every four (4) weeks</strong>), and recurring charges apply <strong>until canceled</strong>.</li>
      <li><strong>Fixed-Term Access (one-time fee).</strong> Access for a defined term (e.g., three (3) months or another period shown at purchase). Access <strong>expires</strong> at the end of the stated term unless renewed or purchased again.</li>
      <li><strong>Recurring Subscriptions.</strong> Auto-renewing plans that <strong>bill monthly or every four (4) weeks</strong> and <strong>automatically renew</strong> at the end of each billing cycle <strong>unless canceled</strong>.</li>
      <li><strong>Discounted/Promotional Trials.</strong> Some subscription plans may begin with a discounted or promotional period. <strong>Unless canceled before the end</strong> of that period, the plan renews at the <strong>standard rate and cadence</strong> shown at checkout.</li>
    </ul>
    <p>Your <strong>selected plan</strong>, <strong>billing interval</strong>, and <strong>next charge date</strong> are displayed at checkout and may also appear in your account or confirmation email.</p>

    <h3>1.3 Changes to Plans or Fees</h3>
    <p>We may modify plans, features, cadence, or pricing <strong>prospectively</strong>. If a change affects your active subscription, we will provide notice in advance; you may <strong>cancel before</strong> the change takes effect. Continued access after the effective date constitutes acceptance of the change.</p>
    <p><strong>Consent reminder (checkout).</strong> At checkout, you will see clear offer terms (plan, price, cadence, trial end/first charge date). By clicking "Start Trial" / "Subscribe," / "Get Access," you agree to an <strong>auto-renewing subscription that continues until canceled</strong>. Cancellation details are provided in the <strong>Cancellation</strong> section of these Policies.</p>

    <h2>2. Cancellation</h2>
    <h3>2.1 How to Cancel</h3>
    <p>You can cancel <strong>any time</strong>:</p>
    <ul>
      <li>Self-serve: IQBooster → Settings → Billing → Cancel, or</li>
      <li>Email: from your account email to <a href="mailto:info@iqbooster.org">info@iqbooster.org</a>.</li>
    </ul>
    <p>The online cancellation process is <strong>at least as easy as sign-up</strong> and does <strong>not</strong> require calling or mailing us.</p>

    <h3>2.2 When Cancellation Takes Effect</h3>
    <p>Cancellation stops <strong>future auto-renewals</strong>. Your plan remains active <strong>until the end of your current billing period</strong>, and you'll retain access until that time.</p>
    <ul>
      <li><strong>Trials:</strong> To avoid your first charge, cancel <strong>before the trial ends</strong> (the trial end / next charge date is shown at checkout and in your account).</li>
      <li><strong>Renewals:</strong> To avoid the <strong>next</strong> renewal charge, submit your cancellation <strong>before</strong> the "Next charge date/time" shown in your account.</li>
    </ul>
    <p>We'll email you a <strong>cancellation confirmation</strong>—please keep it for your records.</p>

    <h3>2.3 Refunds on Cancellation</h3>
    <p>We do not provide <strong>pro-rata refunds</strong> for any unused time in the current billing period, <strong>unless required by law</strong> (e.g., a verified duplicate charge or failure to deliver after successful payment). See <strong>Payments &amp; Refunds</strong> in our Terms for details.</p>

    <h3>2.4 Reactivation</h3>
    <p>You can re-subscribe at any time by purchasing a new plan (pricing and terms in effect at that time will apply).</p>

    <h2>3. Refund Policy</h2>
    <h3>3.1 General Non-Refundable Policy</h3>
    <p><strong>Subscription fees are non-refundable</strong>, and <strong>no prorated refunds or credits</strong> are issued for partially used billing periods, <strong>unless required by applicable law</strong> or expressly stated in these Policies.</p>
    <p><strong>One-Time Digital Items</strong> (e.g., IQ score/results, certificate, detailed report) are <strong>non-refundable once delivered or made available</strong>.</p>

    <h3>3.2 Exceptions We Honor</h3>
    <p>We will issue a refund <strong>where required by law</strong> or where we verify one of the following has occurred:</p>
    <ul>
      <li><strong>Duplicate or erroneous charge</strong> (e.g., you were charged twice for the same period).</li>
      <li><strong>Non-delivery after successful payment</strong> (you did not receive access/deliverables and our records confirm service was not provided).</li>
      <li><strong>Fraudulent/unauthorized transaction</strong> (following our investigation and as permitted by law).</li>
    </ul>
    <p>Note: If you believe one of the exceptions applies, please contact <a href="mailto:info@iqpro.ai">info@iqpro.ai</a> with your order ID, email used at checkout, and a brief description.</p>

    <h3>3.3 United States</h3>
    <p>Fees for digital items and any elapsed subscription periods are <strong>non-refundable, except if required by law</strong> (e.g., verified duplicate charge or documented non-delivery after successful payment). <strong>Cancellation only stops future renewals</strong>; see <strong>Cancellation</strong> for timing.</p>

    <h3>3.4 Residents of the European Union (EU)</h3>
    <p>Pursuant to EU consumer rules, you may withdraw from a service agreement <strong>within fourteen (14) days</strong> of conclusion <strong>unless</strong> you requested or began immediate performance. By purchasing and accessing IQBooster (or receiving digital items immediately), you <strong>expressly consent</strong> to the start of services and <strong>acknowledge</strong> that once delivered, <strong>your right of withdrawal is lost</strong>. Where you withdraw within 14 days <strong>and</strong> the service has not been fully performed, we may deduct an amount proportionate to the service provided up to your withdrawal date as permitted by law.</p>

    <h3>3.5 Japan</h3>
    <p>Under the <strong>Consumer Contract Act</strong>, you may request a refund <strong>within eight (8) days</strong> of purchase <strong>if you have not used the service</strong>. If access has occurred, refunds generally apply <strong>only</strong> where the service was <strong>defective or not properly provided</strong>, in accordance with law.</p>

    <h3>3.6 South Korea</h3>
    <p>Under the <strong>Act on the Consumer Protection in Electronic Commerce</strong>, you may cancel <strong>within seven (7) days</strong> of the transaction <strong>unless</strong> you have accessed the service. If digital content has been provided or accessed, a refund may not be available <strong>unless</strong> the service was <strong>defective or unavailable</strong>.</p>

    <h3>3.7 How Refunds Are Issued</h3>
    <p>Approved refunds are processed to the <strong>original payment method</strong> (card or PayPal). Processing times vary by provider and bank. We may request reasonable information to verify eligibility and prevent fraud.</p>

    <h3>3.8 Chargebacks</h3>
    <p>If you initiate a chargeback, we may <strong>suspend or limit access</strong> while the dispute is pending. We may provide transaction and delivery records to your payment provider to help resolve the dispute. This does not limit any rights you may have under applicable law.</p>

    <h2>4. Payment and Renewals</h2>
    <h3>4.1 Payment Processing</h3>
    <p>All subscription fees (including those for <strong>trials converting to paid plans</strong>) are charged <strong>upfront</strong> and are processed through our designated payment provider(s). You must ensure your payment information is accurate and updated, as failure to process a payment may result in <strong>suspension or cancellation</strong> of your subscription. <strong>By starting a trial or purchasing a recurring plan, you authorize recurring charges to your selected payment method on the cadence shown at checkout (monthly or every four (4) weeks) until you cancel.</strong></p>
    <p><strong>Payment retries and updater.</strong> You authorize <strong>reasonable reattempts</strong> for failed payments and the use of <strong>card-network account updater services</strong> to help keep your payment details current. Access may be <strong>suspended</strong> until payment is completed.</p>
    <p><strong>Taxes and currency.</strong> Prices may include/exclude VAT as displayed; <strong>sales/use or other taxes</strong> may be added where required. Your bank/payment provider may apply <strong>FX rates or fees</strong> we do not control.</p>

    <h3>4.2 Price Changes</h3>
    <p>We reserve the right to modify subscription fees at any time at our sole discretion. Changes apply prospectively. Reasonable efforts will be made to provide advance notice of any changes that affect your active plan. Your continued use of the subscription following the fee change constitutes your agreement to pay the modified fee; if you do not agree, you may cancel before the change takes effect.</p>

    <h3>4.3 Auto-Renewals &amp; Trial Conversion</h3>
    <p>Subscriptions auto-renew at the end of each billing cycle (monthly or every four (4) weeks) until canceled. Trials convert to paid at the end of the stated trial (e.g., 7 days) unless you cancel before the trial ends. Your next charge date is displayed at checkout and/or in your account, and we send a post-purchase acknowledgment email confirming your plan, price, cadence, next charge date, and how to cancel.</p>

    <h3>4.4 Cancellation Timing</h3>
    <p>To avoid the next charge, cancel before the "Next charge date/time" shown in your account. Cancellation takes effect at the end of the current billing period; access continues until then. No prorated refunds are provided for partial periods unless required by law (see Refund Policy).</p>

    <h2>5. Disclaimer of Warranties &amp; Limitation of Liability</h2>
    <p><strong>Important notice (purpose only).</strong> IQBooster subscription services are provided solely for personal enrichment and entertainment. They are not medical, psychological, or clinical tools and must not be used for diagnosis, treatment, or any health-related decision.</p>
    <p><strong>As-is; no warranties.</strong> To the fullest extent permitted by law, the subscription services (and any content therein) are provided "as is," "as available," and "with all faults." We do not make any warranties—express, implied, or statutory—including merchantability, fitness for a particular purpose, non-infringement, or that the services will be uninterrupted, error-free, secure, or free of harmful components.</p>
    <p><strong>Limitation of liability.</strong> To the maximum extent permitted by law, our total aggregate liability for any claims arising out of or relating to these Policies or the subscription services—regardless of the theory of liability (contract, tort, strict liability, or otherwise)—will not exceed the amount you actually paid for the then-current subscription period, or USD $1, whichever is greater.</p>
    <p><strong>Exclusions of certain damages.</strong> To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, lost data, business interruption, or loss of goodwill, even if advised of the possibility of such damages and even if a remedy fails of its essential purpose.</p>
    <p><strong>Consumer-law safeguard.</strong> Some jurisdictions do not allow certain disclaimers or limitations. In those places, the above terms apply only to the extent permitted by applicable law. Nothing in this Section limits any non-waivable consumer rights you may have.</p>

    <h2>6. Changes to These Policies</h2>
    <p>We may amend or update these Policies from time to time to reflect changes in our practices, the Services, or applicable law. The "Last Updated" date at the top of this document shows when they were most recently revised.</p>
    <p><strong>Notice of material changes.</strong> For material updates, we will make reasonable efforts to provide notice (e.g., a clear notice on our Website and/or an email to the address associated with your account, when feasible).</p>
    <p><strong>When changes take effect.</strong></p>
    <ul>
      <li>Unless stated otherwise in the notice or required by law, material changes take effect on the date specified in the notice (or, if no date is specified, upon posting).</li>
      <li>Updates made to address legal, regulatory, security, or operational needs may take effect immediately where permitted by law.</li>
    </ul>
    <p><strong>Your choices.</strong> If you do not agree to the updated Policies, you should cancel your subscription before the effective date of the change (see Cancellation). Your continued use of the subscription after the effective date constitutes your acceptance of the updated Policies.</p>
    <p><strong>Prospective application.</strong> Changes apply prospectively and do not alter rights or obligations relating to periods before the effective date.</p>

    <h2>7. Contact Us</h2>
    <p>If you have any questions, concerns, or wish to exercise any of your rights under these Policies, please contact us at <strong><a href="mailto:info@iqbooster.org">info@iqbooster.org</a></strong>.</p>
    <p>We will make commercially reasonable efforts to respond to you in a timely manner and address any concerns you may have about these Policies or your subscription.</p>
    <p>By subscribing to any IQBooster plan, you acknowledge that you have read and understood these Subscription Policies, agree to be bound by them, and that they form an integral part of our Terms and Conditions. If you do not agree to these Policies, please do not purchase or continue to use any IQBooster subscription.</p>

    <p className="text-sm text-muted-foreground/60 mt-10"><strong>Last Revised: 06.05.2026</strong></p>
    <p className="text-xs text-muted-foreground/70">Our content is offered in multiple languages through a combination of human and AI-assisted translation. While we make every effort to ensure accuracy, the English version is the official and legally binding text.</p>
  </div>
);

const SubJa = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
    <p>このサブスクリプションポリシー(以下「本ポリシー」)は、IQBooster.org、WW IQ Test、16types、WW Personality Test、IQ Pro、16 Persons またはその他(以下「当社」)のテストを完了したユーザー向けに提供される、脳トレーニング向けサブスクリプションサービスに適用されます。本ポリシーは利用規約の一部であり、その他の法的文書と共にお読みいただく必要があります。サブスクリプションまたはプランを購入することで、お客様は本ポリシーを読み、理解し、同意したものとみなします。本ポリシーに同意しない場合、IQ Booster が提供するサブスクリプションプランを購入または利用することはできません。</p>

    <h2>1. サブスクリプション内容および料金</h2>
    <p><strong>提供条件。</strong> IQBooster はテスト完了後のみ利用可能な有料脳トレーニングサービスです。対象となるサイトには、WWIQTest.com、IQBooster.org、16types.ai、WWPersonalityTest.com、16persons.com、IQPro.ai、および当社が運営するその他のテストサイト(以下総称して「サイト」)が含まれます。</p>
    <p><strong>有料サービス。</strong> テスト完了後、(i) <strong>デジタルアイテム(1回購入)</strong>(例:IQスコア／結果、IQ証明書、詳細レポートオプション)および／または (ii) 以下に記載する<strong>IQBooster へのアクセス</strong>を提供する場合があります。</p>
    <p><strong>料金。</strong> 当社は、サイトで提供されるサービス(テストを含む)に対して、独自の裁量で料金を設定する権利を有します。<strong>最新の価格、税金および適用手数料はチェックアウト時に表示</strong>される場合があり、価格ページに掲載されることもあります。追加購入項目(例:詳細レポート)は、<strong>提示時に明確に表示</strong>されます。価格やキャンペーンはプランまたは提供内容により異なる場合があります。</p>
    <p><strong>年齢要件。</strong> 本サービスは<strong>18歳以上</strong>のみ利用できます。サブスクリプションを開始することにより、お客様はこの条件を満たしていることを保証するものとします。</p>

    <h3>1.1 デジタルアイテム(1回購入)</h3>
    <p>配信は電子形式で行われ、画面表示または登録メールアドレスへの送信となります。デジタルアイテムは、利用規約に基づき、個人利用目的でのみライセンスされます。</p>

    <h3>1.2 IQBooster のアクセス形式</h3>
    <p>提供状況に応じて、IQBooster は以下のいずれかの形式で提供される場合があります:</p>
    <ul>
      <li><strong>トライアルアクセス(7日間)。</strong> トライアル期間はIQ結果／証明書購入時に付与される場合があります。トライアル期間終了前にキャンセルしない場合、当該アクセスは<strong>有料自動更新プラン</strong>に切り替わり、チェックアウト時に表示された単位(毎月または4週間ごと)で課金され、キャンセルされるまで継続します。</li>
      <li><strong>期間限定アクセス(一度購入)。</strong> 購入時に提示される期間(例:3か月)アクセスできます。期間終了後は、再購入または更新しない限りアクセスは終了します。</li>
      <li><strong>自動更新プラン。</strong> 毎月または4週間ごとに課金され、キャンセルしない限り自動更新されます。</li>
      <li><strong>割引／プロモーション期間。</strong> プロモーション価格で開始される場合があります。期間内にキャンセルしない場合、チェックアウト時に表示された通常料金と更新サイクルに切り替わります。</li>
    </ul>
    <p>選択したプラン、請求サイクル、次回請求日はチェックアウト画面およびアカウントまたは確認メールに表示されます。</p>

    <h3>1.3 プランや料金の変更</h3>
    <p>当社は、プラン・機能・更新周期・価格を将来に向けて変更する場合があります。変更が既存サブスクリプションに影響する場合は、事前に通知します。その際、変更の適用前にキャンセルすることができます。継続利用された場合、変更に同意したものとみなします。</p>
    <p><strong>同意確認(チェックアウト時)。</strong> チェックアウト画面では、プラン、価格、更新周期、トライアル終了日／初回請求日が明確に表示されます。「トライアル開始」「サブスク登録」「アクセスを取得」をクリックすることで、自動更新サブスクリプションに同意したものとみなされ、キャンセルされるまで継続します。解約方法は本ポリシーのキャンセル規定に記載されています。</p>

    <h2>2. 解約について</h2>
    <h3>2.1 解約方法</h3>
    <p>サブスクリプションはいつでも解約できます:</p>
    <ul>
      <li>セルフサービス:IQBooster → 設定 → 請求 → 解約 をクリック</li>
      <li>メール:登録メールアドレスから <a href="mailto:info@iqbooster.org">info@iqbooster.org</a> 宛に連絡</li>
    </ul>
    <p>オンライン解約手続きは登録時と同じくらい簡単で、電話や郵送は不要です。</p>

    <h3>2.2 解約が反映されるタイミング</h3>
    <p>解約は次回以降の自動更新を停止します。現在の課金期間の終了まではプランが有効で、アクセス権はその期間内保持されます。</p>
    <ul>
      <li><strong>トライアル:</strong>請求を防ぐには、トライアル終了前に解約してください。</li>
      <li><strong>更新中のプラン:</strong>次回請求を防ぐには、アカウントに表示される「次回請求日」より前に解約してください。</li>
    </ul>
    <p>解約後、確認メールをお送りしますので保管してください。</p>

    <h3>2.3 解約時の返金について</h3>
    <p>現在の請求期間内で未使用の期間に対する日割り返金はありません(ただし法律で義務付けられる場合を除きます)。詳しくは利用規約の支払い・返金ポリシーをご確認ください。</p>

    <h3>2.4 再開について</h3>
    <p>サブスクリプションはいつでも再購入できます。その際は当時の価格と条件が適用されます。</p>

    <h2>3. 返金ポリシー</h2>
    <h3>3.1 原則として返金不可</h3>
    <p>サブスクリプション料金は<strong>返金不可</strong>であり、部分利用の料金に対し日割り返金やクレジットは提供されません(法律により義務付けられる場合または別途明記されている場合を除きます)。</p>
    <p>デジタルアイテム(例:IQ結果、証明書、詳細レポート)は、提供後またはアクセス可能になった時点で返金不可です。</p>

    <h3>3.2 例外事項</h3>
    <p>法律に基づき返金義務がある場合、または以下に該当する場合は返金します:</p>
    <ul>
      <li><strong>重複請求または誤請求</strong></li>
      <li><strong>支払い成功後にアクセスが提供されなかった場合</strong></li>
      <li><strong>不正・未承認取引(調査および法令に基づく場合)</strong></li>
    </ul>
    <p>該当する場合は、注文番号・登録メールアドレス・内容を記載し <a href="mailto:info@iqpro.ai">info@iqpro.ai</a> までご連絡ください。</p>

    <h3>3.3 米国</h3>
    <p>返金は法律が必要とする場合を除き不可です。解約は次回請求分に対してのみ適用されます。</p>

    <h3>3.4 EU加盟国</h3>
    <p>EU消費者法に基づき、<strong>購入後14日以内</strong>の撤回権が適用されます。ただし、サービス開始(利用またはアクセス)した場合、撤回権は失効します。</p>

    <h3>3.5 日本</h3>
    <p>消費者契約法に基づき、<strong>購入後8日以内</strong>かつ未使用の場合のみ返金可能です。アクセス済みの場合は、<strong>提供ミスまたは欠陥がある場合に限り返金対象</strong>となります。</p>

    <h3>3.6 韓国</h3>
    <p>電子商取引法により、<strong>購入後7日以内</strong>で未利用の場合解約可能です。アクセス済みの場合は、サービス提供に欠陥があった場合のみ返金対象です。</p>

    <h3>3.7 返金方法</h3>
    <p>返金が承認された場合、支払い時と同じ方法(カードまたはPayPal)に返金されます。</p>

    <h3>3.8 チャージバックについて</h3>
    <p>チャージバックが開始された場合、調査中はアカウントが制限または停止される場合があります。</p>

    <h2>4. 支払いと更新</h2>
    <h3>4.1 支払い処理</h3>
    <p>すべてのサブスクリプション料金(トライアル後の自動課金含む)は前払いです。「サブスク開始」「トライアル開始」をクリックすると、自動更新課金に同意したものとみなされます。未払い時再請求・カード情報更新サービスが適用され、未払いが続く場合はアカウントが停止されることがあります。</p>

    <h3>4.2 価格変更</h3>
    <p>価格変更は将来に向け適用され、継続利用した場合は同意したものとみなされます。</p>

    <h3>4.3 自動更新とトライアル切替</h3>
    <p>サブスクリプションは、キャンセルされるまで自動更新されます。</p>

    <h2>5. 免責事項および責任制限</h2>
    <p><strong>重要なお知らせ(利用目的のみ)。</strong> IQBooster のサブスクリプションサービスは、個人の知的成長や娯楽目的で提供されるものであり、医療・心理・臨床用途として設計されたものではありません。診断、治療、または健康判断のために使用することはできません。</p>
    <p><strong>現状有姿提供(保証無し)。</strong> 適用法で許容される最大範囲において、本サービス(およびコンテンツ)は「現状のまま」「提供可能な状態で」「一切の瑕疵を含むもの」として提供されます。当社は、明示・黙示・法定いずれの保証(商品性、特定目的適合性、権利非侵害、中断無し、エラー無し、安全性、ウイルスや有害要素の不存在など)も提供しません。</p>
    <p><strong>責任制限。</strong> 適用法で許容される最大範囲において、本ポリシーまたはサービスに関連して発生する当社の累積責任総額は、<strong>お客様が直近の課金期間に実際に支払った金額、または USD $1 のいずれか高い方を上限とします。</strong></p>
    <p><strong>損害の除外。</strong> 適用法で許容される最大範囲において、当社は、間接的、付随的、特別、結果的、懲罰的損害(利益損失、データ損失、事業中断、信用損失など)について一切責任を負いません。たとえその可能性が通知されていた場合や、救済措置が本来の目的を果たさなかった場合でも同様です。</p>
    <p><strong>消費者保護。</strong> 一部の法域では、免責・制限が認められない場合があります。その場合は、適用法が許容する範囲でのみ本条項が適用されます。本セクションは放棄できない消費者権利を制限するものではありません。</p>

    <h2>6. 本ポリシーの変更</h2>
    <p>当社は、本ポリシーを必要に応じて更新する場合があります。変更内容はサービス・法改正・運用方針の変更を反映します。「最終更新日」は文書上部に記載されています。</p>
    <p><strong>重要な変更の通知。</strong> 重大な更新がある場合、合理的な範囲で通知(サイト上の案内または登録メールへの連絡など)を行います。</p>
    <p><strong>変更の適用時期。</strong></p>
    <ul>
      <li>通知に別途記載がない限り、重大な変更は指定日、または未指定の場合は公開時点で有効となります。</li>
      <li>法的・規制・セキュリティ対応または運用上必要な変更は、法令が許す場合即時適用される場合があります。</li>
    </ul>
    <p><strong>お客様の選択。</strong> 更新内容に同意しない場合は、変更が有効になる前にサブスクリプションを解約してください。変更後のサービス継続利用は、更新ポリシーへの同意を意味します。</p>
    <p><strong>将来適用。</strong> 変更内容は将来の利用に適用され、変更前の期間・権利・義務には遡及しません。</p>

    <h2>7. お問い合わせ</h2>
    <p>本ポリシーに関する質問、懸念、または権利行使をご希望の場合は、次のメールアドレスまでご連絡ください:<strong><a href="mailto:info@iqboost.org">info@iqboost.org</a></strong></p>
    <p>当社は合理的範囲で迅速に対応し、ポリシーやサブスクリプションに関する問題解決に努めます。</p>
    <p>IQBooster のサブスクリプションに登録することで、お客様は本ポリシーを読み、理解し、同意したものとみなされます。同意しない場合、サービスの購入や継続利用はご遠慮ください。</p>

    <p className="text-sm text-muted-foreground/60 mt-10"><strong>最終更新日:2026年5月6日</strong></p>
    <p className="text-xs text-muted-foreground/70">※本コンテンツは複数言語で提供されており、AI補助翻訳および人間翻訳を組み合わせています。正確性に努めていますが、法的効力を持つ正式版は英語版となります。</p>
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
