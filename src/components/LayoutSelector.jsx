import { useState } from 'react';

export default function LayoutSelector({ onLayoutChange, currentLayout = 'dagre' }) {
  const [isOpen, setIsOpen] = useState(false);

  const layouts = [
    { id: 'dagre', name: 'Hierarchical (Dagre)', icon: '🌳', description: 'Top-down tree layout' },
    { id: 'breadthfirst', name: 'Breadth First', icon: '📊', description: 'Level-by-level layout' },
    { id: 'circle', name: 'Circle', icon: '⭕', description: 'Circular arrangement' },
    { id: 'grid', name: 'Grid', icon: '⬜', description: 'Grid arrangement' },
    { id: 'concentric', name: 'Concentric', icon: '🎯', description: 'Concentric circles' },
    { id: 'cose', name: 'Force-Directed', icon: '🔮', description: 'Physics-based layout' }
  ];

  const handleSelect = (layoutId) => {
    onLayoutChange(layoutId);
    setIsOpen(false);
  };

  const currentLayoutInfo = layouts.find(l => l.id === currentLayout) || layouts[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all hover:shadow-lg text-sm font-medium flex items-center gap-2"
        title="Change layout algorithm"
      >
        <span>{currentLayoutInfo.icon}</span>
        <span>Layout</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[250px] z-50 animate-fadeIn">
          <div className="p-2">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleSelect(layout.id)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  layout.id === currentLayout
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{layout.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{layout.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {layout.description}
                    </div>
                  </div>
                  {layout.id === currentLayout && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
