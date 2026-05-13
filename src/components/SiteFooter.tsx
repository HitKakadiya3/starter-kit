import { useNavigate } from 'react-router-dom';

const SiteFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Dark blue/purple background with subtle geometric pattern */}
      <div className="absolute inset-0 bg-[hsl(270_40%_12%)]" />
      {/* SVG geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15V45L30 60L0 45V15Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0 w-10 h-10">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 16;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return (
                  <g key={angle}>
                    <line x1={20} y1={20} x2={cx} y2={cy} stroke="hsl(270 60% 70% / 0.5)" strokeWidth="1" />
                    <circle cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} fill={i % 2 === 0 ? 'hsl(270 70% 70%)' : 'hsl(270 60% 65%)'} />
                  </g>
                );
              })}
              {[30, 120, 210, 300].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const r = 8;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return <circle key={angle} cx={cx} cy={cy} r="1.8" fill="hsl(270 65% 68%)" />;
              })}
              <circle cx="20" cy="20" r="3" fill="hsl(270 70% 75%)" />
            </svg>
            <div className="flex flex-col" style={{ lineHeight: '1.1' }}>
              <span className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.06em] whitespace-nowrap">
                <span className="text-[hsl(270_70%_70%)]">16</span>
                <span className="text-white"> Types Test</span>
              </span>
              <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-white/40">Inspired by MBTI Theory</span>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Customer Support */}
            <div>
              <h4 className="font-bold text-sm text-white mb-3 leading-tight">Customer Support</h4>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="text-sm text-[hsl(270_80%_80%)] hover:text-white transition-colors">Contact Support</a>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-conditions" onClick={(e) => { e.preventDefault(); navigate('/terms-conditions'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/subscription-policy" onClick={(e) => { e.preventDefault(); navigate('/subscription-policy'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">Subscription Policy</a></li>
                <li><a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-bold text-sm text-white mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about-us" onClick={(e) => { e.preventDefault(); navigate('/about-us'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">About Us</a></li>
                <li><a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* IQ Booster */}
            <div>
              <h4 className="font-bold text-sm text-white mb-3">IQ Booster</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer" className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">Log In</a></li>
                <li><a href="/about-iq-booster" onClick={(e) => { e.preventDefault(); navigate('/about-iq-booster'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">About IQ Booster</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-[hsl(0_0%_70%)] mt-10 mb-6 leading-relaxed text-center">
          This test is for personal development and entertainment purposes only. It is not a medical or psychological diagnostic tool.
        </p>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-[hsl(0_0%_70%)]">
            © 2025 All Rights Reserved by Maxiq Limited, Larnaca, Cyprus
          </p>
          <div className="flex items-center gap-4">
            <a href="/avatars" className="text-sm text-[hsl(0_0%_70%)] hover:text-white transition-colors underline underline-offset-2">
              Avatar Gallery
            </a>
            <span className="text-sm text-white/30">·</span>
            <a
              href="/results"
              onClick={(e) => {
                e.preventDefault();
                navigate('/results', {
                  state: { scores: { E: 6, I: 9, S: 5, N: 10, T: 11, F: 4, J: 10, P: 5 } },
                });
              }}
              className="text-sm text-[hsl(0_0%_70%)] hover:text-white transition-colors underline underline-offset-2"
            >
              Sample Report
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
