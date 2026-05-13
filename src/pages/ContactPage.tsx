import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import supportAgentImg from '@/assets/support-agent.png';
import { toast } from '@/hooks/use-toast';
import { apiPost, ApiError } from '@/lib/api';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Captcha is enabled only when a site key is configured. Leave
// `VITE_RECAPTCHA_SITE_KEY` empty/unset on dev and staging environments to
// skip captcha entirely; set it on production. The hook treats an empty
// value as "no captcha" and the submit handler omits `recaptcha_token`.
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as
  | string
  | undefined;

const ContactPage = () => {
  const { t } = useTranslation();
  const { execute: executeRecaptcha } = useRecaptcha(RECAPTCHA_SITE_KEY);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mirror backend Joi `.trim()` normalization so whitespace-only inputs
    // (which slip past native `required` and `minLength`) are caught here.
    // Max bounds are enforced by `maxLength` on the inputs, so we only
    // check minimums; email format is enforced by `type="email"`.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const errorKey =
      trimmedName.length < 2 ? 'contact.nameTooShort'
      : trimmedSubject.length < 3 ? 'contact.subjectTooShort'
      : trimmedMessage.length < 10 ? 'contact.messageTooShort'
      : null;
    if (errorKey) {
      toast({ title: t(errorKey), variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const recaptchaToken = await executeRecaptcha('contact_form');
      if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
        toast({ title: t('common.somethingWentWrong'), variant: 'destructive' });
        return;
      }
      await apiPost('customer/contact', {
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
      });
      toast({ title: t('contact.sentTitle'), description: t('contact.sentDesc') });
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (err) {
      const description =
        err instanceof ApiError ? err.message : t('common.somethingWentWrong');
      toast({ title: t('common.somethingWentWrong'), description, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <img src={supportAgentImg} alt={t('contact.supportAlt')} className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20" width={512} height={512} />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('contact.title')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Contact form */}
          <div className="border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> {t('contact.formTitle')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{t('contact.formSubtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">{t('contact.name')}</label>
                  <Input placeholder={t('contact.namePh')} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">{t('contact.email')}</label>
                  <Input type="email" placeholder={t('contact.emailPh')} value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t('contact.subject')}</label>
                <Input placeholder={t('contact.subjectPh')} value={subject} onChange={e => setSubject(e.target.value)} required minLength={3} maxLength={150} />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t('contact.message')}</label>
                <Textarea placeholder={t('contact.messagePh')} className="min-h-[120px]" value={message} onChange={e => setMessage(e.target.value)} required minLength={10} maxLength={3000} />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? t('contact.sending') : <><Send className="w-4 h-4 mr-2" /> {t('contact.send')}</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
