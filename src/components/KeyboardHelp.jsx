import { useState } from 'react';

const KeyboardHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl/Cmd + F', action: 'Focus search bar' },
    { keys: 'R', action: 'Reset view' },
    { keys: 'E', action: 'Expand all nodes' },
    { keys: 'C', action: 'Collapse all nodes' },
    { keys: '+/=', action: 'Zoom in' },
    { keys: '-/_', action: 'Zoom out' },
    { keys: 'Escape', action: 'Close menus' },
    { keys: 'Double-click', action: 'Expand single node' },
    { keys: 'Right-click', action: 'Context menu' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        title="Keyboard shortcuts"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="hidden md:inline">Help</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shortcut.action}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Drag nodes to reposition them. Use the mouse wheel to zoom, and drag the canvas to pan.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardHelp;
