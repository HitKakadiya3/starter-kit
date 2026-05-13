import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale, swapLocalePath } from '@/hooks/useLocale';

interface Props {
  className?: string;
}

const LANGS = [
  { code: 'en' as const, label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'ja' as const, label: '日本語', flag: 'https://flagcdn.com/w40/jp.png' },
];

const LanguageSwitcher = ({ className = '' }: Props) => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (target: 'en' | 'ja') => {
    setOpen(false);
    if (target === locale) return;
    navigate(swapLocalePath(pathname, target) + search + hash);
  };

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-border bg-background hover:bg-muted transition-colors"
      >
        <img src={current.flag} alt="" className="w-5 h-[14px] object-cover rounded-sm" />
        <span>{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[160px] rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-50"
        >
          {LANGS.map((l) => {
            const active = l.code === locale;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => go(l.code)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                  active ? 'bg-accent font-semibold text-accent-foreground' : 'hover:bg-muted text-foreground'
                }`}
              >
                <img src={l.flag} alt="" className="w-5 h-[14px] object-cover rounded-sm" />
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
