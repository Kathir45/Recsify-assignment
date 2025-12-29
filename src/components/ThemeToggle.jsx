export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-20 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:scale-110 transition-all hover:shadow-xl"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}
