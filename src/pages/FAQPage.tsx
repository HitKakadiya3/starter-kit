import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQPage = () => {
  const { t } = useTranslation();
  const items = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-foreground">
          {t('faq.title')}
        </h1>
        <p className="text-center text-muted-foreground mb-8">{t('faq.subtitle')}</p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {items.map(i => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{t(`faq.q${i}`)}</AccordionTrigger>
              <AccordionContent>{t(`faq.a${i}`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FAQPage;
