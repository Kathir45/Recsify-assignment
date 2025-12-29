import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const MiniMap = ({ cyRef }) => {
  const miniMapRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const miniCyRef = useRef(null);

  useEffect(() => {
    if (!cyRef.current || !miniMapRef.current || !isVisible) return;

    const cy = cyRef.current;
    
    // Create mini cytoscape instance
    const miniCy = cytoscape({
      container: miniMapRef.current,
      elements: cy.json().elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6366f1',
            'width': 8,
            'height': 8,
            'label': ''
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#94a3b8',
            'target-arrow-shape': 'none'
          }
        }
      ],
      layout: {
        name: 'preset',
        positions: (node) => {
          const originalNode = cy.getElementById(node.id());
          return originalNode.position();
        }
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true
    });

    miniCy.fit();
    miniCy.center();
    miniCyRef.current = miniCy;

    // Draw viewport rectangle
    const updateViewport = () => {
      const extent = cy.extent();
      const pan = cy.pan();
      const zoom = cy.zoom();
      
      // Remove old viewport overlay
      miniCy.$('.viewport-indicator').remove();
      
      // Calculate viewport bounds in model coordinates
      const viewportBounds = {
        x1: (0 - pan.x) / zoom,
        y1: (0 - pan.y) / zoom,
        x2: (cy.width() - pan.x) / zoom,
        y2: (cy.height() - pan.y) / zoom
      };
      
      // Create viewport indicator node
      const centerX = (viewportBounds.x1 + viewportBounds.x2) / 2;
      const centerY = (viewportBounds.y1 + viewportBounds.y2) / 2;
      
      miniCy.add({
        group: 'nodes',
        data: { id: 'viewport-indicator' },
        position: { x: centerX, y: centerY },
        classes: 'viewport-indicator',
        selectable: false,
        grabbable: false
      });
      
      miniCy.style()
        .selector('.viewport-indicator')
        .style({
          'shape': 'rectangle',
          'width': Math.abs(viewportBounds.x2 - viewportBounds.x1),
          'height': Math.abs(viewportBounds.y2 - viewportBounds.y1),
          'background-color': 'rgba(99, 102, 241, 0.2)',
          'border-width': 2,
          'border-color': '#6366f1',
          'border-opacity': 0.8
        })
        .update();
    };

    updateViewport();
    
    // Update on pan/zoom
    cy.on('pan zoom', updateViewport);
    cy.on('add remove', () => {
      miniCy.json({ elements: cy.json().elements });
      miniCy.fit();
      updateViewport();
    });

    // Click on minimap to pan main view
    miniMapRef.current.addEventListener('click', (e) => {
      if (!miniCyRef.current) return;
      
      const rect = miniMapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const modelPos = miniCyRef.current.renderer().projectIntoViewport(x, y);
      const pan = cy.pan();
      const zoom = cy.zoom();
      
      cy.animate({
        pan: {
          x: -modelPos[0] * zoom + cy.width() / 2,
          y: -modelPos[1] * zoom + cy.height() / 2
        },
        duration: 300,
        easing: 'ease-out'
      });
    });

    return () => {
      if (miniCy && !miniCy.destroyed()) {
        miniCy.destroy();
      }
      cy.off('pan zoom', updateViewport);
    };
  }, [cyRef, isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="absolute bottom-6 right-6 z-10 p-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        title="Show mini-map"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Mini-Map
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Hide mini-map"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div
        ref={miniMapRef}
        className="w-48 h-48 cursor-pointer bg-gray-50 dark:bg-gray-900"
        style={{ touchAction: 'none' }}
      />
      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Click to navigate
        </p>
      </div>
    </div>
  );
};

export default MiniMap;
