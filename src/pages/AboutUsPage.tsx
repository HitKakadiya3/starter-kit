import { useNavigate } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const AboutUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-6">About Us</h1>

        <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            At 16Types, we believe that understanding yourself is the first step toward personal growth. Our mission is to make personality discovery simple, insightful, and actionable for everyone.
          </p>

          <p>
            Inspired by the MBTI framework, our 16-type personality test is designed to help people uncover how they naturally think, communicate, make decisions, and build relationships. In just a few minutes, users can discover their unique 4-letter personality type and unlock a detailed analysis of their strengths, growth areas, career paths, relationship style, and decision-making patterns.
          </p>

          <p>
            But we go beyond simply revealing a personality type.
          </p>

          <p>
            Our goal is to transform self-awareness into real-life improvement. That's why we combine deep personality insights with practical recommendations, personalized growth plans, and access to our brain training platform, helping users strengthen focus, confidence, decision-making, and everyday performance over time.
          </p>

          <p>
            Whether you're exploring your ideal career, improving relationships, understanding your natural habits, or simply learning more about yourself, 16Types is built to guide your journey with clear and meaningful insights.
          </p>

          <p>
            We're here to help you not only discover who you are, but also unlock who you can become.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/instructions')}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity"
          >
            Take the Test
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AboutUsPage;
