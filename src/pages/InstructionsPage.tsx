import { useState } from "react";
import { useTranslation } from "react-i18next";
import maleAvatar from "@/assets/older-male-avatar.png";
import femaleAvatar from "@/assets/older-female-avatar.png";
import { useLocalizedNavigate } from "@/hooks/useLocale";

const InstructionsPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (gender: string) => {
    setSelected(gender);
    localStorage.setItem('user_gender', gender);
    setTimeout(() => navigate("/quiz"), 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top navbar with logo */}
      <nav className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center h-20">
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
                <span className="text-foreground"> {t('brand.name')}</span>
              </span>
              <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-muted-foreground">{t('brand.tagline')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 md:pt-10 pb-6 md:pb-12">
        <div className="max-w-lg w-full bg-transparent md:bg-card border-0 md:border md:border-border rounded-none md:rounded-2xl shadow-none md:shadow-soft p-0 md:p-10 text-center space-y-5 md:space-y-8">
          <h1 className="text-2xl font-bold text-primary">{t('instructions.title')}</h1>

          <p className="text-foreground text-base leading-relaxed -mt-4">
            {t('instructions.intro')}<br />
            {t('instructions.intro2')}
          </p>

          <hr className="border-border" />

          <p className="text-base font-bold text-muted-foreground">{t('instructions.selectGender')}</p>

          <div className="flex gap-4 md:gap-6 justify-center">
            {[
              { key: "male", label: t('instructions.male'), avatar: maleAvatar, color: "text-primary", bg: "bg-[hsl(210_60%_92%)]" },
              { key: "female", label: t('instructions.female'), avatar: femaleAvatar, color: "text-orange-400", bg: "bg-[hsl(25_85%_90%)]" },
            ].map(({ key, label, avatar, color, bg }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`flex-1 max-w-[200px] rounded-2xl border-2 transition-all duration-200 overflow-hidden ${bg} ${
                  selected === key
                    ? 'border-primary scale-[1.03] shadow-lg'
                    : 'border-border hover:border-primary/40 hover:shadow-md'
                } ${selected !== null && selected !== key ? 'opacity-40' : ''}`}
              >
                <div className="p-4 pb-2">
                  <span className={`font-bold text-lg ${color}`}>{label}</span>
                </div>
                <div className="px-0 pb-0">
                  <img src={avatar} alt={label} loading="lazy" width={512} height={512} className="w-full h-auto block" />
                </div>
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">{t('instructions.duration')}</p>
      </div>
    </div>
  );
};

export default InstructionsPage;
