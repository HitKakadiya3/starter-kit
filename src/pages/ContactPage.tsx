import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import supportAgentImg from '@/assets/support-agent.png';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const ContactPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: 'Message sent!', description: "We'll get back to you within 24 hours." });
      setName(''); setEmail(''); setSubject(''); setMessage('');
    }, 1500);
  };

  const faqs = [
    { q: 'How long does the test take?', a: 'The test consists of 60 questions and takes approximately 10 minutes to complete.' },
    { q: 'Is the test free?', a: 'Yes, the personality test is completely free. No signup required.' },
    { q: 'How accurate is the test?', a: 'Our test is based on established MBTI theory and uses a 5-point scale for nuanced results.' },
    { q: 'Can I retake the test?', a: 'Absolutely! You can retake the test as many times as you like.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <img src={supportAgentImg} alt="Support agent" className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20" width={512} height={512} />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How can we help?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a question or need assistance? We're here to help. Reach out and we'll respond within 24 hours.
          </p>
        </div>


        <div className="max-w-xl mx-auto">
          {/* Contact form */}
          <div className="border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Contact Us
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Fill out the form and we'll get back to you shortly.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Name</label>
                  <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
                  <Input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Subject</label>
                <Input placeholder="How can we help?" value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Message</label>
                <Textarea placeholder="Tell us more..." className="min-h-[120px]" value={message} onChange={e => setMessage(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? 'Sending…' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
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
