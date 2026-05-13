import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Male avatars
import intjAvatar from '@/assets/personalities-home/intj-strategist.png';
import entjAvatar from '@/assets/personalities-home/entj-leader.png';
import infjAvatar from '@/assets/personalities-home/infj-visionary.png';
import enfjAvatar from '@/assets/personalities-home/enfj-guide.png';
import istjAvatar from '@/assets/personalities-home/istj-inspector.png';
import estjAvatar from '@/assets/personalities-home/estj-director.png';
import istpAvatar from '@/assets/personalities-home/istp-craftsman.png';
import estpAvatar from '@/assets/personalities-home/estp-daredevil.png';

// Female avatars
import intpFAvatar from '@/assets/personalities-female-home/intp-thinker.png';
import entpFAvatar from '@/assets/personalities-female-home/entp-innovator.png';
import infpFAvatar from '@/assets/personalities-female-home/infp-idealist.png';
import enfpFAvatar from '@/assets/personalities-female-home/enfp-dreamer.png';
import isfjFAvatar from '@/assets/personalities-female-home/isfj-protector.png';
import esfjFAvatar from '@/assets/personalities-female-home/esfj-caretaker.png';
import isfpFAvatar from '@/assets/personalities-female-home/isfp-artist.png';
import esfpFAvatar from '@/assets/personalities-female-home/esfp-performer.png';

interface TypeInfo {
  code: string;
  label: string;
  avatar: string;
  desc: string;
}

interface TypeGroup {
  number: number;
  name: string;
  subtitle: string;
  color: string;
  cardBorder: string;
  types: TypeInfo[];
}

const groups: TypeGroup[] = [
  {
    number: 1,
    name: 'Analysts',
    subtitle: 'Intuitive (N) and Thinking (T) personality types, known for their rationality, impartiality, and intellectual excellence.',
    color: 'text-purple-500',
    cardBorder: 'border-purple-300/60 bg-purple-50/30 dark:bg-purple-950/20',
    types: [
      { code: 'INTJ', label: 'Strategist', avatar: intjAvatar, desc: 'Strategic and analytical, they excel at planning and value independence but may struggle with emotional expression.' },
      { code: 'INTP', label: 'Thinker', avatar: intpFAvatar, desc: 'Logical and curious, they enjoy abstract ideas and independent thinking, but may struggle with decisions and seem detached.' },
      { code: 'ENTJ', label: 'Leader', avatar: entjAvatar, desc: 'Bold, decisive leaders who are efficient, organized, and driven by progress. They thrive on challenges but can seem impatient or critical.' },
      { code: 'ENTP', label: 'Innovator', avatar: entpFAvatar, desc: 'Quick-witted and energetic, they thrive on debate and new ideas but can be impulsive and struggle with follow-through.' },
    ],
  },
  {
    number: 2,
    name: 'Diplomats',
    subtitle: 'Intuitive (N) and Feeling (F) personality types, known for their empathy, diplomatic skills, and passionate idealism.',
    color: 'text-emerald-500',
    cardBorder: 'border-emerald-300/60 bg-emerald-50/30 dark:bg-emerald-950/20',
    types: [
      { code: 'INFJ', label: 'Visionary', avatar: infjAvatar, desc: 'Idealistic and compassionate, they seek meaning and help others but may struggle with boundaries and emotional exhaustion.' },
      { code: 'INFP', label: 'Idealist', avatar: infpFAvatar, desc: 'Creative and idealistic, they\'re guided by inner values and passion, but can be overly sensitive and prone to daydreaming.' },
      { code: 'ENFJ', label: 'Guide', avatar: enfjAvatar, desc: 'Charismatic and supportive, they inspire others and aim to improve the world but may be self-sacrificing and people-pleasing.' },
      { code: 'ENFP', label: 'Dreamer', avatar: enfpFAvatar, desc: 'Enthusiastic and imaginative, they enjoy new ideas and meaningful connections but may struggle with commitment, structure, and focus.' },
    ],
  },
  {
    number: 3,
    name: 'Sentinels',
    subtitle: 'Observant (S) and Judging (J) personality types, known for their practicality and focus on order, security, and stability.',
    color: 'text-sky-500',
    cardBorder: 'border-sky-300/60 bg-sky-50/30 dark:bg-sky-950/20',
    types: [
      { code: 'ISTJ', label: 'Inspector', avatar: istjAvatar, desc: 'Responsible and practical, they value structure and tradition but may struggle with flexibility and adaptability.' },
      { code: 'ISFJ', label: 'Protector', avatar: isfjFAvatar, desc: 'Caring and dependable, they are kind and committed to helping others but may struggle with self-assertion and handling criticism.' },
      { code: 'ESTJ', label: 'Director', avatar: estjAvatar, desc: 'Assertive and organized, they value efficiency, structure, and responsibility, but can come across as rigid or overly controlling.' },
      { code: 'ESFJ', label: 'Caretaker', avatar: esfjFAvatar, desc: 'Social and warm, they thrive on connection, harmony, and helping others, but may become overly concerned with others\' opinions.' },
    ],
  },
  {
    number: 4,
    name: 'Explorers',
    subtitle: 'Observant (S) and Prospecting (P) personality types, known for their spontaneity, ingenuity, and flexibility.',
    color: 'text-amber-500',
    cardBorder: 'border-amber-300/60 bg-amber-50/30 dark:bg-amber-950/20',
    types: [
      { code: 'ISTP', label: 'Craftsman', avatar: istpAvatar, desc: 'Practical and independent, they enjoy hands-on problem-solving and new experiences but can be distant or impulsive.' },
      { code: 'ISFP', label: 'Artist', avatar: isfpFAvatar, desc: 'Artistic and sensitive, they\'re in tune with their emotions and value creativity, but may struggle with planning and confrontation.' },
      { code: 'ESTP', label: 'Daredevil', avatar: estpAvatar, desc: 'Energetic and spontaneous, they thrive on excitement and action but may struggle with patience and long-term commitment.' },
      { code: 'ESFP', label: 'Performer', avatar: esfpFAvatar, desc: 'Fun-loving and outgoing, they bring energy to every moment and love socializing but may struggle with planning and discipline.' },
    ],
  },
];

const SixteenTypesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Get to Know the <span className="text-primary">16 Personality Types</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personality is measured across four dimensions — Energy, Information, Decisions, and Lifestyle. Each dimension has two preferences, and your unique combination creates one of 16 distinct personality types.
          </p>
        </div>
      </section>

      {/* Dimensions overview */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { pair: 'E / I', label: 'Energy', desc: 'Extraversion vs. Introversion' },
              { pair: 'S / N', label: 'Information', desc: 'Sensing vs. Intuition' },
              { pair: 'T / F', label: 'Decisions', desc: 'Thinking vs. Feeling' },
              { pair: 'J / P', label: 'Lifestyle', desc: 'Judging vs. Perceiving' },
            ].map(({ pair, label, desc }) => (
              <div key={pair} className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 text-center">
                <span className="text-2xl font-extrabold gradient-text">{pair}</span>
                <h4 className="font-bold text-foreground mt-2 text-sm">{label}</h4>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Type Groups */}
      {groups.map(({ number, name, subtitle, color, cardBorder, types }) => (
        <section key={name} className="py-12 md:py-16 even:bg-muted/40">
          <div className="max-w-5xl mx-auto px-4">
            {/* Group header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className={`w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold`}>
                  {number}
                </span>
                <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{name}</h2>
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                {subtitle}
              </p>
            </div>

            {/* Type cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {types.map(({ code, label, avatar, desc }) => (
                <div key={code} className={`rounded-2xl border p-5 text-center shadow-soft hover:scale-[1.03] transition-all ${cardBorder}`}>
                  <img
                    src={avatar}
                    alt={`${code} ${label}`}
                    className="w-24 h-24 mx-auto rounded-2xl mb-4 object-cover"
                  />
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">{code}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Button size="xl" onClick={() => navigate('/instructions')} className="shadow-elevated px-12 py-6 text-lg md:text-xl">
            Start the test
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SixteenTypesPage;
