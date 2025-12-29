import { useState, useEffect } from 'react';

/**
 * Custom hook for theme management
 * @returns {Object} Theme state and toggle function
 */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindmap-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('mindmap-theme', newTheme);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}
