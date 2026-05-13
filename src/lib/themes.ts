// Color palette themes. Each theme overrides the primary/accent/quiz HSL tokens.
// Values are HSL strings without the hsl() wrapper (matching index.css convention).

export type ThemeId = 'purple' | 'ocean' | 'emerald' | 'sunset' | 'rose' | 'slate';

export type Theme = {
  id: ThemeId;
  label: string;
  swatch: string; // hex preview for the menu dot
  tokens: Record<string, string>;
};

export const THEMES: Theme[] = [
  {
    id: 'purple',
    label: 'Purple',
    swatch: '#8B5CF6',
    tokens: {
      '--primary': '270 55% 58%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '270 45% 25%',
      '--muted': '270 20% 96%',
      '--muted-foreground': '270 15% 45%',
      '--accent': '270 50% 93%',
      '--accent-foreground': '270 55% 42%',
      '--border': '270 15% 90%',
      '--input': '270 15% 90%',
      '--ring': '270 55% 58%',
      '--quiz-progress': '270 55% 58%',
      '--quiz-scale-active': '270 55% 58%',
      '--quiz-dimension': '270 55% 58%',
      '--quiz-trait-bar': '270 55% 58%',
      '--quiz-badge': '270 45% 25%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(270 55% 53%) 0%, hsl(270 55% 63%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(280 60% 97%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: '#3B82F6',
    tokens: {
      '--primary': '217 80% 56%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '217 60% 25%',
      '--muted': '217 25% 96%',
      '--muted-foreground': '217 15% 45%',
      '--accent': '217 60% 93%',
      '--accent-foreground': '217 80% 42%',
      '--border': '217 20% 90%',
      '--input': '217 20% 90%',
      '--ring': '217 80% 56%',
      '--quiz-progress': '217 80% 56%',
      '--quiz-scale-active': '217 80% 56%',
      '--quiz-dimension': '217 80% 56%',
      '--quiz-trait-bar': '217 80% 56%',
      '--quiz-badge': '217 60% 25%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(217 80% 51%) 0%, hsl(217 80% 61%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(210 70% 97%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
  {
    id: 'emerald',
    label: 'Emerald',
    swatch: '#10B981',
    tokens: {
      '--primary': '160 70% 40%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '160 50% 20%',
      '--muted': '160 20% 96%',
      '--muted-foreground': '160 15% 40%',
      '--accent': '160 50% 92%',
      '--accent-foreground': '160 70% 28%',
      '--border': '160 20% 88%',
      '--input': '160 20% 88%',
      '--ring': '160 70% 40%',
      '--quiz-progress': '160 70% 40%',
      '--quiz-scale-active': '160 70% 40%',
      '--quiz-dimension': '160 70% 40%',
      '--quiz-trait-bar': '160 70% 40%',
      '--quiz-badge': '160 50% 20%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(160 70% 35%) 0%, hsl(160 70% 45%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(155 60% 96%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    swatch: '#F97316',
    tokens: {
      '--primary': '24 90% 55%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '24 70% 25%',
      '--muted': '24 30% 96%',
      '--muted-foreground': '24 20% 42%',
      '--accent': '24 80% 93%',
      '--accent-foreground': '24 90% 40%',
      '--border': '24 25% 88%',
      '--input': '24 25% 88%',
      '--ring': '24 90% 55%',
      '--quiz-progress': '24 90% 55%',
      '--quiz-scale-active': '24 90% 55%',
      '--quiz-dimension': '24 90% 55%',
      '--quiz-trait-bar': '24 90% 55%',
      '--quiz-badge': '24 70% 25%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(24 90% 50%) 0%, hsl(36 95% 60%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(30 80% 97%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
  {
    id: 'rose',
    label: 'Rose',
    swatch: '#EC4899',
    tokens: {
      '--primary': '335 78% 58%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '335 55% 25%',
      '--muted': '335 25% 96%',
      '--muted-foreground': '335 15% 45%',
      '--accent': '335 70% 94%',
      '--accent-foreground': '335 78% 42%',
      '--border': '335 20% 90%',
      '--input': '335 20% 90%',
      '--ring': '335 78% 58%',
      '--quiz-progress': '335 78% 58%',
      '--quiz-scale-active': '335 78% 58%',
      '--quiz-dimension': '335 78% 58%',
      '--quiz-trait-bar': '335 78% 58%',
      '--quiz-badge': '335 55% 25%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(335 78% 53%) 0%, hsl(335 78% 63%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(340 70% 97%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
  {
    id: 'slate',
    label: 'Slate',
    swatch: '#475569',
    tokens: {
      '--primary': '215 25% 35%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '215 25% 18%',
      '--muted': '215 15% 96%',
      '--muted-foreground': '215 12% 40%',
      '--accent': '215 25% 92%',
      '--accent-foreground': '215 25% 25%',
      '--border': '215 15% 88%',
      '--input': '215 15% 88%',
      '--ring': '215 25% 35%',
      '--quiz-progress': '215 25% 35%',
      '--quiz-scale-active': '215 25% 35%',
      '--quiz-dimension': '215 25% 35%',
      '--quiz-trait-bar': '215 25% 35%',
      '--quiz-badge': '215 25% 18%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(215 25% 30%) 0%, hsl(215 25% 45%) 100%)',
      '--gradient-warm': 'linear-gradient(180deg, hsl(215 20% 97%) 0%, hsl(0 0% 100%) 100%)',
    },
  },
];

const STORAGE_KEY = 'app.theme';

export function getStoredThemeId(): ThemeId {
  if (typeof window === 'undefined') return 'purple';
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  return saved && THEMES.some((t) => t.id === saved) ? saved : 'purple';
}

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const root = document.documentElement;
  Object.entries(theme.tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  window.localStorage.setItem(STORAGE_KEY, theme.id);
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme.id }));
}
