import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { cytoscapeStyles, layoutOptions, cytoscapeConfig } from '../utils/cytoscapeConfig';
import { processArchitectureData } from '../utils/dataProcessor';

// Register dagre layout
cytoscape.use(dagre);

export default function MindmapCanvas({ 
  data, 
  onNodeClick, 
  onNodeHover, 
  onNodeUnhover,
  onNodeRightClick,
  onNodeDoubleClick,
  cyRef 
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    // Process data into Cytoscape format
    const { elements } = processArchitectureData(data);

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: cytoscapeStyles,
      layout: { name: 'grid' }, // Will be replaced with dagre
      ...cytoscapeConfig
    });

    // Store reference
    if (cyRef) {
      cyRef.current = cy;
    }

    // Event Handlers
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      onNodeClick?.(node.data());
    });

    // Double-click to expand single node
    cy.on('dbltap', 'node', (evt) => {
      const node = evt.target;
      onNodeDoubleClick?.(node.data());
    });

    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      onNodeHover?.(node.data(), evt);
    });

    cy.on('mouseout', 'node', () => {
      onNodeUnhover?.();
    });

    // Right-click context menu
    cy.on('cxttap', 'node', (evt) => {
      evt.preventDefault();
      const node = evt.target;
      const renderedPos = evt.renderedPosition;
      
      onNodeRightClick?.(node.data(), {
        x: renderedPos.x + containerRef.current.getBoundingClientRect().left,
        y: renderedPos.y + containerRef.current.getBoundingClientRect().top
      });
    });

    // Tap on background to clear selection
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted dimmed');
        onNodeClick?.(null);
      }
    });

    // Run layout after everything is set up
    setTimeout(() => {
      if (cy && !cy.destroyed()) {
        cy.layout(layoutOptions).run();
      }
    }, 100);

    // Cleanup
    return () => {
      if (cy && !cy.destroyed()) {
        cy.destroy();
      }
    };
  }, [data]); // Only re-run when data changes

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-50 dark:bg-gray-900"
      style={{
        backgroundImage: `
          linear-gradient(rgba(102, 126, 234, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(102, 126, 234, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}
    />
  );
}
