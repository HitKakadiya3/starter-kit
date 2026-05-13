import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Find quick answers about your personality report, subscription, brain training trial, and account support.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              How does the test work?
            </AccordionTrigger>
            <AccordionContent>
              Our test is inspired by the MBTI framework and the 16 personality types model. By answering questions about how you naturally think, feel, and make decisions, the system identifies your 4-letter type and generates a personalized analysis report.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              How long does the test take?
            </AccordionTrigger>
            <AccordionContent>
              The test includes a series of quick personality questions and usually takes 3–5 minutes to complete.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              What do I get with my purchase?
            </AccordionTrigger>
            <AccordionContent>
              You'll unlock your complete 4-letter personality report, including strengths, growth areas, relationship style, communication patterns, ideal career paths, and personalized recommendations. Your purchase also includes a 7-day free trial of our brain training platform, with daily exercises that adapt to your progress. After 7 days, the subscription begins automatically unless canceled before the trial ends.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              Will I get a full report?
            </AccordionTrigger>
            <AccordionContent>
              Yes. After completing the test, you'll receive a full personality profile report with detailed insights into your strengths, blind spots, relationships, work style, and ideal career path.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              Can I cancel the brain training trial anytime?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can cancel anytime during the 7-day free trial to avoid automatic subscription renewal.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">
              How can I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent>
              You can cancel your subscription anytime from your account settings or by contacting our support team before the renewal date.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">
              Is my information private?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Your answers and personal details are kept confidential and are never shared with third parties.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left">
              How can I contact you?
            </AccordionTrigger>
            <AccordionContent>
              You can reach our support team anytime through our contact page or by email at info@16types.ai, and we'll be happy to assist you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FAQPage;
