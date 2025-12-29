import { useState, useEffect } from 'react';

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('auto');

  const themes = [
    { value: 'auto', label: 'Auto', icon: '🌓' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'ocean', label: 'Ocean', icon: '🌊' },
    { value: 'forest', label: 'Forest', icon: '🌲' },
    { value: 'sunset', label: 'Sunset', icon: '🌅' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('mindmap-theme') || 'auto';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'theme-ocean', 'theme-forest', 'theme-sunset');
    
    switch(theme) {
      case 'auto':
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        }
        break;
      case 'light':
        // No class needed
        break;
      case 'dark':
        root.classList.add('dark');
        break;
      case 'ocean':
        root.classList.add('dark', 'theme-ocean');
        root.style.setProperty('--color-primary', '#0ea5e9');
        root.style.setProperty('--color-secondary', '#0c4a6e');
        break;
      case 'forest':
        root.classList.add('dark', 'theme-forest');
        root.style.setProperty('--color-primary', '#22c55e');
        root.style.setProperty('--color-secondary', '#14532d');
        break;
      case 'sunset':
        root.classList.add('dark', 'theme-sunset');
        root.style.setProperty('--color-primary', '#f97316');
        root.style.setProperty('--color-secondary', '#7c2d12');
        break;
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('mindmap-theme', theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const getCurrentTheme = () => {
    return themes.find(t => t.value === currentTheme) || themes[0];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
        title="Change theme"
      >
        <span className="text-xl">{getCurrentTheme().icon}</span>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {getCurrentTheme().label}
        </span>
        <svg 
          className="w-4 h-4 text-gray-500 dark:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-20 overflow-hidden">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3 ${
                  currentTheme === theme.value ? 'bg-indigo-50 dark:bg-indigo-900' : ''
                }`}
              >
                <span className="text-xl">{theme.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme.label}
                </span>
                {currentTheme === theme.value && (
                  <svg 
                    className="w-4 h-4 ml-auto text-indigo-600 dark:text-indigo-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
