export type Theme = 'light' | 'dark' | 'auto';

export interface IThemeService {
  getCurrentTheme(): Theme;
  setTheme(theme: Theme): void;
  isDarkMode(): boolean;
  onThemeChange(callback: (theme: Theme) => void): () => void;
}
