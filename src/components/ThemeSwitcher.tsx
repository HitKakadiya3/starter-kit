import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import { THEMES, ThemeId, applyTheme, getStoredThemeId } from '@/lib/themes';

const ThemeSwitcher = () => {
  const [active, setActive] = useState<ThemeId>('purple');

  useEffect(() => {
    const id = getStoredThemeId();
    setActive(id);
    applyTheme(id);
    const onChange = (e: Event) => setActive((e as CustomEvent).detail as ThemeId);
    window.addEventListener('themechange', onChange);
    return () => window.removeEventListener('themechange', onChange);
  }, []);

  const handleSelect = (id: ThemeId) => {
    setActive(id);
    applyTheme(id);
  };

  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch color theme"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border rounded-full px-2.5 py-1.5 hover:bg-muted/50 transition-colors"
      >
        <Palette className="w-3.5 h-3.5" />
        <span
          className="w-3.5 h-3.5 rounded-full border border-border"
          style={{ backgroundColor: current.swatch }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onSelect={() => handleSelect(theme.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: theme.swatch }}
            />
            <span className="flex-1 text-sm">{theme.label}</span>
            {active === theme.id && <Check className="w-3.5 h-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
