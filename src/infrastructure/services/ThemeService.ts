import type { IThemeService, Theme } from '../../domain/interfaces/IThemeService';

export class ThemeService implements IThemeService {
  private currentTheme: Theme = 'auto';
  private listeners: Array<(theme: Theme) => void> = [];

  constructor() {
    this.loadTheme();
    this.setupSystemThemeListener();
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme();
    this.saveTheme();
    this.notifyListeners();
  }

  isDarkMode(): boolean {
    if (this.currentTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentTheme === 'dark';
  }

  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private loadTheme(): void {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      this.currentTheme = saved;
    }
    this.applyTheme();
  }

  private saveTheme(): void {
    localStorage.setItem('theme', this.currentTheme);
  }

  private applyTheme(): void {
    const isDark = this.isDarkMode();
    document.documentElement.classList.toggle('dark', isDark);
    
    // Atualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
    }
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme();
        this.notifyListeners();
      }
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}
