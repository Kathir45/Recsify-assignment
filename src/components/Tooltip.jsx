import { useEffect, useRef } from 'react';

export default function Tooltip({ nodeData, position, visible }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (visible && tooltipRef.current && position) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let left = position.x + 10;
      let top = position.y - 10;

      // Keep tooltip within viewport
      if (left + tooltipRect.width > window.innerWidth) {
        left = position.x - tooltipRect.width - 10;
      }
      if (top < 0) {
        top = position.y + 30;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  }, [position, visible]);

  if (!visible || !nodeData) return null;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none transition-opacity"
      style={{
        left: position?.x || 0,
        top: position?.y || 0
      }}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-lg shadow-2xl border border-white/10 backdrop-blur-sm max-w-xs p-4">
        {/* Node Label */}
        <div className="font-semibold text-white mb-1 text-sm">
          {nodeData.label}
        </div>
        
        {/* Node Type */}
        {nodeData.type && (
          <div className="text-blue-300 text-xs mb-2 font-medium">
            Type: {nodeData.type}
          </div>
        )}
        
        {/* Summary */}
        {nodeData.summary && (
          <div className="text-gray-300 text-xs leading-relaxed">
            {nodeData.summary.length > 150 
              ? nodeData.summary.substring(0, 150) + '...' 
              : nodeData.summary}
          </div>
        )}
        
        {/* Hint */}
        <div className="mt-2 pt-2 border-t border-white/10 text-green-300 text-xs font-medium">
          Click for full details
        </div>
      </div>
    </div>
  );
}
