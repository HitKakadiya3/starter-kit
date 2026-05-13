import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocale } from '@/hooks/useLocale';

const TermsEn = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2">
    <h2>1. Introduction; Contract Formation</h2>
    <p>These Terms and Conditions (the "Terms") govern your use of the websites operated by Maxiq Limited, with the registered office at Markou Drakou, 2A, Livadia 7060, Larnaca, Cyprus ("Company," "we," "us," or "our"), including <strong>16types.ai</strong> and its subdomains and related sites and services (collectively, the "Website" or the "Service"), which include access to paid personality results and the <strong>IQBooster</strong> brain-training subscription.</p>
    <p>By entering, connecting to, accessing, or using the Service, you acknowledge that you have read and understood these Terms and our <strong>Privacy Policy</strong> available at <a href="/privacy-policy">https://16types.ai/privacy-policy</a>, and you agree to be bound by them and to comply with all applicable laws and regulations in connection with your use of the Service. These Terms form a binding and enforceable legal contract between you and the Company. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ENTER, CONNECT TO, ACCESS, OR USE THE SERVICE.</p>
    <p>These Terms incorporate by reference any policies or notices referenced here (including the Privacy Policy) and apply to all features, content, and functionality made available through the Service. Certain sections below provide additional requirements or information that may apply based on your location or the specific features you use. Nothing in these Terms limits any non-waivable rights you may have under applicable law.</p>

    <h2>2. Definitions</h2>
    <p>For ease of reference, the following terms have the meanings below. Other capitalized terms may be defined where they first appear.</p>
    <ul>
      <li><strong>"Company," "we," "us," "our"</strong> means Maxiq Limited, organized under the laws of Cyprus, operating the Service described in these Terms.</li>
      <li><strong>"Website"</strong> means <strong>16types.ai</strong> and its subdomains and related sites we operate.</li>
      <li><strong>"Service"</strong> means the Website and all features, content, products, and services made available through it, including access to paid personality results and the <strong>IQBooster</strong> brain-training subscription.</li>
      <li><strong>"16types"</strong> means the online personality test made available via the Service.</li>
      <li><strong>"IQBooster"</strong> means our brain-training service that may be offered as a recurring subscription.</li>
      <li><strong>"User," "you," "your"</strong> means any individual who accesses or uses the Service.</li>
      <li><strong>"Account"</strong> means a registered user account created to access certain parts of the Service.</li>
      <li><strong>"Content"</strong> means any text, images, graphics, audio, video, data, certificates, reports, or other materials available on or through the Service, including User-provided content where applicable.</li>
      <li><strong>"Digital Items"</strong> means one-time digital deliverables made available through the Service, such as personality results, a personality certificate, and any detailed report or similar add-on.</li>
      <li><strong>"Order"</strong> means a one-time purchase of Digital Items.</li>
      <li><strong>"Subscription"</strong> means an auto-renewing, paid plan that provides access to IQBooster or other recurring features of the Service for a specified period.</li>
      <li><strong>"Trial"</strong> means a free or promotional period of access to a Subscription that automatically converts to a paid Subscription unless canceled in accordance with these Terms.</li>
      <li><strong>"Billing Cycle"</strong> means the recurring interval (for example, every 4 weeks or monthly) at which Subscription charges are billed.</li>
      <li><strong>"Renewal"</strong> means the automatic continuation of a Subscription for a subsequent Billing Cycle unless canceled in accordance with these Terms.</li>
      <li><strong>"Cancellation"</strong> means a User's action to terminate a Subscription effective at the end of the then-current Billing Cycle, unless otherwise stated in these Terms.</li>
      <li><strong>"Payment Method"</strong> means a valid form of payment you provide to us (for example, credit/debit card or other supported method) to pay for Orders and Subscriptions.</li>
      <li><strong>"Charges"</strong> means amounts payable for Orders, Subscriptions, taxes, and any applicable fees disclosed at checkout or in the Service.</li>
      <li><strong>"Third-Party Services"</strong> means websites, applications, platforms, payment processors, or other services that are not owned or controlled by the Company but may interact with or be used in connection with the Service.</li>
      <li><strong>"Privacy Policy"</strong> means our privacy notice available at <a href="/privacy-policy">https://16types.ai/privacy-policy</a>, as updated from time to time.</li>
      <li><strong>"Applicable Law"</strong> means mandatory laws and regulations that apply to your use of the Service based on your location and the place of contract, without prejudice to the Governing Law and Dispute Resolution sections below.</li>
      <li><strong>"Notices"</strong> means formal communications regarding the Service or these Terms, provided in accordance with the <strong>Notices; Contact Information</strong> section.</li>
      <li><strong>"Force Majeure"</strong> means any event or circumstance beyond a party's reasonable control that prevents or delays performance, including acts of God, natural disasters, epidemics/pandemics, war, terrorism, civil unrest, labor disputes or strikes (not involving the affected party's own workforce), failures or outages of utilities, telecommunications or internet services, denial-of-service attacks or other hostile network events, governmental actions, orders or restrictions, and changes in law.</li>
    </ul>

    <h2>3. Eligibility & User Accounts</h2>
    <h3>3.1 Eligibility</h3>
    <p>The Service is available <strong>only to individuals who (a) are at least eighteen (18) years old, or older if required by their local laws to enter into a binding agreement; and (b) possess the legal capacity to enter into these Terms</strong> (on behalf of themselves and, if applicable, their organization). By using the Service, you represent and warrant that you meet these requirements and that you are not prohibited from using the Service under applicable law.</p>
    <h3>3.2 Account Registration</h3>
    <p>Certain features of the Service may require registration. When you create an Account, you must provide accurate, current, and complete information and keep it updated. We may refuse, suspend, or terminate an Account if we reasonably believe any registration information is inaccurate, incomplete, misleading, or used in violation of these Terms.</p>
    <h3>3.3 Account Use & Security</h3>
    <p>You are responsible for all activity that occurs under your Account and for maintaining the confidentiality and security of your login credentials. Do not share, transfer, or sell your Account or credentials. You agree to promptly notify us of any suspected unauthorized access or security breach. We are not liable for loss or damage arising from unauthorized use of your Account that occurs prior to your notification.</p>
    <h3>3.4 One Account per Individual</h3>
    <p>Unless expressly permitted by us in writing, each individual may maintain only one (1) Account for personal use. Accounts created to impersonate others or to circumvent restrictions (including trial limitations or payment obligations) are prohibited.</p>
    <h3>3.5 Accuracy of Information; Updates</h3>
    <p>You agree to keep your contact, billing, and other Account information accurate and up to date and to update such information promptly if it changes. We may require additional information or verification where reasonably necessary (for example, to confirm eligibility, prevent fraud, or comply with applicable law).</p>
    <h3>3.6 Our Rights to Suspend or Terminate</h3>
    <p>We may suspend or terminate access to the Service (in whole or in part) if we reasonably believe you have violated these Terms, engaged in fraud or abuse, or if required to do so by applicable law or a competent authority. Where legally permitted, we will provide notice of the reason for suspension or termination.</p>
    <h3>3.7 Third-Party Access</h3>
    <p>If you access the Service through a third-party service (for example, a single sign-on provider), you authorize us to obtain and use information from that third party as described in our Privacy Policy. Your relationship with any third-party service is governed solely by your agreement with that third party.</p>

    <h2>4. Privacy & Data Protection</h2>
    <h3>4.1 General</h3>
    <p>We respect your privacy and handle personal data in accordance with our <strong>Privacy Policy</strong> available at <a href="/privacy-policy">https://16types.ai/privacy-policy</a>. By using the Service, you acknowledge that your personal data will be collected and processed as described in the Privacy Policy.</p>
    <h3>4.2 Regional Compliance</h3>
    <p>We comply with applicable data-protection laws for users in relevant jurisdictions, including:</p>
    <ul>
      <li>the <strong>EU/EEA</strong> General Data Protection Regulation (<strong>GDPR</strong>),</li>
      <li><strong>U.S.</strong> state privacy laws (e.g., California),</li>
      <li>Japan's <strong>APPI</strong>, and</li>
      <li>South Korea's <strong>PIPA</strong>.</li>
    </ul>
    <p>Details about our legal bases for processing (where required), individual rights and how to exercise them, international data transfers (and applicable safeguards), and our contact details are set out in the Privacy Policy.</p>
    <h3>4.3 Third-Party Services & Processors</h3>
    <p>We may use third-party providers (e.g., payment processors, analytics, hosting) in connection with the Service. Information about these providers and how they process data on our behalf is described in the Privacy Policy.</p>
    <h3>4.4 Marketing Communications & Preferences</h3>
    <p>Your choices regarding marketing communications (including opt-out mechanisms) are described in the Privacy Policy and in our messages to you. Unsubscribe links will be included where required by law.</p>
    <h3>4.5 Cookies & Similar Technologies</h3>
    <p>Our use of cookies and similar technologies, and how you can manage preferences, is described in the Privacy Policy (and, where applicable, our cookie notice).</p>
    <h3>4.6 Age-Related Notices</h3>
    <p>The Service is intended for <strong>adults (18+)</strong> as set out in Section 3. We do not knowingly collect personal data from children where prohibited by law. For more information, please see the Privacy Policy.</p>

    <h2>5. Paid Services; One-Time Digital Items; Subscriptions</h2>
    <p>The Website provides access to our proprietary online personality tests (the "<strong>Tests</strong>"). Use of the Tests may be offered free of charge; however, upon completing a Test we may offer you <strong>paid services</strong> (collectively, "<strong>Paid Services</strong>"), including:</p>
    <ul>
      <li><strong>One-Time Digital Items</strong> such as your <strong>personality type result</strong>, a <strong>personality certificate</strong>, and an optional <strong>Detailed Report</strong> (or similar add-on); and</li>
      <li>Access to <strong>IQBooster</strong>, our premium brain-training plan, which may be provided as fixed-term access or as an auto-renewing subscription, as described below.</li>
    </ul>
    <p>We reserve the right to charge fees, at our discretion, for any service provided via the Site (including the Tests) at any time.</p>
    <h3>5.1 Pricing</h3>
    <p>Current pricing and any applicable taxes or fees are shown at checkout and may also be presented on our Pricing page available from the Site through the link <a href="/pricing">https://16types.ai/pricing/</a>. Prices for optional post-purchase offers (e.g., the Detailed Report) are disclosed at the time the offer is presented. Prices and offers may vary by plan or promotion.</p>
    <h3>5.2 One-Time Digital Items</h3>
    <p>If you purchase One-Time Digital Items (e.g., personality type result, personality certificate, Detailed Report), delivery is electronic—typically via on-screen confirmation and/or email to the address you provide. One-Time Digital Items are licensed for your personal, non-commercial use in accordance with these Terms.</p>
    <h3>5.3 IQBooster Subscription</h3>
    <p>Depending on availability, IQBooster may be offered in one or more of the following forms:</p>
    <ul>
      <li><strong>Trial Access (7 days).</strong> Trial access may be included with your one-time purchase of personality results and certificate. Unless you cancel before the trial ends, your access converts to a paid subscription on the cadence disclosed at checkout (for example, every 4 weeks), and recurring charges will apply until canceled.</li>
      <li><strong>Fixed-Term Access (one-time fee).</strong> Access for a defined term (for example, three (3) months or another period shown at purchase). Access expires at the end of the stated term unless renewed or purchased again.</li>
      <li><strong>Recurring Subscriptions.</strong> Auto-renewing plans that bill monthly or every four (4) weeks and automatically renew at the end of each billing cycle unless canceled.</li>
      <li><strong>Discounted Trials for Certain Plans.</strong> Some subscription plans may begin with a discounted or promotional period. Unless canceled before the end of the promotional period, the plan renews at the standard rate and cadence shown at checkout.</li>
    </ul>
    <p>The specific plan, billing interval, and next charge date for your purchase are displayed at checkout and/or in your Account.</p>
    <h3>5.4 Recurring Billing & Your Consent</h3>
    <p>Immediately before you provide consent at checkout, we display your plan, price, billing cadence, trial end/first charge date, and how to cancel. By starting a Trial that converts to paid, or by purchasing a recurring subscription, you authorize us to charge the payment method you provide on a recurring basis at the disclosed cadence and at the then-current rate, until you cancel. You will receive confirmation of sign-up and, where applicable, of trial-to-paid conversion and subsequent renewals. The acknowledgment will include your plan, price, billing cadence, next charge date, and how to cancel.</p>
    <h3>5.5 How to Cancel</h3>
    <p>You may <strong>cancel at any time</strong> through <strong>Account → Billing → Cancel</strong> (or via any cancellation path we provide in the Service).</p>
    <ul>
      <li><strong>Trials:</strong> If you cancel <strong>before</strong> the trial ends, <strong>no paid subscription begins</strong> and no recurring charges occur.</li>
      <li><strong>Subscriptions:</strong> Cancellation takes effect at the <strong>end of the then-current billing cycle</strong>; you will retain access until that time.</li>
    </ul>
    <h3>5.6 Optional Post-Purchase Offers</h3>
    <p>From time to time, we may present <strong>optional</strong> add-ons (e.g., the <strong>Detailed Report</strong>) <strong>after</strong> your initial purchase. We will clearly disclose the price and material terms and obtain your <strong>express consent</strong> before charging for any add-on.</p>
    <h3>5.7 Legal Notice</h3>
    <p><strong>IQBooster is a premium service exclusively available to clients who have completed an assessment on <a href="https://16types.ai/">https://16types.ai/</a>. Charges will appear as follows, depending on payment method:</strong></p>
    <ul>
      <li><strong>Card payments (e.g., Visa/Mastercard): "16types"</strong></li>
    </ul>
    <p><strong>IMPORTANT NOTE:</strong></p>
    <ol>
      <li>THE SITE AND THE TESTS ARE MADE AVAILABLE <strong>SOLELY FOR ENTERTAINMENT PURPOSES</strong> AND SHOULD NOT BE USED FOR PROFESSIONAL DIAGNOSTICS, ANALYSIS, OR CONSULTATION.</li>
      <li>TEST RESULTS MAY VARY DEPENDING ON EACH EXAMINEE'S CHARACTERISTICS, THE TYPE OF TEST EMPLOYED, AND EXTERNAL CIRCUMSTANCES (E.G., FATIGUE).</li>
      <li>ANY RELIANCE ON TEST RESULTS (INCLUDING CERTIFICATES) IS <strong>AT YOUR OWN RISK</strong>.</li>
      <li>ANY CERTIFICATE WE ISSUE ATTESTS ONLY TO COMPLETION OF THE APPLICABLE TEST AND <strong>DOES NOT CONSTITUTE A STANDARDIZED OR PROFESSIONAL CERTIFICATION</strong>.</li>
    </ol>

    <h2>6. Consideration</h2>
    <p>Certain features of the Site, as well as certain services provided via the Site, may be subject to the payment of fees as specified on the Site from time to time at the Company's discretion (the "Consideration"). Fee changes apply prospectively. For Subscriptions, any change to price or billing cadence will be communicated and take effect in accordance with Section 7 (Billing & Cancellation). If you fail to pay the Consideration, or if your payment method is invalid or declined, and you do not promptly update payment information upon our request, we may suspend or cancel your access to the applicable services. Where permitted by your payment network, you authorize us to obtain updated card details through account updater services to try to complete transactions you have authorized.</p>
    <p><strong>Taxes.</strong> Unless otherwise stated, our charges may include VAT (where applicable) but exclude other taxes, levies, duties, or similar governmental assessments (e.g., sales/use/consumption or withholding taxes) that may be imposed by any local, state, provincial, national, or foreign jurisdiction. We will add or invoice such taxes where we believe we have a legal obligation to do so.</p>
    <p><strong>Payment Processing.</strong> Payments of the Consideration are processed via certain online payment service providers, such as Stripe, SolidGate, PayPal, or others (collectively, "Online Payment Processors"). We may add or change Online Payment Processors at our sole discretion. The Online Payment Processors enable you to pay securely online using a credit card, debit card, bank account, or a supported wallet. We do not control and are not affiliated with such Online Payment Processors; they are independent contractors and are not our agents or employees. Your use of Online Payment Processors is at your own risk and is subject to their terms. This Section does not limit any rights you may have under applicable law.</p>
    <p><strong>Currency & Bank Fees.</strong> Charges are shown at checkout in the currency indicated there. Your bank or payment provider may apply foreign exchange rates, fees, or holds that we do not control.</p>

    <h2>7. Billing & Cancellation</h2>
    <h3>7.1 Billing Cycles & Renewal</h3>
    <p>Subscription-based services (including IQBooster) auto-renew at the end of each billing cycle—monthly or every 4 weeks—until canceled. Your active plan, billing interval, and next charge date are shown at checkout and/or in your Account.</p>
    <h3>7.2 Trials & Promotional Periods</h3>
    <p>Some plans may begin with a trial (e.g., 7 days) or promotional period. Unless you cancel before the trial or promotional period ends, the plan automatically converts to a paid subscription at the standard rate and cadence disclosed at checkout, and recurring charges apply until canceled.</p>
    <h3>7.3 How to Cancel</h3>
    <p>You may <strong>cancel at any time</strong> using either method below:</p>
    <ul>
      <li><strong>Self-serve:</strong> IQBooster → Settings → Billing → Cancel.</li>
      <li><strong>Support:</strong> email <a href="mailto:info@16types.ai">info@16types.ai</a> or <a href="mailto:info@iqbooster.org">info@iqbooster.org</a> from the address linked to your Account.</li>
    </ul>
    <h3>7.4 Effective Date of Cancellation</h3>
    <p>Cancellation is effective at the end of the then-current billing cycle. You will retain access through that date. Cancellation stops future auto-renewals; it does not backdate or shorten the current cycle.</p>
    <h3>7.5 Plan & Price Changes</h3>
    <p>We may change plans, features, cadence, or pricing prospectively. If a change affects your active subscription, we will notify you in advance using the contact details on your Account. If you do not agree to the change, you may cancel before it takes effect; continued use after the effective date constitutes acceptance.</p>
    <h3>7.6 Failed Payments</h3>
    <p>If a charge cannot be processed, we may retry, ask you to update your payment method, and suspend or limit access until payment is completed. Where supported by your network, you authorize us to use card account updater services to obtain updated card details to complete authorized transactions.</p>
    <h3>7.7 Invoices & Billing Information</h3>
    <p>You can view invoices/receipts and update payment details in your Account. Billing descriptors appear as stated in <strong>Section 5.7 (Legal Notice)</strong>.</p>

    <h2>8. Payments & Refunds</h2>
    <h3>8.1 Payment Authorization</h3>
    <p>You may purchase certain features of the Service for a fee ("Purchase"). By completing a Purchase (including starting a trial that converts to paid or enrolling in a recurring plan), you authorize us to charge the applicable fees, taxes, and any disclosed charges to the payment method you provide, on a one-time or recurring basis as described at checkout and in Section 7 (Billing & Cancellation). Billing descriptors appear as stated in Section 5.7 (Legal Notice).</p>
    <h3>8.2 General Refund Rule</h3>
    <p>To the fullest extent permitted by applicable law, Purchases made via the Website are non-refundable and non-exchangeable once the digital content has been delivered or made available (e.g., personality results, certificate, detailed report, or access to IQBooster), unless otherwise specified in these Terms or required by law. We do not provide pro-rata refunds for subscription periods already in progress (see Section 7 for cancellation timing).</p>
    <h3>8.3 Country/Region-Specific Rights</h3>
    <p>The foregoing does not limit any mandatory rights you may have under local law. Without limitation:</p>
    <ul>
      <li><strong>Japan (Consumer Contract Act; APPI).</strong> One-time digital items are <strong>non-refundable once delivered</strong>, <strong>unless required by law</strong> (e.g., verified defect or failure to provide access). For <strong>subscriptions</strong>, users may request a <strong>refund/cancellation within eight (8) days</strong> of purchase <strong>if the service has not been used/accessed</strong>. If access was provided/used, refunds for subscriptions are generally available <strong>only</strong> where the service was <strong>defective</strong> or <strong>access not properly provided</strong>, subject to applicable law and these Terms.</li>
      <li><strong>South Korea</strong> (Act on the Consumer Protection in Electronic Commerce). One-time digital items are non-refundable once delivered, unless required by law (e.g., verified defect or failure to provide access). For subscriptions, users may cancel within seven (7) days of the transaction unless the service has been accessed. If digital content has been provided/accessed, subscription refunds may not be available unless the service was defective or unavailable.</li>
      <li><strong>European Union</strong> (Consumer Rights Directive). One-time digital items are non-refundable once delivered or made available if you expressly consented to immediate performance and acknowledged losing the right of withdrawal upon delivery (which is obtained at checkout); this does not affect your rights where required by law (e.g., non-delivery/defect). For subscriptions, EU residents have a 14-day right to withdraw from the service agreement unless the service has been fully performed during that period with your express request/consent; where you withdraw, we may deduct an amount proportionate to the service provided up to the time of withdrawal, as permitted by law.</li>
      <li><strong>United States.</strong> Fees for digital items (e.g., personality results, certificates, detailed reports) and subscription periods already elapsed are non-refundable, unless required by law (for example, where the service was not delivered after successful payment, or in case of a duplicate/erroneous charge that we verify). Cancellation stops future renewals and does not trigger a refund for the current cycle (see Section 7).</li>
    </ul>
    <h3>8.4 Chargebacks & Disputes</h3>
    <p>If you initiate a chargeback, we may suspend or terminate access to the Service pending resolution. We reserve the right to provide transaction records and delivery logs to your payment provider to demonstrate authorization and delivery. This does not limit any rights you may have under applicable law.</p>

    <h2>9. Use Restrictions</h2>
    <p>There are certain conducts which are strictly prohibited when using the Site and the Service. Please read the following restrictions carefully. Failure to comply with any of the provisions set forth herein may result (at the Company's sole discretion) in suspension or termination of your access to the Site, the Tests, and/or the Content, and may expose you to civil and/or criminal liability.</p>
    <p>Unless otherwise explicitly permitted under these Terms or in writing by the Company, you may not:</p>
    <ol>
      <li><strong>Unlawful or Unauthorized Use.</strong> Use the Site and/or Content for any illegal, immoral, unlawful, or unauthorized purpose, or in violation of Applicable Law.</li>
      <li><strong>Commercial Exploitation.</strong> Use the Site and/or Content for non-personal or commercial purposes, including resale, sublicensing, renting, leasing, or time-sharing of the Service, Digital Items, or access credentials.</li>
      <li><strong>Account Abuse.</strong> Share, transfer, sell, or otherwise permit any third party to use your Account or credentials; create multiple Accounts to circumvent usage limits, trials, or payment obligations.</li>
      <li><strong>Circumvention.</strong> Bypass, disable, or interfere with any security feature, access control, paywall, rate limit, or content protection used by the Site or the Service.</li>
      <li><strong>Scraping/Automation.</strong> Access or use the Service through any robot, spider, crawler, scraper, script, or other automated means (including data mining, harvesting, or extraction) without our prior written consent.</li>
      <li><strong>Reverse Engineering.</strong> Copy, modify, reverse engineer, decompile, adapt, translate, or create derivative works of any part of the Site, the Tests, or the Content, except as expressly permitted by law that cannot be contractually waived.</li>
      <li><strong>Interference/Disruption.</strong> Interfere with or disrupt the operation of the Site or the servers or networks that host the Site; take any action that imposes, or may impose, an unreasonable or disproportionately large load on our infrastructure.</li>
      <li><strong>Malicious Code.</strong> Upload, transmit, or distribute any viruses, worms, Trojan horses, spyware, time bombs, or other harmful or malicious code.</li>
      <li><strong>False Representations.</strong> Present false or misleading information about the Service, or misrepresent your identity or affiliation with any person or entity.</li>
      <li><strong>Infringement/Unlawful Content.</strong> Upload, post, or transmit any content that infringes or violates intellectual-property, privacy, publicity, or other rights of any third party, or that is unlawful, harassing, defamatory, obscene, or otherwise objectionable.</li>
      <li><strong>Removal of Notices.</strong> Remove, alter, or obscure any proprietary notices, labels, watermarks, or attributions appearing on or in the Content or the Service.</li>
      <li><strong>Test Integrity.</strong> Engage in any activity intended to manipulate or distort test administration or results (including coordinated answer sharing, use of automated solving tools, or other forms of cheating).</li>
      <li><strong>Fraud/Payments Abuse.</strong> Engage in fraud, payment abuse, or improper chargeback activity (including disputed transactions you authorized or received delivery for).</li>
      <li><strong>Use Inconsistent with License.</strong> Use any Digital Items (including personality results, certificates, or reports) beyond the personal, non-commercial license granted in these Terms.</li>
    </ol>

    <h2>10. Intellectual Property</h2>
    <h3>10.1 Ownership</h3>
    <p>The Site, the Tests, the Service, and all content and materials made available through them—including without limitation text, graphics, images, audio/video, designs, layouts, software, code, algorithms, question banks, scoring logic, datasets, and other works (collectively, the "<strong>Content</strong>")—together with all associated inventions, research, know-how, trademarks, trade names, service marks, domain names, logos, and trade secrets (collectively, "<strong>Proprietary Assets</strong>") are owned by and/or licensed to the Company and are protected by applicable intellectual-property and other laws. <strong>All rights not expressly granted are reserved.</strong></p>
    <h3>10.2 Limited License to You</h3>
    <p>Subject to these Terms, we grant you a personal, limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use the Service and the Content for your own, non-commercial purposes. This license does not include any right to: (a) reproduce, distribute, publicly display, or publicly perform the Content except as expressly permitted; (b) modify, adapt, translate, create derivative works of, reverse engineer, decompile, or attempt to extract source code or underlying data sets, except to the extent such restrictions are prohibited by Applicable Law; (c) circumvent any access control, security, or usage limitation; or (d) use the Service or Content for competitive analysis or to build a competing product or service.</p>
    <h3>10.3 Digital Items</h3>
    <p>Digital Items (e.g., personality type result, certificates, detailed reports) are licensed, not sold. You may download and retain copies for your personal, non-commercial use in accordance with this Section. You may not remove or alter proprietary notices, watermarks, or attributions.</p>
    <h3>10.4 Trademarks</h3>
    <p>"16types," "IQBooster," our logos, and any other Company marks used in connection with the Service (collectively, <strong>"Company Marks"</strong>) are trademarks or trade names of the Company, whether or not registered. All other trademarks, service marks, trade names, and logos appearing on the Service are the property of their respective owners ("<strong>Third-Party Marks</strong>"). No right, license, or interest in the Company Marks or Third-Party Marks is granted by these Terms, and you agree not to use any such marks without prior written permission from the applicable owner.</p>
    <h3>10.5 User Content</h3>
    <p>If the Service allows you to submit, upload, or transmit content ("User Content"), you retain your rights in such User Content. You grant the Company a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to host, store, reproduce, modify (for formatting/display), and display your User Content solely to operate, provide, and improve the Service. You represent and warrant that you have all rights necessary to grant this license and that your User Content does not infringe any third-party rights or violate Applicable Law. We may remove or disable access to User Content that we reasonably believe violates these Terms.</p>
    <h3>10.6 Feedback</h3>
    <p>If you provide ideas, suggestions, or feedback regarding the Service ("Feedback"), you acknowledge that the Company may use and exploit such Feedback without restriction or obligation to you.</p>
    <h3>10.7 Reservation of Rights</h3>
    <p>Except for the limited license expressly granted in Section 10.2 (and any end-user license terms presented for specific Digital Items), no rights are granted to you—by implication, estoppel, or otherwise—under any intellectual-property rights owned or controlled by the Company or its licensors.</p>

    <h2>11. Disclaimers</h2>
    <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SITE, THE TESTS, THE SERVICE, AND ALL CONTENT (INCLUDING DIGITAL ITEMS SUCH AS PERSONALITY RESULTS, CERTIFICATES, AND DETAILED REPORTS) ARE PROVIDED "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS." THE COMPANY, ITS AFFILIATES, LICENSORS, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND SUPPLIERS DISCLAIM ALL WARRANTIES OF ANY KIND—EXPRESS, IMPLIED, OR STATUTORY—INCLUDING WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.</p>
    <p>WITHOUT LIMITING THE FOREGOING, WE DO NOT WARRANT THAT: (A) THE SERVICE OR CONTENT WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS; (B) THE RESULTS OBTAINED FROM USE OF THE TESTS OR IQBOOSTER WILL BE ACCURATE, RELIABLE, OR MEET YOUR EXPECTATIONS; OR (C) DEFECTS WILL BE CORRECTED. NO ADVICE OR INFORMATION (WHETHER ORAL OR WRITTEN) OBTAINED FROM US CREATES ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.</p>
    <p>EDUCATIONAL/ENTERTAINMENT ONLY—NO PROFESSIONAL ADVICE. THE TESTS, RESULTS, CERTIFICATES, REPORTS, AND IQBOOSTER ARE NOT A MEDICAL, CLINICAL, OR PSYCHOLOGICAL DIAGNOSIS OR TREATMENT AND DO NOT SUBSTITUTE FOR PROFESSIONAL ADVICE. ANY RELIANCE IS AT YOUR OWN RISK. IF YOU REQUIRE PROFESSIONAL ADVICE, PLEASE CONSULT A QUALIFIED PROFESSIONAL.</p>
    <p>THIRD-PARTY SERVICES. WE ARE NOT RESPONSIBLE FOR, AND MAKE NO WARRANTIES REGARDING, THIRD-PARTY SERVICES (INCLUDING PAYMENT PROCESSORS, NETWORKS, OR PLATFORMS) EVEN IF ACCESSED OR USED IN CONNECTION WITH THE SERVICE.</p>
    <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU. IN SUCH CASES, THE EXCLUSIONS APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.</p>

    <h2>12. Limitation of Liability</h2>
    <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY OR ITS AFFILIATES, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, LICENSORS, OR CONTRACTORS (COLLECTIVELY, "COMPANY REPRESENTATIVES") BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, UNDER ANY THEORY OF LIABILITY (INCLUDING CONTRACT, TORT—NEGLIGENCE INCLUDED—STRICT LIABILITY, OR OTHERWISE), INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, BUSINESS INTERRUPTION, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH: (A) YOUR ACCESS TO OR USE OF, OR INABILITY TO ACCESS OR USE, THE SITE, THE TESTS, THE SERVICE, OR ANY CONTENT OR DIGITAL ITEMS; (B) ANY CONDUCT OR CONTENT OF OTHER USERS OR THIRD PARTIES; (C) ANY THIRD-PARTY SERVICES (INCLUDING PAYMENT PROCESSORS); OR (D) THESE TERMS.</p>
    <p>WITHOUT LIMITING THE FOREGOING, AND TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL AGGREGATE LIABILITY OF THE COMPANY AND COMPANY REPRESENTATIVES FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE GREATER OF: (I) THE AMOUNTS YOU ACTUALLY PAID TO THE COMPANY FOR THE SERVICE GIVING RISE TO THE CLAIM IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY; OR (II) USD 1.00.</p>
    <p>THE LIMITATIONS AND EXCLUSIONS IN THIS SECTION APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE AND WHETHER OR NOT THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
    <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CERTAIN DAMAGES. IN SUCH JURISDICTIONS, THE COMPANY'S LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW. NOTHING IN THESE TERMS SHALL EXCLUDE OR LIMIT LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW (FOR EXAMPLE, LIABILITY FOR FRAUD, WILLFUL MISCONDUCT, OR, WHERE SUCH LIMITATION IS NOT PERMITTED, DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE).</p>
    <p>THE PARTIES AGREE THAT THE LIMITATIONS IN THIS SECTION ARE A FUNDAMENTAL BASIS OF THE BARGAIN AND ALLOCATION OF RISK BETWEEN THE PARTIES IN CONNECTION WITH THE SERVICE.</p>

    <h2>13. Indemnification</h2>
    <p>You agree to defend, indemnify, and hold harmless the Company and its affiliates, officers, directors, employees, agents, licensors, and contractors (collectively, "Company Parties") from and against any and all claims, demands, actions, investigations, losses, liabilities, damages, judgments, fines, penalties, costs, and expenses (including reasonable attorneys' fees and costs) arising out of or relating to:</p>
    <p>(i) your use or misuse of the Site, the Tests, the Service, or any Content or Digital Items;</p>
    <p>(ii) your breach of these Terms or of any applicable law or regulation;</p>
    <p>(iii) your infringement, misappropriation, or violation of any intellectual-property, privacy, publicity, or other rights of any third party;</p>
    <p>(iv) any User Content you submit, upload, or transmit through the Service; and/or</p>
    <p>(v) any fraud, payment/chargeback abuse, or other wrongful act or omission by you.</p>
    <p><strong>Procedure.</strong> The Company will provide you with prompt written notice of any claim for which indemnity is sought (provided that failure to give prompt notice will not relieve you of your obligations except to the extent materially prejudiced). The Company will have the right (but not the obligation) to participate in the defense with counsel of its choice, and you will not settle any claim without the Company's prior written consent if such settlement (a) imposes any obligation on a Company Party, (b) admits fault or wrongdoing on behalf of a Company Party, or (c) fails to include a full, unconditional release of the Company Parties. Subject to the foregoing, you will control the defense of the claim with qualified counsel reasonably acceptable to the Company and will cooperate with the Company Parties in good faith.</p>
    <p><strong>Exclusions.</strong> Your indemnity obligations do not apply to the extent a claim results from the Company's willful misconduct or fraud. Nothing in this Section limits any other remedies available to the Company Parties.</p>

    <h2>14. Dispute Resolution</h2>
    <h3>14.1 Informal Resolution Requirement</h3>
    <p>Before initiating formal proceedings, you agree to first attempt to resolve any dispute, claim, or controversy arising out of or relating to these Terms or the Service (a "Dispute") through <strong>good-faith negotiations</strong>. Please email <a href="mailto:info@16types.ai">info@16types.ai</a> with the subject line "Notice of Dispute," and include your name, the email associated with your Account, a description of the Dispute, and the specific relief sought. If the Dispute is not resolved within <strong>60 days</strong> after our receipt of your Notice of Dispute, either party may proceed as set out below.</p>
    <h3>14.2 U.S. Arbitration (if you reside in the United States or bring a claim in the United States)</h3>
    <p>Except for the matters described in Sections <strong>14.4</strong> and <strong>14.5</strong>, any Dispute will be resolved by <strong>binding, individual arbitration</strong> administered by the American Arbitration Association ("AAA") under its <strong>Consumer Arbitration Rules</strong> then in effect. The <strong>arbitrator</strong> may award all remedies available in court, subject to these Terms.</p>
    <ul>
      <li><strong>Governing law.</strong> This arbitration agreement and any arbitration will be <strong>governed by the laws of the State of Delaware</strong>, without regard to conflict-of-laws rules, <strong>except</strong> that the Federal Arbitration Act (FAA) governs the interpretation and enforceability of this Section to the extent it would otherwise apply.</li>
      <li><strong>Location & format.</strong> Hearings may be conducted <strong>by video conference</strong> or, if an in-person hearing is held, in <strong>New Castle County, Delaware</strong>, unless we agree otherwise.</li>
      <li><strong>Fees.</strong> AAA rules govern payment of filing, administrative, and arbitrator fees. Where required by the AAA Consumer Rules or applicable law, we will <strong>pay or reimburse</strong> fees to ensure the arbitration remains <strong>cost-effective</strong> for consumers.</li>
      <li><strong>Class/representative action waiver.</strong> To the fullest extent permitted by law, claims must be brought in an <strong>individual capacity only</strong>, not as a class, collective, consolidated, or representative action. The arbitrator may not consolidate claims of more than one person or preside over any class or representative proceeding.</li>
      <li><strong>Small-claims option.</strong> Either party may bring an eligible claim in <strong>small-claims court</strong> in New Castle County, Delaware, or in your county of residence, rather than in arbitration.</li>
      <li><strong>30-day opt-out.</strong> You may <strong>opt out</strong> of this arbitration agreement by emailing <a href="mailto:info@16types.ai">info@16types.ai</a> with the subject "Arbitration Opt-Out" <strong>within 30 days</strong> of the date you first accepted these Terms. Include your name and the email associated with your Account. If you opt out, <strong>Section 14.2</strong> will not apply, but the rest of this Section 14 remains in effect.</li>
    </ul>
    <h3>14.3 Non-U.S. Disputes</h3>
    <p>If you do not reside in the United States and do not bring a claim in the United States, then — subject to any non-waivable consumer rights under the law of your country of residence — these Terms are governed by the laws of Cyprus, and any Dispute shall be brought in the courts of Larnaca, Cyprus. You and the Company consent to that jurisdiction and venue and waive objections based on inconvenient forum, to the extent permitted by applicable law.</p>
    <h3>14.4 Injunctive Relief; IP Protection; Public Injunctive Relief</h3>
    <p>Nothing in this Section limits either party's ability to seek temporary or preliminary injunctive relief in a court of competent jurisdiction to protect intellectual-property or proprietary rights, or to seek public injunctive relief where such a right cannot be waived under applicable law.</p>
    <h3>14.5 Severability</h3>
    <p>If any part of this Section 14 is found unenforceable, the remainder shall remain in effect. If the class/representative action waiver is found unenforceable as to a particular claim, then the arbitration agreement in Section 14.2 will not apply to that claim, and such claim must be brought in court, but the class/representative action waiver will continue to apply to the maximum extent permitted for all other claims. The parties agree that the limitations in this Section are fundamental to their agreement to resolve Disputes.</p>

    <h2>15. Governing Law; Venue</h2>
    <h3>15.1 Non-U.S. Users / Claims Outside the U.S.</h3>
    <p>Except as provided in Section 14, these Terms and any non-arbitrable dispute or claim arising out of or relating to them are governed by the laws of Cyprus, without regard to conflict-of-laws rules, and shall be brought exclusively in the courts of Larnaca, Cyprus. The parties consent to such jurisdiction and venue to the extent permitted by applicable law.</p>
    <h3>15.2 U.S. Users / Claims in the U.S.</h3>
    <p>For users who <strong>reside in the United States</strong> or bring a claim in the United States: (a) the <strong>arbitration agreement and any arbitration</strong> are governed by the <strong>laws of the State of Delaware</strong> (except that the <strong>Federal Arbitration Act</strong> governs the interpretation and enforceability of the arbitration agreement to the extent it would otherwise apply); and (b) any <strong>non-arbitrable</strong> dispute or claim shall be brought exclusively in the <strong>state or federal courts located in New Castle County, Delaware</strong>, and the parties consent to such jurisdiction and venue.</p>
    <h3>15.3 Consumer-Law Safeguard</h3>
    <p>Nothing in these Terms limits any <strong>non-waivable consumer rights</strong> you may have under the mandatory laws of your place of residence.</p>

    <h2>16. Amendments to the Terms</h2>
    <p>We may, at our sole discretion, <strong>modify or update</strong> these Terms (including policies incorporated by reference) from time to time. Please <strong>revisit this page periodically</strong>.</p>
    <p><strong>Material changes.</strong> If we make a material change, we will make reasonable efforts to provide notice—for example, by posting a clear notice on the Site and/or sending an email to the address associated with your Account (if available). Material changes take effect seven (7) days after such notice is posted or sent (whichever is earlier), unless a longer period is stated in the notice or required by law.</p>
    <p><strong>Other changes.</strong> All other changes are effective as of the "Last Revised" date indicated at the top of these Terms. Your continued access or use of the Service on or after the effective date constitutes acceptance of the updated Terms.</p>
    <p><strong>Subscription-impacting changes.</strong> If a change affects your active subscription (for example, changes to price, billing cadence, or cancellation method), we will provide notice in accordance with Section 7 (Billing & Cancellation). If you do not agree to the change, you may cancel before it takes effect; cancellation stops future renewals (see Section 7).</p>
    <p><strong>If you do not agree.</strong> If you do not agree to the updated Terms, stop using the Service and, if applicable, cancel your subscription before the effective date of the change.</p>
    <p><strong>Legal or urgent updates.</strong> Changes made to address legal, regulatory, security, or operational requirements may take effect immediately to the extent permitted by law.</p>
    <p>Nothing in this Section limits any non-waivable rights you may have under applicable law, and changes do not apply retroactively to disputes that arose before the effective date of the updated Terms.</p>

    <h2>17. Termination; Changes to the Service</h2>
    <p>We may, at our sole discretion and subject to Applicable Law, <strong>suspend or terminate</strong> your access to the Service (in whole or in part) at any time, including where we reasonably believe you have breached these Terms, engaged in fraud or abuse, or where required by law or a competent authority. Where legally permitted, we will provide notice of the reason for suspension or termination.</p>
    <p>We may also <strong>modify, suspend, or discontinue</strong> the Service or any feature, content, or offering, <strong>temporarily or permanently</strong>. If we permanently discontinue the Service (or an applicable paid feature) prior to the end of your <strong>prepaid subscription period</strong>, we will provide a <strong>pro-rata refund</strong> of prepaid fees for the remaining period, unless otherwise required by law or addressed elsewhere in these Terms.</p>
    <p>Upon termination, your right to use the Service ceases immediately. Sections that by their nature should survive (including <strong>Intellectual Property</strong>, <strong>Disclaimers</strong>, <strong>Limitation of Liability</strong>, <strong>Indemnification, Dispute Resolution, Governing Law; Venue, Payments & Refunds (to the extent applicable), and Miscellaneous) will survive termination.</strong> Data handling after termination is described in our <strong>Privacy Policy</strong>.</p>

    <h2>18. Miscellaneous</h2>
    <p><strong>Entire Agreement.</strong> These Terms (including documents incorporated by reference, such as the Privacy Policy) constitute the entire agreement between you and the Company regarding the Service and supersede prior or contemporaneous understandings on that subject.</p>
    <p><strong>Relationship.</strong> Nothing in these Terms creates a partnership, joint venture, employment, agency, or franchisor-franchisee relationship.</p>
    <p><strong>No Waiver.</strong> A failure to enforce any provision will not be a waiver of that or any other provision.</p>
    <p><strong>Severability.</strong> If any provision is found unenforceable, it will be limited or eliminated to the minimum extent necessary, and the remainder will stay in effect.</p>
    <p><strong>Assignment.</strong> You may not assign or transfer these Terms (or any rights/obligations) without our prior written consent. We may assign these Terms without restriction (including in connection with a merger, acquisition, or sale of assets).</p>
    <p><strong>Time to Bring Claims.</strong> To avoid consumer-law conflicts in various jurisdictions, we do not apply a one-year universal limitation period to consumer claims. Any contractual limitation period will apply only to the extent permitted by Applicable Law.</p>
    <p><strong>Export/Compliance.</strong> You agree to comply with Applicable Law, including export, sanctions, and embargo laws that may govern your use of the Service.</p>
    <p><strong>Force Majeure.</strong> Neither party is liable for delay or failure to perform due to Force Majeure (as defined in Section 2), provided the affected party uses reasonable efforts to mitigate and provides notice where practicable.</p>
    <p><strong>Order of Precedence.</strong> If there is a conflict between these Terms and any policy referenced herein, these Terms control unless the referenced policy expressly states otherwise.</p>
    <p><strong>Language.</strong> If we provide a translated version of these Terms, the <strong>English version controls</strong> to the extent of any conflict, unless Applicable Law requires otherwise.</p>

    <h2>19. Electronic Signatures; Records</h2>
    <p>By clicking a button labeled "Get Access", "Continue to Payment", "Pay", "Confirm and Get Results", "Start 7-day Trial", "Start your journey" or any similar action presented at checkout or in the Service, you agree and intend to sign these Terms electronically and to enter into a legally binding agreement with the Company. Your click (and any related confirmations, including payment authorizations) constitutes your electronic signature and consent to receive and store records electronically.</p>
    <p>You agree to the use of electronic contracts, signatures, and records to the fullest extent permitted by Applicable Law, including the U.S. Electronic Signatures in Global and National Commerce Act (ESIGN), the EU eIDAS Regulation, Japan's Act on Electronic Signatures and Certification Business, and South Korea's Framework Act on Electronic Documents and Transactions (and similar laws worldwide). You waive any requirement for an original (non-electronic) signature or non-digital delivery/retention of records, to the extent permitted by law. We may provide copies of these Terms and transaction records electronically (e.g., via your Account or email).</p>

    <h2>20. Notices; Contact Information</h2>
    <h3>20.1 General inquiries</h3>
    <p>If you have questions about the Service or these Terms, please contact <a href="mailto:info@16types.ai">info@16types.ai</a> or <a href="mailto:info@iqbooster.org">info@iqbooster.org</a>.</p>
    <h3>20.2 Legal notices</h3>
    <p>Formal notices (including notices of dispute under <strong>Section 14</strong>) must be sent to <a href="mailto:info@16types.ai">info@16types.ai</a> and to our mailing address below. Please include your full name, the email associated with your Account, and a clear description of the matter.</p>
    <h3>20.3 Our mailing address</h3>
    <p><strong>Maxiq Limited</strong><br />Markou Drakou 2A<br />Livadia 7060, Larnaca<br />Cyprus</p>
    <h3>20.4 How notices are given; deemed receipt</h3>
    <ul>
      <li>We may provide notices to you by <strong>email</strong> (to the address associated with your Account), by <strong>posting</strong> within the Service or on our website, or by <strong>mail</strong>.</li>
      <li>You agree that <strong>email</strong> satisfies any legal requirement for written notice, to the extent permitted by Applicable Law.</li>
      <li>A notice is deemed <strong>given</strong>: (i) when sent by email (if sent during normal business hours in the recipient's location, otherwise on the next business day); (ii) when posted in the Service or on our website; or (iii) three (3) business days after mailing by registered or certified mail, return receipt requested.</li>
    </ul>
    <h3>20.5 Changes to contact details</h3>
    <p>We may update our contact details and mailing address by posting an updated version of this Section. Your obligation to keep your own contact information current is described in <strong>Section 3 (Eligibility & User Accounts)</strong>.</p>

    <p className="text-sm text-muted-foreground/60 mt-10"><strong>Last Revised: 06.05.2026</strong></p>
    <p className="text-xs text-muted-foreground/70 italic">* Our content is offered in multiple languages through a combination of human and AI-assisted translation. While we make every effort to ensure accuracy, the English version is the official and legally binding text.</p>
  </div>
);

const TermsJa = () => (
  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2">
    <h2>1. はじめに;契約の成立</h2>
    <p>本利用規約(以下「本規約」)は、登録住所をMarkou Drakou, 2A, Livadia 7060, Larnaca, Cyprusに置くMaxiq Limited(以下「当社」)が運営するウェブサイト(<strong>16types.ai</strong>およびそのサブドメインならびに関連サイト・サービスを含み、以下総称して「本ウェブサイト」または「本サービス」)のご利用を規定します。本サービスには、有料の性格診断結果および<strong>IQBooster</strong>脳トレーニングサブスクリプションへのアクセスが含まれます。</p>
    <p>本サービスにアクセスまたは利用することにより、お客様は本規約および<a href="/ja/privacy-policy">プライバシーポリシー</a>(<a href="/ja/privacy-policy">https://16types.ai/privacy-policy</a>)を読み理解したことを認め、これらに拘束されること、および本サービスの利用に関連するすべての適用法令を遵守することに同意するものとします。本規約は、お客様と当社との間の拘束力ある法的契約を構成します。本規約に同意しない場合は、本サービスにアクセスまたは利用しないでください。</p>
    <p>本規約は、参照により組み込まれるすべての方針および通知(プライバシーポリシーを含む)を組み込み、本サービスを通じて提供されるすべての機能、コンテンツ、機能性に適用されます。以下の特定のセクションは、お客様の所在地または特定機能の使用に基づき追加の要件または情報を提供する場合があります。本規約のいかなる規定も、適用法令に基づきお客様が有する放棄不能な権利を制限するものではありません。</p>

    <h2>2. 定義</h2>
    <p>参照の便宜のため、以下の用語は次の意味を有します。その他の大文字で始まる用語は、初出箇所において定義されます。</p>
    <ul>
      <li><strong>「当社」</strong>:本規約に記載される本サービスを運営する、キプロス法に基づき設立されたMaxiq Limitedを意味します。</li>
      <li><strong>「本ウェブサイト」</strong>:<strong>16types.ai</strong>およびそのサブドメインならびに当社が運営する関連サイトを意味します。</li>
      <li><strong>「本サービス」</strong>:本ウェブサイトおよびそれを通じて提供されるすべての機能、コンテンツ、製品、サービス(有料の性格診断結果および<strong>IQBooster</strong>脳トレーニングサブスクリプションへのアクセスを含む)を意味します。</li>
      <li><strong>「16types」</strong>:本サービスを通じて提供されるオンライン性格診断を意味します。</li>
      <li><strong>「IQBooster」</strong>:継続的サブスクリプションとして提供される場合がある当社の脳トレーニングサービスを意味します。</li>
      <li><strong>「ユーザー」「お客様」</strong>:本サービスにアクセスまたは利用する個人を意味します。</li>
      <li><strong>「アカウント」</strong>:本サービスの一部にアクセスするために作成された登録ユーザーアカウントを意味します。</li>
      <li><strong>「コンテンツ」</strong>:本サービスを通じて提供されるテキスト、画像、グラフィック、音声、動画、データ、証明書、レポートその他の素材(該当する場合はユーザー提供コンテンツを含む)を意味します。</li>
      <li><strong>「デジタル商品」</strong>:本サービスを通じて提供される一括払いデジタル成果物(性格診断結果、性格証明書、詳細レポート等のアドオン)を意味します。</li>
      <li><strong>「注文」</strong>:デジタル商品の一括払い購入を意味します。</li>
      <li><strong>「サブスクリプション」</strong>:IQBoosterまたはその他の継続的機能への一定期間のアクセスを提供する自動更新の有料プランを意味します。</li>
      <li><strong>「トライアル」</strong>:本規約に従い解約されない限り有料サブスクリプションへ自動移行するサブスクリプションへの無料または販促アクセス期間を意味します。</li>
      <li><strong>「請求サイクル」</strong>:サブスクリプション料金が請求される反復間隔(例:4週間ごとまたは月次)を意味します。</li>
      <li><strong>「更新」</strong>:本規約に従い解約されない限り、サブスクリプションが次の請求サイクルへ自動継続することを意味します。</li>
      <li><strong>「解約」</strong>:本規約に別段の定めがある場合を除き、現在の請求サイクル終了時点で効力を生じるサブスクリプション終了のためのユーザー行為を意味します。</li>
      <li><strong>「支払方法」</strong>:注文およびサブスクリプションの支払いのためにお客様が当社に提供する有効な支払手段(クレジット/デビットカード等)を意味します。</li>
      <li><strong>「料金」</strong>:注文、サブスクリプション、税金、およびチェックアウトまたは本サービスにて開示される適用手数料を意味します。</li>
      <li><strong>「第三者サービス」</strong>:当社が所有または管理せず、本サービスと連携または併用される可能性のあるウェブサイト、アプリ、決済処理事業者その他のサービスを意味します。</li>
      <li><strong>「プライバシーポリシー」</strong>:<a href="/ja/privacy-policy">https://16types.ai/privacy-policy</a> にて提供される当社のプライバシー通知(随時更新)を意味します。</li>
      <li><strong>「適用法令」</strong>:お客様の所在地および契約地に基づき本サービスの利用に適用される強行法規を意味します。</li>
      <li><strong>「通知」</strong>:「通知;連絡先情報」セクションに従って提供される本サービスまたは本規約に関する正式な連絡を意味します。</li>
      <li><strong>「不可抗力」</strong>:当事者の合理的な支配を超え、履行を妨げまたは遅延させる事象(天災、自然災害、流行病/パンデミック、戦争、テロ、内乱、労働争議、公益事業・通信・インターネットサービスの障害、サービス拒否攻撃、政府の措置、法令変更等)を意味します。</li>
    </ul>

    <h2>3. 利用資格・ユーザーアカウント</h2>
    <h3>3.1 利用資格</h3>
    <p>本サービスは、<strong>(a) 18歳以上(現地法でより高い年齢が要求される場合はその年齢以上)、かつ (b) 本規約を締結する法的能力を有する個人</strong>のみがご利用いただけます。本サービスを利用することにより、お客様はこれらの要件を満たすこと、および適用法令により禁止されていないことを表明し保証します。</p>
    <h3>3.2 アカウント登録</h3>
    <p>本サービスの一部の機能は登録が必要です。アカウント作成時には、正確で最新かつ完全な情報を提供し、これを更新する必要があります。当社は、登録情報が不正確、不完全、誤解を招く、または本規約違反であると合理的に判断した場合、アカウントを拒否、停止、終了することができます。</p>
    <h3>3.3 アカウントの利用とセキュリティ</h3>
    <p>お客様は、ご自身のアカウントで生じるすべての活動およびログイン認証情報の機密性とセキュリティ維持に責任を負います。アカウントや認証情報を共有、譲渡、販売しないでください。不正アクセスまたはセキュリティ侵害が疑われる場合は速やかに当社に通知することに同意します。当社は、お客様の通知前に発生した不正使用による損失について責任を負いません。</p>
    <h3>3.4 個人ごとに1アカウント</h3>
    <p>当社が書面で明示的に許可する場合を除き、各個人は個人利用のために1アカウントのみを保有できます。なりすまし、または制限(トライアル制限、支払義務の回避を含む)を回避するためのアカウント作成は禁止されます。</p>
    <h3>3.5 情報の正確性;更新</h3>
    <p>連絡先、請求情報その他のアカウント情報を正確かつ最新に保ち、変更時には速やかに更新することに同意します。当社は合理的に必要な場合(資格確認、不正防止、法令遵守等)、追加情報または検証を求めることがあります。</p>
    <h3>3.6 停止または終了の権利</h3>
    <p>当社は、お客様が本規約に違反した、不正または濫用行為に関与したと合理的に判断した場合、または法令もしくは管轄当局により要求された場合、本サービスへのアクセスを(全部または一部)停止または終了することができます。法律で許可される場合、停止または終了の理由を通知します。</p>
    <h3>3.7 第三者によるアクセス</h3>
    <p>第三者サービス(シングルサインオン提供者等)を通じて本サービスにアクセスする場合、お客様は当社がプライバシーポリシーに記載される情報を取得・使用することを承諾します。第三者サービスとの関係は専らお客様と当該第三者との契約により規律されます。</p>

    <h2>4. プライバシーとデータ保護</h2>
    <h3>4.1 一般</h3>
    <p>当社はお客様のプライバシーを尊重し、個人データを<a href="/ja/privacy-policy">プライバシーポリシー</a>に従って取り扱います。本サービスを利用することにより、お客様は個人データがプライバシーポリシーに記載されるとおり収集・処理されることを了承します。</p>
    <h3>4.2 地域別の遵守</h3>
    <p>当社は関連する法域のユーザーに適用されるデータ保護法を遵守します。これには以下が含まれます:</p>
    <ul>
      <li><strong>EU/EEA</strong>の一般データ保護規則(<strong>GDPR</strong>)、</li>
      <li><strong>米国</strong>の州プライバシー法(カリフォルニア州等)、</li>
      <li>日本の<strong>個人情報保護法(APPI)</strong>、</li>
      <li>韓国の<strong>個人情報保護法(PIPA)</strong>。</li>
    </ul>
    <p>処理の法的根拠、個人の権利と行使方法、国際データ移転(および適用される保護措置)、当社の連絡先詳細はプライバシーポリシーに記載されています。</p>
    <h3>4.3 第三者サービス・処理者</h3>
    <p>本サービスに関連して第三者プロバイダ(決済処理事業者、分析、ホスティング等)を利用する場合があります。これらのプロバイダおよびデータ処理方法はプライバシーポリシーに記載されています。</p>
    <h3>4.4 マーケティング通信と設定</h3>
    <p>マーケティング通信に関する選択肢(オプトアウト機構を含む)はプライバシーポリシーおよび当社からのメッセージに記載されています。法令で要求される場合は配信停止リンクが含まれます。</p>
    <h3>4.5 Cookieおよび類似技術</h3>
    <p>Cookieおよび類似技術の使用と設定管理方法はプライバシーポリシー(該当する場合はCookie通知)に記載されています。</p>
    <h3>4.6 年齢に関する通知</h3>
    <p>本サービスはセクション3に定めるとおり<strong>成人(18歳以上)</strong>を対象としています。当社は法律で禁止されている場合、お子様から意図的に個人データを収集することはありません。詳細はプライバシーポリシーをご覧ください。</p>

    <h2>5. 有料サービス;一括払いデジタル商品;サブスクリプション</h2>
    <p>本ウェブサイトは当社独自のオンライン性格診断(以下「本テスト」)へのアクセスを提供します。本テストの利用は無料で提供される場合がありますが、テスト完了後に以下を含む<strong>有料サービス</strong>(以下総称して「本有料サービス」)を提供することがあります:</p>
    <ul>
      <li><strong>性格タイプ結果</strong>、<strong>性格証明書</strong>、任意の<strong>詳細レポート</strong>(または同様のアドオン)などの<strong>一括払いデジタル商品</strong>;および</li>
      <li>当社のプレミアム脳トレーニングプランである<strong>IQBooster</strong>へのアクセス。これは定期アクセスまたは自動更新サブスクリプションとして提供される場合があります。</li>
    </ul>
    <p>当社は、本サイトを通じて提供されるあらゆるサービス(本テストを含む)について、当社の裁量でいつでも料金を請求する権利を留保します。</p>
    <h3>5.1 価格</h3>
    <p>現在の価格および適用される税金・手数料はチェックアウト時に表示され、本サイトの料金ページ(<a href="/pricing">https://16types.ai/pricing/</a>)にも表示される場合があります。任意の購入後オファー(詳細レポート等)の価格は、オファー提示時に開示されます。価格およびオファーはプランや販促により異なる場合があります。</p>
    <h3>5.2 一括払いデジタル商品</h3>
    <p>一括払いデジタル商品(性格タイプ結果、性格証明書、詳細レポート等)を購入した場合、配信は通常、画面上の確認および/またはお客様が提供するメールアドレスへのメール送信により電子的に行われます。一括払いデジタル商品は、本規約に従い個人的・非商業的利用のためにライセンスされます。</p>
    <h3>5.3 IQBoosterサブスクリプション</h3>
    <p>提供状況に応じて、IQBoosterは以下のいずれかの形態で提供される場合があります:</p>
    <ul>
      <li><strong>トライアルアクセス(7日間)</strong>:性格診断結果と証明書の一括購入に含まれる場合があります。トライアル終了前に解約しない限り、チェックアウト時に開示された頻度(例:4週間ごと)で有料サブスクリプションへ移行し、解約まで継続的に課金されます。</li>
      <li><strong>定期アクセス(一括料金)</strong>:定められた期間(例:3か月またはその他購入時に表示される期間)のアクセス。期間終了時に更新または再購入されない限りアクセスは終了します。</li>
      <li><strong>継続サブスクリプション</strong>:月次または4週間ごとに請求される自動更新プラン。解約しない限り各請求サイクル終了時に自動更新されます。</li>
      <li><strong>特定プランの割引トライアル</strong>:一部のサブスクリプションは割引または販促期間で開始される場合があります。販促期間終了前に解約しない限り、チェックアウト時に表示される標準料金と頻度で更新されます。</li>
    </ul>
    <p>具体的なプラン、請求間隔、次回請求日はチェックアウト時および/またはアカウントに表示されます。</p>
    <h3>5.4 継続課金とお客様の同意</h3>
    <p>チェックアウトでお客様が同意を提供する直前に、プラン、価格、請求頻度、トライアル終了/初回請求日、解約方法を表示します。有料に移行するトライアルを開始する、または継続サブスクリプションを購入することにより、お客様は当社に対し、解約まで開示された頻度および当時の料率で、提供された支払方法に対し継続的に課金することを承認します。サインアップの確認、および該当する場合はトライアルから有料への移行および以後の更新の確認を受け取ります。</p>
    <h3>5.5 解約方法</h3>
    <p>お客様は<strong>アカウント → お支払い → 解約</strong>(または本サービスで提供される解約経路)を通じていつでも<strong>解約</strong>できます。</p>
    <ul>
      <li><strong>トライアル</strong>:トライアル終了<strong>前に</strong>解約すると<strong>有料サブスクリプションは開始されず</strong>、継続課金は発生しません。</li>
      <li><strong>サブスクリプション</strong>:解約は<strong>現在の請求サイクル終了時</strong>に効力を生じます。それまでアクセスは保持されます。</li>
    </ul>
    <h3>5.6 任意の購入後オファー</h3>
    <p>当社は、初回購入<strong>後</strong>に<strong>任意の</strong>アドオン(<strong>詳細レポート</strong>等)を提示する場合があります。価格と重要事項を明確に開示し、アドオンの課金前にお客様の<strong>明示的な同意</strong>を取得します。</p>
    <h3>5.7 法的通知</h3>
    <p><strong>IQBoosterは、<a href="https://16types.ai/">https://16types.ai/</a> で診断を完了したお客様のみにご利用いただけるプレミアムサービスです。請求は支払方法に応じて以下のように表示されます:</strong></p>
    <ul>
      <li><strong>カード決済(Visa/Mastercard等):「16types」</strong></li>
    </ul>
    <p><strong>重要な注意事項:</strong></p>
    <ol>
      <li>本サイトおよび本テストは<strong>娯楽目的のみ</strong>で提供され、専門的な診断、分析、相談には使用されるべきではありません。</li>
      <li>テスト結果は、各受験者の特性、テストの種類、外部要因(疲労等)により異なる場合があります。</li>
      <li>テスト結果(証明書を含む)への依拠は<strong>お客様ご自身の責任</strong>で行ってください。</li>
      <li>当社が発行する証明書は、該当するテストの完了のみを証明するものであり、<strong>標準化された専門的認証を構成するものではありません</strong>。</li>
    </ol>

    <h2>6. 対価</h2>
    <p>本サイトの一部の機能および本サイトを通じて提供される一部のサービスは、当社の裁量で随時本サイトに表示される料金(以下「対価」)の支払対象となる場合があります。料金変更は将来に向かってのみ適用されます。サブスクリプションの価格または請求頻度の変更は、セクション7(請求と解約)に従って通知され効力を生じます。対価をお支払いいただけない場合、または支払方法が無効・拒否され、当社の要請にもかかわらず速やかに支払情報を更新されない場合、当社は該当サービスへのアクセスを停止または取消すことができます。</p>
    <p><strong>税金</strong>:特に明記されない限り、当社の料金にはVAT(該当する場合)が含まれる場合がありますが、その他の税金、賦課金、関税(売上税、消費税、源泉徴収税等)は含まれません。法的義務があると考える場合、当社はそれらの税金を追加または請求します。</p>
    <p><strong>決済処理</strong>:対価のお支払いは、Stripe、SolidGate、PayPalその他の決済サービスプロバイダ(以下総称して「オンライン決済処理事業者」)を通じて処理されます。当社はオンライン決済処理事業者を当社の裁量で追加または変更することがあります。これらは独立した請負業者であり、当社の代理人または従業員ではありません。お客様によるオンライン決済処理事業者の利用はお客様自身の責任で行われ、各事業者の規約に従います。</p>
    <p><strong>通貨と銀行手数料</strong>:料金はチェックアウト時に表示される通貨で表示されます。お客様の銀行または決済プロバイダが、当社の管理外の外国為替レート、手数料、または保留を適用する場合があります。</p>

    <h2>7. 請求と解約</h2>
    <h3>7.1 請求サイクルと更新</h3>
    <p>サブスクリプションベースのサービス(IQBoosterを含む)は、解約されるまで各請求サイクル(月次または4週間ごと)終了時に自動更新されます。アクティブなプラン、請求間隔、次回請求日はチェックアウト時および/またはアカウントに表示されます。</p>
    <h3>7.2 トライアルおよび販促期間</h3>
    <p>一部のプランはトライアル(例:7日間)または販促期間で開始される場合があります。トライアルまたは販促期間終了前に解約しない限り、プランはチェックアウト時に開示された標準料金と頻度で有料サブスクリプションへ自動移行し、解約まで継続的に課金されます。</p>
    <h3>7.3 解約方法</h3>
    <p>以下のいずれかの方法で<strong>いつでも解約</strong>できます:</p>
    <ul>
      <li><strong>セルフサービス</strong>:IQBooster → 設定 → お支払い → 解約。</li>
      <li><strong>サポート</strong>:アカウントに紐付くアドレスから <a href="mailto:info@16types.ai">info@16types.ai</a> または <a href="mailto:info@iqbooster.org">info@iqbooster.org</a> へメール送信。</li>
    </ul>
    <h3>7.4 解約の効力発生日</h3>
    <p>解約は現在の請求サイクル終了時に効力を生じます。その日までアクセスは保持されます。解約は以後の自動更新を停止しますが、現在のサイクルを遡及的に短縮するものではありません。</p>
    <h3>7.5 プランと価格の変更</h3>
    <p>当社はプラン、機能、頻度、価格を将来に向かって変更することがあります。変更がアクティブなサブスクリプションに影響する場合、アカウント上の連絡先情報を用いて事前に通知します。変更に同意しない場合は、効力発生前に解約できます。効力発生日後の継続利用は受諾を構成します。</p>
    <h3>7.6 支払い失敗</h3>
    <p>請求が処理できない場合、再試行、支払方法の更新依頼、または支払完了までアクセスの停止・制限を行うことがあります。ネットワークが対応する場合、お客様は当社が承認済み取引を完了するためカードアカウントアップデーターサービスを使用することを承認します。</p>
    <h3>7.7 請求書と請求情報</h3>
    <p>請求書/領収書の閲覧および支払詳細の更新はアカウントで行えます。請求記述子は<strong>セクション5.7(法的通知)</strong>に記載のとおり表示されます。</p>

    <h2>8. お支払いと返金</h2>
    <h3>8.1 支払承認</h3>
    <p>本サービスの一部機能を有料で購入することができます(以下「購入」)。購入を完了する(有料に移行するトライアルの開始または継続プランへの登録を含む)ことにより、お客様は適用される料金、税金、開示された請求を、チェックアウトおよびセクション7(請求と解約)に記載のとおり一括または継続的に支払方法へ請求することを承認します。</p>
    <h3>8.2 一般的な返金規則</h3>
    <p>適用法令で認められる最大限において、本ウェブサイトを通じた購入は、デジタルコンテンツ(性格診断結果、証明書、詳細レポート、IQBoosterへのアクセス等)が配信または利用可能となった後は、本規約に別段の定めまたは法律で要求される場合を除き、返金・交換不可です。当社は進行中のサブスクリプション期間について按分返金を行いません(解約タイミングはセクション7参照)。</p>
    <h3>8.3 国・地域別の権利</h3>
    <p>上記は、現地法に基づきお客様が有する強行的権利を制限しません。限定なく:</p>
    <ul>
      <li><strong>日本(消費者契約法;個人情報保護法)</strong>:一括払いデジタル商品は、配信後、<strong>法律で要求される場合(検証された欠陥またはアクセス不提供等)を除き返金不可</strong>です。<strong>サブスクリプション</strong>については、<strong>サービスが未使用/未アクセスの場合</strong>、購入から<strong>8日以内</strong>に返金/解約を請求できます。アクセスが提供/使用された場合、サブスクリプションの返金は通常、サービスに<strong>欠陥</strong>があった、または<strong>アクセスが適切に提供されなかった</strong>場合にのみ、適用法令と本規約に従って利用可能です。</li>
      <li><strong>韓国</strong>(電子商取引における消費者保護に関する法律):一括払いデジタル商品は配信後、法律で要求される場合を除き返金不可です。サブスクリプションについては、サービスにアクセスされていない限り、取引から7日以内に解約できます。デジタルコンテンツが提供/アクセスされた場合、サービスに欠陥がある、または利用できない場合を除き、サブスクリプション返金は利用できない場合があります。</li>
      <li><strong>欧州連合</strong>(消費者権利指令):一括払いデジタル商品は、お客様が即時履行に明示的に同意し、配信時に撤回権を失うことを承認した場合(チェックアウト時に取得)、配信または利用可能となった後は返金不可です。これは法律で要求される権利(未配信/欠陥等)に影響しません。サブスクリプションについて、EU居住者は、当該期間中にお客様の明示的な要請/同意により完全に履行された場合を除き、サービス契約から14日間の撤回権を有します。撤回した場合、当社は法律で許可される範囲で、撤回時までに提供されたサービスに比例した金額を控除することがあります。</li>
      <li><strong>米国</strong>:デジタル商品(性格診断結果、証明書、詳細レポート等)および既に経過したサブスクリプション期間の料金は、法律で要求される場合(支払成功後にサービスが配信されなかった場合や、当社が確認する重複/誤請求の場合等)を除き返金不可です。解約は将来の更新を停止し、現在のサイクルの返金を発生させません(セクション7参照)。</li>
    </ul>
    <h3>8.4 チャージバックと紛争</h3>
    <p>お客様がチャージバックを開始した場合、当社は解決まで本サービスへのアクセスを停止または終了することがあります。当社は承認と配信を示すため、取引記録および配信ログを支払プロバイダに提供する権利を留保します。これは適用法令に基づくお客様の権利を制限しません。</p>

    <h2>9. 利用制限</h2>
    <p>本サイトおよび本サービスの利用にあたっては、厳格に禁止される行為があります。以下の制限を注意深くお読みください。本書に定める規定の不遵守は、(当社の単独の裁量で)本サイト、本テスト、および/またはコンテンツへのアクセスの停止または終了をもたらし、また民事および/または刑事責任を生じさせる場合があります。</p>
    <p>本規約または当社による書面で明示的に許可される場合を除き、以下の行為を行ってはなりません:</p>
    <ol>
      <li><strong>違法または無権限利用</strong>:違法、不道徳、無権限の目的、または適用法令違反のために本サイトおよび/またはコンテンツを利用すること。</li>
      <li><strong>商業的搾取</strong>:再販、サブライセンス、賃貸、リース、タイムシェアリングを含む、非個人的または商業目的での本サイトおよび/またはコンテンツの利用。</li>
      <li><strong>アカウント濫用</strong>:アカウントまたは認証情報の共有、譲渡、販売、または第三者の利用許可;利用制限、トライアル、または支払義務を回避するための複数アカウント作成。</li>
      <li><strong>回避</strong>:本サイトまたは本サービスのセキュリティ機能、アクセス制御、ペイウォール、レート制限、コンテンツ保護を回避、無効化、または妨害すること。</li>
      <li><strong>スクレイピング/自動化</strong>:当社の事前書面同意なしにロボット、スパイダー、クローラー、スクレイパー、スクリプトその他の自動手段(データマイニング、収集、抽出を含む)を通じて本サービスにアクセスまたは利用すること。</li>
      <li><strong>リバースエンジニアリング</strong>:契約により放棄できない法律で明示的に許可される場合を除き、本サイト、本テスト、コンテンツのいかなる部分の複製、変更、リバースエンジニアリング、逆コンパイル、翻案、翻訳、派生著作物の作成。</li>
      <li><strong>妨害/中断</strong>:本サイトまたはホストするサーバー・ネットワークの運用を妨害または中断すること;インフラに不当または不釣合いな負荷を課す行為。</li>
      <li><strong>悪意あるコード</strong>:ウイルス、ワーム、トロイの木馬、スパイウェア、時限爆弾その他の有害または悪意あるコードのアップロード、送信、配布。</li>
      <li><strong>虚偽の表明</strong>:本サービスに関する虚偽または誤解を招く情報の提示、または身分や所属の虚偽表示。</li>
      <li><strong>侵害/違法コンテンツ</strong>:第三者の知的財産権、プライバシー権、パブリシティ権その他の権利を侵害するコンテンツ、または違法、嫌がらせ、名誉毀損的、わいせつ、その他不快なコンテンツのアップロード、投稿、送信。</li>
      <li><strong>表示の削除</strong>:コンテンツまたは本サービスに表示される所有権表示、ラベル、ウォーターマーク、帰属の削除、変更、隠蔽。</li>
      <li><strong>テストの完全性</strong>:テストの実施または結果を操作・歪曲しようとする活動(回答共有の調整、自動解答ツールの使用その他の不正行為)。</li>
      <li><strong>不正/支払濫用</strong>:不正、支払濫用、または不適切なチャージバック行為(承認済みまたは配信を受けた取引の異議申立てを含む)。</li>
      <li><strong>ライセンス不一致の利用</strong>:本規約で付与された個人的・非商業的ライセンスを超えてデジタル商品(性格診断結果、証明書、レポートを含む)を利用すること。</li>
    </ol>

    <h2>10. 知的財産</h2>
    <h3>10.1 所有権</h3>
    <p>本サイト、本テスト、本サービス、それらを通じて提供されるすべてのコンテンツおよび素材(テキスト、グラフィック、画像、音声/動画、デザイン、レイアウト、ソフトウェア、コード、アルゴリズム、問題バンク、採点ロジック、データセットその他の著作物を含み、以下総称して「<strong>コンテンツ</strong>」)、ならびに関連する発明、研究、ノウハウ、商標、商号、サービスマーク、ドメイン名、ロゴ、企業秘密(以下総称して「<strong>所有資産</strong>」)は、当社が所有および/またはライセンスを受けており、適用される知的財産その他の法令により保護されています。<strong>明示的に付与されないすべての権利は留保されます。</strong></p>
    <h3>10.2 お客様への限定的ライセンス</h3>
    <p>本規約に従い、当社はお客様に、個人的、非商業的目的で本サービスおよびコンテンツにアクセスし利用するための個人的、限定的、取消可能、非独占的、譲渡不能、サブライセンス不能なライセンスを付与します。このライセンスは以下の権利を含みません:(a) 明示的に許可される場合を除くコンテンツの複製、配布、公開展示、公演;(b) コンテンツの修正、翻案、翻訳、派生著作物の作成、リバースエンジニアリング、逆コンパイル、ソースコードまたはデータセットの抽出(適用法令で禁止される場合を除く);(c) アクセス制御、セキュリティ、利用制限の回避;(d) 競合分析または競合する製品・サービスの構築のための利用。</p>
    <h3>10.3 デジタル商品</h3>
    <p>デジタル商品(性格タイプ結果、証明書、詳細レポート等)は販売ではなくライセンスされます。本セクションに従い個人的、非商業的利用のためにダウンロードおよびコピー保持できます。所有権表示、ウォーターマーク、帰属を削除または変更してはなりません。</p>
    <h3>10.4 商標</h3>
    <p>「16types」「IQBooster」、当社のロゴ、その他本サービスに関連して使用される当社マーク(以下総称して<strong>「当社マーク」</strong>)は、登録の有無を問わず当社の商標または商号です。本サービス上に表示されるその他の商標、サービスマーク、商号、ロゴはそれぞれの所有者に属します(以下「<strong>第三者マーク</strong>」)。本規約により当社マークまたは第三者マークに関するいかなる権利、ライセンス、利益も付与されません。</p>
    <h3>10.5 ユーザーコンテンツ</h3>
    <p>本サービスがコンテンツの提出、アップロード、送信を許可する場合(以下「ユーザーコンテンツ」)、お客様は当該ユーザーコンテンツに対する権利を保持します。お客様は、本サービスを運営、提供、改善する目的でのみ、当社にユーザーコンテンツをホスト、保存、複製、修正(フォーマット/表示用)、表示する全世界的、非独占的、無償、譲渡可能、サブライセンス可能なライセンスを付与します。</p>
    <h3>10.6 フィードバック</h3>
    <p>本サービスに関するアイデア、提案、フィードバック(以下「フィードバック」)を提供した場合、当社は制限または義務なくこれを使用し活用できることを承認します。</p>
    <h3>10.7 権利の留保</h3>
    <p>セクション10.2で明示的に付与される限定ライセンス(および特定のデジタル商品について提示されるエンドユーザーライセンス条項)を除き、当社または当社のライセンサーが所有または管理する知的財産権について、黙示、禁反言その他によるいかなる権利もお客様に付与されません。</p>

    <h2>11. 免責事項</h2>
    <p>適用法令で認められる最大限の範囲において、本サイト、本テスト、本サービス、およびすべてのコンテンツ(性格診断結果、証明書、詳細レポート等のデジタル商品を含む)は、「現状のまま」「利用可能な範囲で」「すべての欠陥を含む」状態で提供されます。当社、その関連会社、ライセンサー、子会社、役員、取締役、従業員、代理人、サプライヤーは、明示、黙示、または法定のあらゆる種類の保証を否認します。これには、権原、非侵害、商品性、特定目的への適合性の保証、および取引慣行や商慣行から生じる保証が含まれます。</p>
    <p>上記を制限することなく、当社は以下を保証しません:(A) 本サービスまたはコンテンツが中断なく、適時に、安全で、エラーフリー、または有害な要素がないこと;(B) 本テストまたはIQBoosterの利用から得られる結果が正確、信頼でき、または期待に応えること;(C) 欠陥が修正されること。</p>
    <p>教育/娯楽のみ — 専門的助言ではない。本テスト、結果、証明書、レポート、IQBoosterは医学的、臨床的、心理学的診断または治療ではなく、専門家の助言の代わりにはなりません。あらゆる依拠はお客様自身の責任で行われます。専門家の助言が必要な場合は、有資格の専門家にご相談ください。</p>
    <p>第三者サービス。当社は、本サービスに関連してアクセスまたは使用されたとしても、第三者サービス(決済処理事業者、ネットワーク、プラットフォームを含む)について責任を負わず、保証もしません。</p>
    <p>一部の法域では特定の保証の除外が認められないため、上記の除外がお客様に適用されない場合があります。その場合、除外は適用法令で認められる最大限の範囲で適用されます。</p>

    <h2>12. 責任の制限</h2>
    <p>適用法令で認められる最大限の範囲において、当社またはその関連会社、子会社、役員、取締役、従業員、代理人、サプライヤー、ライセンサー、請負業者(以下総称して「当社代表者」)は、いかなる責任理論(契約、不法行為(過失を含む)、厳格責任その他)に基づいても、利益、収益、のれん、データ、業務中断、その他の無形損失を含む、間接的、付随的、特別、結果的、模範的、または懲罰的損害について、以下に起因または関連していかなる責任も負いません:(A) お客様による本サイト、本テスト、本サービス、コンテンツ、デジタル商品へのアクセスまたは利用、もしくはアクセスまたは利用できないこと;(B) 他のユーザーまたは第三者の行為またはコンテンツ;(C) 第三者サービス(決済処理事業者を含む);(D) 本規約。</p>
    <p>上記を制限することなく、適用法令で認められる最大限の範囲において、本サービスまたは本規約に関連するすべての請求に対する当社および当社代表者の総責任は、以下のいずれか大きい額を超えないものとします:(I) 責任発生事象の前12か月間に当社にお支払いいただいた、請求の原因となった本サービスの実際の支払金額、または(II) 1.00米ドル。</p>
    <p>本セクションの制限と除外は、救済が本質的目的を果たさない場合および当社がそのような損害の可能性について通知を受けたか否かにかかわらず適用されます。</p>
    <p>一部の法域では特定の損害について責任の除外または制限が認められません。それらの法域では、当社の責任は法律で認められる最大限に制限されます。本規約のいかなる規定も、適用法令で除外または制限できない責任(詐欺、故意の不正行為、または認められない場合の過失による死亡または人身傷害責任等)を除外または制限するものではありません。</p>
    <p>当事者は、本セクションの制限が本サービスに関連する当事者間の取引と危険配分の基本的根拠であることに合意します。</p>

    <h2>13. 補償</h2>
    <p>お客様は、以下に起因または関連して生じるあらゆる請求、要求、訴訟、調査、損失、責任、損害、判決、罰金、ペナルティ、費用、経費(合理的な弁護士費用を含む)から、当社およびその関連会社、役員、取締役、従業員、代理人、ライセンサー、請負業者(以下総称して「当社当事者」)を防御し、補償し、損害を与えないことに同意します:</p>
    <p>(i) 本サイト、本テスト、本サービス、コンテンツ、デジタル商品の使用または誤用;</p>
    <p>(ii) 本規約または適用法令の違反;</p>
    <p>(iii) 第三者の知的財産権、プライバシー権、パブリシティ権その他の権利の侵害、不正使用、違反;</p>
    <p>(iv) 本サービスを通じて提出、アップロード、送信したユーザーコンテンツ;</p>
    <p>(v) 不正、支払/チャージバック濫用、その他の不法行為。</p>
    <p><strong>手続</strong>:当社は補償が求められる請求について速やかに書面で通知します(ただし、迅速な通知の懈怠は、実質的に不利益を被る範囲を除き、お客様の義務を免除するものではありません)。当社は自らの選択した弁護士で防御に参加する権利(義務ではない)を有し、お客様は当社の事前書面同意なしにいかなる和解も行わないものとします。</p>
    <p><strong>除外</strong>:お客様の補償義務は、当社の故意の不正行為または詐欺に起因する請求の範囲には適用されません。</p>

    <h2>14. 紛争解決</h2>
    <h3>14.1 非公式解決の要件</h3>
    <p>正式な手続を開始する前に、お客様は本規約または本サービスに起因または関連する紛争、請求、論争(以下「紛争」)を、まず<strong>誠実な交渉</strong>を通じて解決を試みることに同意します。<a href="mailto:info@16types.ai">info@16types.ai</a> へ件名「Notice of Dispute」でメール送信し、お名前、アカウントに紐付くメール、紛争の説明、求める具体的救済を含めてください。当社が「Notice of Dispute」を受領してから<strong>60日以内</strong>に紛争が解決されない場合、いずれの当事者も以下に定める手続に進めます。</p>
    <h3>14.2 米国仲裁(米国居住または米国で請求する場合)</h3>
    <p>セクション<strong>14.4</strong>および<strong>14.5</strong>に記載される事項を除き、紛争は当時有効な<strong>米国仲裁協会(AAA)消費者仲裁規則</strong>に基づき、AAAが運営する<strong>拘束力ある個別仲裁</strong>により解決されます。<strong>仲裁人</strong>は本規約に従い、裁判所で利用可能なすべての救済を裁定できます。</p>
    <ul>
      <li><strong>準拠法</strong>:本仲裁合意および仲裁は、抵触法規則を考慮せず<strong>デラウェア州法</strong>に準拠します。ただし、連邦仲裁法(FAA)が本セクションの解釈および執行可能性を規律します。</li>
      <li><strong>場所と形式</strong>:審理はビデオ会議で行うことができます。対面審理の場合、別段の合意がない限り<strong>デラウェア州ニューキャッスル郡</strong>で開催されます。</li>
      <li><strong>料金</strong>:申立、管理、仲裁人の料金支払はAAA規則に従います。AAA消費者規則または適用法令で要求される場合、当社は仲裁が消費者にとって費用効率的に行われることを保証するため、料金を支払いまたは償還します。</li>
      <li><strong>クラス/代表訴訟の放棄</strong>:法律で認められる最大限において、請求は<strong>個別の資格でのみ</strong>提起されなければならず、クラス、集団、統合、または代表訴訟としては提起できません。仲裁人は複数人の請求を統合したり、クラスまたは代表手続を主宰したりすることはできません。</li>
      <li><strong>少額裁判所の選択肢</strong>:いずれの当事者も、仲裁の代わりに、デラウェア州ニューキャッスル郡またはお客様の居住郡の<strong>少額裁判所</strong>に適格な請求を提起できます。</li>
      <li><strong>30日間のオプトアウト</strong>:お客様は本規約に最初に同意した日から<strong>30日以内</strong>に、件名「Arbitration Opt-Out」で <a href="mailto:info@16types.ai">info@16types.ai</a> へメール送信することにより、本仲裁合意から<strong>オプトアウト</strong>できます。</li>
    </ul>
    <h3>14.3 米国外の紛争</h3>
    <p>米国に居住しておらず、米国で請求を提起しない場合は、お客様の居住国法に基づく放棄不能な消費者権利を条件として、本規約はキプロス法に準拠し、紛争はキプロス・ラルナカ裁判所に提起されるものとします。お客様および当社は、適用法令で認められる範囲で、当該管轄および裁判地に同意し、不便な法廷地の異議を放棄します。</p>
    <h3>14.4 差止救済;知的財産保護;公的差止救済</h3>
    <p>本セクションのいかなる規定も、いずれかの当事者が知的財産または所有権を保護するため、または適用法令の下で放棄できない場合に公的差止救済を求めるため、管轄裁判所に一時的または予備的差止救済を求める能力を制限しません。</p>
    <h3>14.5 可分性</h3>
    <p>本セクション14のいずれかの部分が執行不能と判断された場合、残りの部分は引き続き有効です。クラス/代表訴訟の放棄が特定の請求について執行不能と判断された場合、セクション14.2の仲裁合意は当該請求には適用されず、当該請求は裁判所に提起されなければなりませんが、クラス/代表訴訟の放棄は他のすべての請求について最大限引き続き適用されます。</p>

    <h2>15. 準拠法;裁判地</h2>
    <h3>15.1 米国外ユーザー / 米国外の請求</h3>
    <p>セクション14に定める場合を除き、本規約および本規約に起因または関連する非仲裁可能な紛争または請求は、抵触法規則を考慮せずキプロス法に準拠し、キプロス・ラルナカ裁判所にのみ提起されるものとします。</p>
    <h3>15.2 米国ユーザー / 米国の請求</h3>
    <p>米国に<strong>居住する</strong>または米国で請求を提起するユーザーについて:(a) <strong>仲裁合意および仲裁</strong>は<strong>デラウェア州法</strong>に準拠し(ただし<strong>連邦仲裁法</strong>が仲裁合意の解釈および執行可能性を規律する範囲)、(b) <strong>非仲裁可能な</strong>紛争または請求は<strong>デラウェア州ニューキャッスル郡</strong>に所在する州または連邦裁判所にのみ提起されるものとし、当事者は当該管轄および裁判地に同意します。</p>
    <h3>15.3 消費者法のセーフガード</h3>
    <p>本規約のいかなる規定も、お客様の居住地の強行法規に基づきお客様が有する<strong>放棄不能な消費者権利</strong>を制限しません。</p>

    <h2>16. 規約の改定</h2>
    <p>当社は単独の裁量で、本規約(参照により組み込まれる方針を含む)を随時<strong>修正または更新</strong>することがあります。本ページを定期的にご確認ください。</p>
    <p><strong>重要な変更</strong>:重要な変更を行う場合、本サイトに明確な通知を掲示するおよび/またはアカウントに関連付けられたメールアドレスに送信する等の合理的努力により通知します。重要な変更は、通知の掲示または送信(いずれか早い方)から7日後に効力を生じます。ただし、通知でより長い期間が記載されているか、法律で要求される場合を除きます。</p>
    <p><strong>その他の変更</strong>:その他のすべての変更は、本規約上部の「最終改訂日」の時点で有効となります。効力発生日以降の本サービスへの継続的なアクセスまたは利用は、更新された規約の受諾を構成します。</p>
    <p><strong>サブスクリプションに影響する変更</strong>:変更がアクティブなサブスクリプションに影響する場合(価格、請求頻度、解約方法の変更等)、セクション7(請求と解約)に従って通知します。変更に同意しない場合、効力発生前に解約できます。</p>
    <p><strong>同意しない場合</strong>:更新された規約に同意しない場合は、本サービスの利用を停止し、該当する場合は変更の効力発生日前にサブスクリプションを解約してください。</p>
    <p><strong>法的または緊急の更新</strong>:法的、規制的、セキュリティ、運営要件に対処するための変更は、法律で認められる範囲で直ちに効力を生じる場合があります。</p>

    <h2>17. 終了;本サービスの変更</h2>
    <p>当社は、適用法令に従い、お客様が本規約に違反した、不正または濫用に関与したと合理的に判断する場合、または法律もしくは管轄当局により要求される場合を含め、いつでも単独の裁量で本サービスへのアクセスを(全部または一部)<strong>停止または終了</strong>することができます。法律で許可される場合、停止または終了の理由を通知します。</p>
    <p>当社は、本サービスまたは機能、コンテンツ、提供を、<strong>一時的または永続的に</strong>変更、停止、または中止することもあります。前払いサブスクリプション期間の終了前に本サービス(または該当する有料機能)を永続的に中止する場合、法律で要求されるまたは本規約の他の場所で対処される場合を除き、残存期間の前払い料金の<strong>按分返金</strong>を提供します。</p>
    <p>終了時、本サービスを使用する権利は直ちに停止します。性質上存続すべきセクション(<strong>知的財産</strong>、<strong>免責事項</strong>、<strong>責任の制限</strong>、<strong>補償、紛争解決、準拠法・裁判地、お支払いと返金(該当する範囲)、雑則を含む)は終了後も存続します。</strong></p>

    <h2>18. 雑則</h2>
    <p><strong>完全合意</strong>:本規約(プライバシーポリシー等の参照により組み込まれる文書を含む)は、本サービスに関するお客様と当社との間の完全な合意を構成し、その主題に関する従前または同時の理解に優先します。</p>
    <p><strong>関係</strong>:本規約のいかなる規定も、パートナーシップ、ジョイントベンチャー、雇用、代理、フランチャイザー・フランチャイジー関係を作るものではありません。</p>
    <p><strong>権利不放棄</strong>:いずれかの規定の不行使は、当該または他の規定の放棄ではありません。</p>
    <p><strong>可分性</strong>:いずれかの規定が執行不能と判断された場合、必要最小限の範囲に制限または削除され、残りは引き続き有効です。</p>
    <p><strong>譲渡</strong>:お客様は当社の事前書面同意なしに本規約(または権利/義務)を譲渡または移転できません。当社は制限なく本規約を譲渡できます(合併、買収、資産売却に関連する場合を含む)。</p>
    <p><strong>請求提起期間</strong>:様々な法域での消費者法との抵触を避けるため、当社は消費者請求に対し1年間の普遍的制限期間を適用しません。契約上の制限期間は、適用法令で許可される範囲でのみ適用されます。</p>
    <p><strong>輸出/コンプライアンス</strong>:お客様は、本サービスの利用を規律する可能性のある輸出、制裁、禁輸法を含む適用法令を遵守することに同意します。</p>
    <p><strong>不可抗力</strong>:いずれの当事者も、不可抗力(セクション2に定義)による履行の遅延または不履行について責任を負いません。ただし、影響を受ける当事者が緩和に合理的努力を行い、実行可能な場合に通知することを条件とします。</p>
    <p><strong>優先順位</strong>:本規約と本書で参照される方針との間に矛盾がある場合、参照される方針が明示的に別段定めない限り、本規約が優先します。</p>
    <p><strong>言語</strong>:翻訳版を提供する場合、適用法令で別段要求される場合を除き、矛盾する範囲で<strong>英語版が優先します</strong>。</p>

    <h2>19. 電子署名;記録</h2>
    <p>「アクセス取得」「お支払いへ進む」「支払う」「確認して結果を取得」「7日間トライアル開始」「旅を始める」または同様のチェックアウトもしくは本サービス内で提示される行為のラベルが付いたボタンをクリックすることにより、お客様は本規約に電子的に署名し、当社と法的拘束力のある契約を締結することに同意し意図します。お客様のクリック(および支払承認を含む関連確認)は、お客様の電子署名と、記録を電子的に受信・保管することへの同意を構成します。</p>
    <p>お客様は、米国電子署名法(ESIGN)、EU eIDAS規則、日本の電子署名及び認証業務に関する法律、韓国の電子文書及び取引基本法(および世界中の同様の法律)を含む適用法令で認められる最大限において、電子契約、署名、記録の使用に同意します。お客様は、法律で許可される範囲で、原本(非電子)署名または記録の非デジタル配信/保持の要件を放棄します。</p>

    <h2>20. 通知;連絡先情報</h2>
    <h3>20.1 一般的なお問い合わせ</h3>
    <p>本サービスまたは本規約に関するご質問は、<a href="mailto:info@16types.ai">info@16types.ai</a> または <a href="mailto:info@iqbooster.org">info@iqbooster.org</a> までご連絡ください。</p>
    <h3>20.2 法的通知</h3>
    <p>正式な通知(<strong>セクション14</strong>に基づく紛争通知を含む)は、<a href="mailto:info@16types.ai">info@16types.ai</a> および以下の郵送先に送信する必要があります。お名前、アカウントに紐付くメール、事項の明確な説明を含めてください。</p>
    <h3>20.3 当社の郵送先住所</h3>
    <p><strong>Maxiq Limited</strong><br />Markou Drakou 2A<br />Livadia 7060, Larnaca<br />Cyprus</p>
    <h3>20.4 通知の方法;受領のみなし</h3>
    <ul>
      <li>当社は、<strong>メール</strong>(アカウントに関連付けられたアドレス宛)、本サービスまたは当社ウェブサイト内での<strong>掲示</strong>、または<strong>郵送</strong>により通知することができます。</li>
      <li>お客様は、適用法令で許可される範囲で、<strong>メール</strong>が書面通知の法的要件を満たすことに同意します。</li>
      <li>通知は次のとおり<strong>付与された</strong>とみなされます:(i) メール送信時(受信者の所在地の通常業務時間中に送信された場合、それ以外は翌営業日);(ii) 本サービスまたは当社ウェブサイトに掲示時;(iii) 配達証明付き書留郵便での郵送から3営業日後。</li>
    </ul>
    <h3>20.5 連絡先詳細の変更</h3>
    <p>当社は本セクションの更新版を掲示することにより、連絡先詳細および郵送先住所を更新できます。お客様自身の連絡先情報を最新に保つ義務は<strong>セクション3(利用資格・ユーザーアカウント)</strong>に記載されています。</p>

    <p className="text-sm text-muted-foreground/60 mt-10"><strong>最終改訂日:2026年5月6日</strong></p>
    <p className="text-xs text-muted-foreground/70 italic">* 当社のコンテンツは、人間とAI支援翻訳の組み合わせにより複数言語で提供されています。正確性に努めていますが、英語版が公式かつ法的拘束力のあるテキストです。</p>
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
