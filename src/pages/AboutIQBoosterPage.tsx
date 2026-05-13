import { Brain, Target, Hash, Languages, Globe, Eye, BarChart3, Gamepad2 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

import logicalImg from '@/assets/iq-booster/logical.png';
import numberSequenceImg from '@/assets/iq-booster/number-sequence.png';
import symbolicImg from '@/assets/iq-booster/symbolic.png';
import generalKnowledgeImg from '@/assets/iq-booster/general-knowledge.png';
import visualImg from '@/assets/iq-booster/visual.png';
import dashboardImg from '@/assets/iq-booster/dashboard.png';
import brainGamesImg from '@/assets/iq-booster/brain-games.png';

const sections = [
  {
    icon: Target,
    title: 'Logical Reasoning',
    text: 'Logical Reasoning questions involve using critical thinking skills to assess logical relationships between statements or arguments. You will utilize critical thinking skills to evaluate the logical connections between statements or arguments.',
    image: logicalImg,
  },
  {
    icon: Hash,
    title: 'Number Sequence',
    text: 'Engage in Number Sequence questions that test your ability to identify and predict patterns in numerical sequences. These tasks may include finding missing numbers, determining the next number in a sequence, and discerning the underlying rule.',
    image: numberSequenceImg,
  },
  {
    icon: Languages,
    title: 'Symbolic Language',
    text: 'Symbolic Language questions entail the use of symbols to depict relationships between objects, concepts, or ideas. Try to identify translation words from multiple columns of different, overlapping symbolic "dictionaries".',
    image: symbolicImg,
  },
  {
    icon: Globe,
    title: 'General Knowledge',
    text: 'General Knowledge questions assess your broad knowledge across a wide range of topics, requiring a comprehensive understanding of information and facts. Test your general knowledge across various subjects, such as history, geography, science, arts, literature, and popular culture.',
    image: generalKnowledgeImg,
  },
  {
    icon: Eye,
    title: 'Visual Reasoning',
    text: 'Visual/Spatial challenges involve the identification of patterns, mental rotation of objects, spatial problem-solving, and the visualization of intricate structures.',
    image: visualImg,
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    text: 'With IQ Booster, you can also track your progress across different cognitive areas. The platform shows you exactly where you stand, highlights your strengths and weaknesses, and helps you identify what areas need improvement. This allows you to personalize your training and focus on the skills that matter most to you.',
    image: dashboardImg,
  },
  {
    icon: Gamepad2,
    title: 'Brain Games',
    text: 'In addition to daily workouts, you can enjoy unlimited brain games that sharpen your memory, improve focus, enhance problem-solving, and boost critical thinking skills — all designed to keep your mind active and growing.',
    image: brainGamesImg,
  },
];

const AboutIQBoosterPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-6">About IQ Booster</h1>

        {/* Intro paragraphs */}
        <div className="space-y-4 text-sm md:text-base text-foreground leading-relaxed mb-10">
          <p className="text-primary font-semibold">
            IQ Booster is a brain training service provided by 16Types to help users enhance their cognitive skills.
          </p>
          <p>
            As part of the <strong>16Types experience</strong>, users who complete the Personality test are invited to join IQ Booster for a more advanced and tailored brain training experience. IQ Booster is a <strong>premium service</strong>, and access is available through either a <strong>one-time payment</strong> or a flexible <strong>subscription plan</strong>.
          </p>
          <p className="text-muted-foreground">
            At IQ Booster, we are dedicated to helping you unlock the full potential of your mind. Just like your body, your brain benefits from regular training to stay sharp, agile, and ready for any challenge. Our platform is designed to help you enhance key cognitive skills through engaging, scientifically-backed exercises.
          </p>
          <p className="text-muted-foreground">
            Whether you want to improve memory, sharpen focus, boost problem-solving abilities, or strengthen your mental agility, IQ Booster provides the tools to help you succeed. With a user-friendly platform and personalized training programs, IQ Booster supports your journey to becoming more confident and effective in every aspect of life.
          </p>
          <p>
            IQ Booster provides <strong>daily workouts</strong> across several important topics. Each workout is designed to help you build and maintain stronger mental performance over time.
          </p>
        </div>

        {/* Topic sections */}
        <div className="space-y-6 mb-10">
          {sections.map(({ icon: Icon, title, text, image }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{text}</p>
              <img
                src={image}
                alt={title}
                className="w-full rounded-lg border border-border"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            You can enjoy IQ Booster anytime, anywhere — from your <strong className="text-foreground">desktop, tablet,</strong> or <strong className="text-foreground">mobile phone</strong>. The service offers a wide variety of <strong className="text-foreground">fun and challenging brain games</strong>, designed to stimulate your mind and help you consistently improve your cognitive abilities.
          </p>
          <p className="text-primary font-semibold text-base md:text-lg">
            Train smarter, think faster, and achieve more with IQ Booster.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AboutIQBoosterPage;
