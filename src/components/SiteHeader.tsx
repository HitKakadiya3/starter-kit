import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { withPromoParams } from '@/lib/promoUrl';

const SiteHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0 w-7 h-7 md:w-10 md:h-10">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const r = 16;
              const cx = 20 + r * Math.cos(rad - Math.PI / 2);
              const cy = 20 + r * Math.sin(rad - Math.PI / 2);
              return (
                <g key={angle}>
                  <line x1={20} y1={20} x2={cx} y2={cy} stroke="hsl(270 30% 80%)" strokeWidth="1" />
                  <circle cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} fill={i % 2 === 0 ? 'hsl(270 50% 45%)' : 'hsl(270 40% 65%)'} />
                </g>
              );
            })}
            {[30, 120, 210, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const r = 8;
              const cx = 20 + r * Math.cos(rad - Math.PI / 2);
              const cy = 20 + r * Math.sin(rad - Math.PI / 2);
              return <circle key={angle} cx={cx} cy={cy} r="1.8" fill="hsl(270 50% 55%)" />;
            })}
            <circle cx="20" cy="20" r="3" fill="hsl(270 50% 45%)" />
          </svg>
          <div className="flex flex-col" style={{ lineHeight: '1.1' }}>
            <span className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.06em]">
              <span style={{ color: 'hsl(270 50% 45%)' }}>16</span>
              <span className="text-foreground"> Types Test</span>
            </span>
            <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-muted-foreground">Inspired by MBTI Theory</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/16-types" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/16-types'); }}>16 Types</a>
          <a href="/pricing" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>Pricing</a>
          <a href="/contact" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact us</a>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Button size="sm" onClick={() => navigate(withPromoParams('/instructions'))}>
            Start Test
          </Button>
          <a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              IQ Booster Login
            </Button>
          </a>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-2 border border-border rounded-full px-3 py-1.5 hover:bg-muted/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm flex-shrink-0 overflow-hidden">
              <rect width="60" height="30" fill="#B22234"/>
              {[0,1,2,3,4,5,6].map(i => <rect key={i} y={i*4.6+2.3} width="60" height="2.3" fill="#fff"/>)}
              <rect width="24" height="16" fill="#3C3B6E"/>
            </svg>
            <span>English</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-3">
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/'); }}>16 Types</a>
          <a href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/pricing'); }}>Pricing</a>
          <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/contact'); }}>Contact us</a>
          <Button size="sm" onClick={() => { setMobileMenuOpen(false); navigate(withPromoParams('/instructions')); }} className="w-full mt-1">
            Start Test
          </Button>
          <a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button size="sm" variant="outline" className="w-full border-primary text-primary">
              IQ Booster Login
            </Button>
          </a>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:bg-muted/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm flex-shrink-0 overflow-hidden">
              <rect width="60" height="30" fill="#B22234"/>
              {[0,1,2,3,4,5,6].map(i => <rect key={i} y={i*4.6+2.3} width="60" height="2.3" fill="#fff"/>)}
              <rect width="24" height="16" fill="#3C3B6E"/>
            </svg>
            <span>English</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      )}
    </nav>
  );
};

export default SiteHeader;
