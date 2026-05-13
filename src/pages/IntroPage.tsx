import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { withPromoParams } from '@/lib/promoUrl';
import { ArrowRight, Fingerprint, BarChart3, Clock, Target, Shield, Users, Zap, CheckCircle, Puzzle, Rocket, Star, TrendingUp, Heart, Briefcase, Lightbulb, UserCheck } from 'lucide-react';
import { useState } from 'react';
import PersonalityMarquee from '@/components/PersonalityMarquee';
import logoImg from '@/assets/logo.png';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Type avatars - Male
import intjAvatar from '@/assets/personalities-home/intj-strategist.png';
import entjAvatar from '@/assets/personalities-home/entj-leader.png';
import infjAvatar from '@/assets/personalities-home/infj-visionary.png';
import enfjAvatar from '@/assets/personalities-home/enfj-guide.png';
import istjAvatar from '@/assets/personalities-home/istj-inspector.png';
import estjAvatar from '@/assets/personalities-home/estj-director.png';
import istpAvatar from '@/assets/personalities-home/istp-craftsman.png';
import estpAvatar from '@/assets/personalities-home/estp-daredevil.png';

// Type avatars - Female
import intpFAvatar from '@/assets/personalities-female-home/intp-thinker.png';
import entpFAvatar from '@/assets/personalities-female-home/entp-innovator.png';
import infpFAvatar from '@/assets/personalities-female-home/infp-idealist.png';
import enfpFAvatar from '@/assets/personalities-female-home/enfp-dreamer.png';
import isfjFAvatar from '@/assets/personalities-female-home/isfj-protector.png';
import esfjFAvatar from '@/assets/personalities-female-home/esfj-caretaker.png';
import isfpFAvatar from '@/assets/personalities-female-home/isfp-artist.png';
import esfpFAvatar from '@/assets/personalities-female-home/esfp-performer.png';

const APP_TITLE = '16 Types';

const IntroPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 animate-fade-in">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-foreground bg-primary/10 px-3 md:px-4 py-1 md:py-1.5 rounded-full">Inspired by MBTI Theory</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight md:leading-tight lg:leading-tight">
              Discover your true <span className="text-primary">Personality Type</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Take our scientifically designed personality test to discover your 4-letter type and get a full analysis of your personality profile.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button size="xl" onClick={() => navigate(withPromoParams('/instructions'))} className="shadow-elevated">
                Start Test <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-background" />
      </section>

      {/* Personality Types Marquee */}
      <PersonalityMarquee />

      {/* About the Test */}
      <section className="py-16 md:py-24 bg-accent/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              About the Test
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Inspired by the MBTI framework, this 16-type personality test helps you discover how you think, communicate, and make decisions. In just a few minutes, you'll uncover your 4-letter personality type and unlock a full analysis report with insights into your strengths, relationships, and ideal career path.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card rounded-2xl shadow-soft border border-border/50">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-accent">
                <Puzzle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">4-Letter Type</h3>
              <p className="text-muted-foreground leading-relaxed">Discover your unique combination across four key personality dimensions.</p>
            </div>
            <div className="p-8 rounded-2xl shadow-soft bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white/20">
                <BarChart3 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Full Analysis</h3>
              <p className="opacity-90 leading-relaxed">Get detailed breakdowns of your strengths, relationships, and growth areas.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl shadow-soft border border-border/50">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-accent">
                <Rocket className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Unlock your potential</h3>
              <p className="text-muted-foreground leading-relaxed">Access a personalized growth plan with our brain training platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why Take This Test</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Understand yourself better
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Your personality type shapes how you connect with others, approach challenges, grow professionally, and make important decisions. By completing this test, you'll unlock personalized insights that reveal your strengths, areas for improvement, ideal career paths, relationship style, and the unique patterns that define your 4-letter type.
            </p>
          </div>

          {/* Report Dimensions */}
          <div className="mt-12">
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Star, title: 'Strengths', desc: 'Your core natural talents' },
                { icon: TrendingUp, title: 'Areas to Grow', desc: 'Where you can improve' },
                { icon: Briefcase, title: 'Career Paths', desc: 'Ideal jobs for your type' },
                { icon: Heart, title: 'Relationships', desc: 'How you connect with others' },
                { icon: Lightbulb, title: 'Decision Style', desc: 'How you make choices' },
                { icon: UserCheck, title: 'Communication', desc: 'Your interaction style' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 text-center hover:shadow-card transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-3 mx-auto">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 16 Types */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Personality Types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              The 16 Types
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Your personality is measured across four dimensions — Energy, Information, Decisions, and Lifestyle. Each dimension has two preferences, and your unique combination creates one of 16 distinct personality types.
            </p>
          </div>


          {/* 16 type badges grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              // Analysts (NT) - Purple
              { code: 'INTJ', label: 'Strategist', avatar: intjAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'INTP', label: 'Thinker', avatar: intpFAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'ENTJ', label: 'Leader', avatar: entjAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'ENTP', label: 'Innovator', avatar: entpFAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              // Diplomats (NF) - Green
              { code: 'INFJ', label: 'Visionary', avatar: infjAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'INFP', label: 'Idealist', avatar: infpFAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'ENFJ', label: 'Guide', avatar: enfjAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'ENFP', label: 'Dreamer', avatar: enfpFAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              // Sentinels (SJ) - Blue
              { code: 'ISTJ', label: 'Inspector', avatar: istjAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ISFJ', label: 'Protector', avatar: isfjFAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ESTJ', label: 'Director', avatar: estjAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ESFJ', label: 'Caretaker', avatar: esfjFAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              // Explorers (SP) - Amber
              { code: 'ISTP', label: 'Craftsman', avatar: istpAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ISFP', label: 'Artist', avatar: isfpFAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ESTP', label: 'Daredevil', avatar: estpAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ESFP', label: 'Performer', avatar: esfpFAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
            ].map(({ code, label, avatar, color }) => (
              <div key={code} className={`rounded-xl p-3 shadow-soft border text-center hover:scale-105 transition-all ${color}`}>
                <img src={avatar} alt={`${code} ${label}`} className="w-14 h-14 mx-auto rounded-full mb-2 object-cover" />
                <span className="text-sm font-extrabold text-primary">{code}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
              <Button variant="outline" size="xl" onClick={() => navigate('/16-types')} className="shadow-soft bg-background text-primary border-primary hover:bg-primary hover:text-primary-foreground px-12 py-6 transition-colors">
                Learn more <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/40 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to uncover your personality type.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Start the Test',
                desc: 'Begin the 60-question personality assessment.',
                bullets: ['Completely free', 'No registration', 'Private & anonymous'],
              },
              {
                step: '02',
                title: 'Answer Questions',
                desc: 'Rate each statement on a 5-point scale from Strongly Agree to Strongly Disagree.',
                bullets: ['Simple scale', 'No right/wrong', '~10 minutes'],
              },
              {
                step: '03',
                title: 'Get Your Type',
                desc: 'Receive your 4-letter personality type with detailed trait breakdowns.',
                bullets: ['4 dimensions', '16 possible types', 'Trait percentages'],
              },
              {
                step: '04',
                title: 'Explore Results',
                desc: 'Discover your strengths, ideal careers, famous examples, and personal insights.',
                bullets: ['Career paths', 'Famous matches', 'Actionable insights'],
              },
            ].map(({ step, title, desc, bullets }) => (
              <div key={step} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <span className="text-3xl font-extrabold gradient-text">{step}</span>
                <h3 className="text-lg font-bold text-foreground mt-3 mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What People Say
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Thousands of people have discovered their personality type with us.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "This test nailed my personality type. The results helped me understand why I approach problems the way I do — and how to communicate better with my team.",
                name: 'Sarah K.',
                type: 'INTJ — The Architect',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
              },
              {
                quote: "I've taken many personality tests, but this one stood out. The detailed breakdowns and career suggestions were surprisingly accurate and helpful.",
                name: 'Marcus L.',
                type: 'ENFP — The Campaigner',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
              },
              {
                quote: "Quick, easy, and insightful. I shared my results with my partner and it sparked an amazing conversation about how we complement each other.",
                name: 'Priya R.',
                type: 'ISFJ — The Defender',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
              },
            ].map(({ quote, name, type, image }) => (
              <div key={name} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-foreground text-sm">{name}</p>
                    <p className="text-xs text-primary font-semibold">{type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <Button size="xl" onClick={() => navigate(withPromoParams('/instructions'))} className="shadow-elevated px-16 py-7 text-lg">
            Start Test <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default IntroPage;
