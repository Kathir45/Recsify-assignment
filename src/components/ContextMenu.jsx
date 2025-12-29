import { useEffect, useRef } from 'react';

export default function ContextMenu({ visible, position, onClose, actions, targetNode }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible || !position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[220px] overflow-hidden animate-fadeIn"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            action.onClick(targetNode);
            onClose();
          }}
          disabled={action.disabled}
          className={`
            w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3
            ${action.danger 
              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
            ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}
          `}
        >
          {action.icon && <span className="text-lg">{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
