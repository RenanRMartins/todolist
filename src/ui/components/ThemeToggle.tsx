import { useEffect, useState } from 'react';
import { container } from '../../di/container';
import type { Theme } from '../../domain/interfaces/IThemeService';

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('auto');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setCurrentTheme(container.themeService.getCurrentTheme());
    setIsDarkMode(container.themeService.isDarkMode());

    const unsubscribe = container.themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
      setIsDarkMode(container.themeService.isDarkMode());
    });

    return unsubscribe;
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    container.themeService.setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (currentTheme === 'auto') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (isDarkMode) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'auto': return 'Automático';
      default: return 'Automático';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="glass p-3 rounded-xl hover:scale-105 transition-all duration-300 group"
      title={`Tema atual: ${getThemeLabel()}`}
    >
      <div className="flex items-center space-x-2">
        <div className="text-white group-hover:rotate-180 transition-transform duration-500">
          {getThemeIcon()}
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">
          {getThemeLabel()}
        </span>
      </div>
    </button>
  );
}
