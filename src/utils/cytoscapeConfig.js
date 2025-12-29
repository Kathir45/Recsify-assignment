/**
 * Cytoscape.js Configuration
 * Defines the visual styles and layout settings for the mindmap graph
 */

export const cytoscapeStyles = [
  // Base node styles
  {
    selector: 'node',
    style: {
      'background-color': '#66BB6A',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#ffffff',
      'font-size': '11px',
      'font-weight': '600',
      'font-family': 'Inter, sans-serif',
      'width': '85px',
      'height': '85px',
      'border-width': '2px',
      'border-color': '#4CAF50',
      'text-wrap': 'wrap',
      'text-max-width': '75px',
      'shape': 'round-rectangle',
      'transition-property': 'background-color, border-color, border-width',
      'transition-duration': '0.3s'
    }
  },

  // Type-specific node styles
  {
    selector: 'node[type="root"]',
    style: {
      'background-color': '#667eea',
      'border-color': '#5a6fd8',
      'width': '110px',
      'height': '110px',
      'font-size': '13px',
      'font-weight': 'bold',
      'border-width': '3px'
    }
  },
  {
    selector: 'node[type="category"]',
    style: {
      'background-color': '#FF9800',
      'border-color': '#F57C00',
      'width': '95px',
      'height': '95px',
      'font-size': '12px'
    }
  },
  {
    selector: 'node[type="subcategory"]',
    style: {
      'background-color': '#2196F3',
      'border-color': '#1976D2',
      'width': '90px',
      'height': '90px'
    }
  },
  {
    selector: 'node[type="vitamin"]',
    style: {
      'background-color': '#9C27B0',
      'border-color': '#7B1FA2',
      'shape': 'ellipse'
    }
  },
  {
    selector: 'node[type="role"]',
    style: {
      'background-color': '#00BCD4',
      'border-color': '#0097A7'
    }
  },
  {
    selector: 'node[type="source"]',
    style: {
      'background-color': '#4CAF50',
      'border-color': '#388E3C'
    }
  },
  {
    selector: 'node[type="impact"]',
    style: {
      'background-color': '#FF5722',
      'border-color': '#D84315'
    }
  },

  // Node states
  {
    selector: 'node:selected',
    style: {
      'border-width': '4px',
      'border-color': '#FFD700',
      'background-color': 'data(bgColor)',
      'z-index': 100
    }
  },
  {
    selector: 'node.highlighted',
    style: {
      'border-width': '4px',
      'border-color': '#FFD700',
      'z-index': 50
    }
  },
  {
    selector: 'node.dimmed',
    style: {
      'opacity': 0.3
    }
  },

  // Edge styles
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#CBD5E0',
      'target-arrow-color': '#CBD5E0',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'arrow-scale': 1,
      'transition-property': 'line-color, width',
      'transition-duration': '0.3s'
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'width': 3,
      'line-color': '#667eea',
      'target-arrow-color': '#667eea',
      'z-index': 100
    }
  },
  {
    selector: 'edge.highlighted',
    style: {
      'width': 3,
      'line-color': '#FFD700',
      'target-arrow-color': '#FFD700',
      'z-index': 50
    }
  },
  {
    selector: 'edge.dimmed',
    style: {
      'opacity': 0.2
    }
  },

  // Hidden elements
  {
    selector: '.hidden',
    style: {
      'display': 'none'
    }
  }
];

export const layoutOptions = {
  name: 'dagre',
  rankDir: 'TB', // Top to Bottom
  nodeSep: 80,
  rankSep: 100,
  animate: true,
  animationDuration: 500,
  animationEasing: 'ease-out-cubic',
  fit: true,
  padding: 50
};

export const cytoscapeConfig = {
  minZoom: 0.1,
  maxZoom: 3,
  zoomingEnabled: true,
  panningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: 'single',
  autoungrabify: false, // Enable node dragging
  autounselectify: false
};

export const layoutConfigs = {
  dagre: {
    name: 'dagre',
    rankDir: 'TB',
    nodeSep: 80,
    rankSep: 100,
    animate: true,
    animationDuration: 500,
    animationEasing: 'ease-out-cubic',
    fit: true,
    padding: 50
  },
  breadthfirst: {
    name: 'breadthfirst',
    directed: true,
    spacingFactor: 1.5,
    animate: true,
    animationDuration: 500,
    fit: true,
    padding: 50
  },
  circle: {
    name: 'circle',
    animate: true,
    animationDuration: 500,
    fit: true,
    padding: 50,
    spacingFactor: 1.2
  },
  grid: {
    name: 'grid',
    animate: true,
    animationDuration: 500,
    fit: true,
    padding: 50,
    spacingFactor: 1.5
  },
  concentric: {
    name: 'concentric',
    animate: true,
    animationDuration: 500,
    fit: true,
    padding: 50,
    spacingFactor: 1.5,
    minNodeSpacing: 80
  },
  cose: {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 50,
    nodeRepulsion: 400000,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    nestingFactor: 5
  }
};
