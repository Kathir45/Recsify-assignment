import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing mindmap state and interactions
 * @param {Object} cyRef - Reference to Cytoscape instance
 * @param {Object} data - Mindmap data
 * @returns {Object} State and methods for mindmap management
 */
export function useMindmap(cyRef, data) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: null,
    targetNode: null
  });
  const [editingNode, setEditingNode] = useState(null);
  const [currentLayout, setCurrentLayout] = useState('dagre');

  // Initialize - expand all nodes by default for mindmap
  useEffect(() => {
    if (data?.metadata?.contentType === 'mindmap' && data?.nodes) {
      const allNodeIds = new Set(data.nodes.map(n => n.id));
      setExpandedNodes(allNodeIds);
    }
  }, [data]);

  /**
   * Handle node selection
   */
  const handleNodeClick = useCallback((nodeData) => {
    setSelectedNode(nodeData);
    
    // Highlight connected nodes
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().removeClass('highlighted dimmed');
      
      const node = cy.getElementById(nodeData.id);
      if (node.length > 0) {
        const connected = node.neighborhood();
        node.addClass('highlighted');
        connected.addClass('highlighted');
        
        // Dim unconnected nodes
        cy.elements().not(node).not(connected).addClass('dimmed');
      }
    }
  }, [cyRef]);

  /**
   * Handle node hover
   */
  const handleNodeHover = useCallback((nodeData) => {
    setHoveredNode(nodeData);
  }, []);

  /**
   * Clear hover state
   */
  const handleNodeUnhover = useCallback(() => {
    setHoveredNode(null);
  }, []);

  /**
   * Expand/Collapse a node
   */
  const toggleNodeExpansion = useCallback((nodeId) => {
    if (!cyRef.current || !data?.hierarchy) return;

    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);
    if (!node.length) return;

    const children = data.hierarchy[nodeId] || [];
    const isExpanded = expandedNodes.has(nodeId);

    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (isExpanded) {
        next.delete(nodeId);
        // Hide all descendants
        children.forEach(childId => {
          cy.getElementById(childId).addClass('hidden');
          const descendants = getAllDescendants(childId, data.hierarchy);
          descendants.forEach(descId => {
            cy.getElementById(descId).addClass('hidden');
          });
        });
      } else {
        next.add(nodeId);
        // Show direct children only
        children.forEach(childId => {
          cy.getElementById(childId).removeClass('hidden');
        });
      }
      return next;
    });

    // Re-run layout after visibility changes
    setTimeout(() => {
      cy.layout({ name: 'dagre', animate: true }).run();
    }, 50);
  }, [cyRef, data, expandedNodes]);

  /**
   * Expand a specific node only (for double-click)
   */
  const expandSingleNode = useCallback((nodeId) => {
    if (!cyRef.current || !data?.hierarchy) return;

    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);
    if (!node.length) return;

    const children = data.hierarchy[nodeId] || [];
    
    // Only expand if not already expanded
    if (!expandedNodes.has(nodeId) && children.length > 0) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        next.add(nodeId);
        
        // Show direct children only
        children.forEach(childId => {
          cy.getElementById(childId).removeClass('hidden');
        });
        
        return next;
      });

      // Re-run layout after visibility changes
      setTimeout(() => {
        cy.layout({ name: 'dagre', animate: true }).run();
      }, 50);
    }
  }, [cyRef, data, expandedNodes]);

  /**
   * Expand all nodes
   */
  const expandAll = useCallback(() => {
    if (!cyRef.current || !data?.nodes) return;
    
    const cy = cyRef.current;
    
    // Show all nodes
    cy.elements().removeClass('hidden');
    const allNodeIds = new Set(data.nodes.map(n => n.id));
    setExpandedNodes(allNodeIds);
    
    // Relayout immediately
    cy.layout({ name: 'dagre', animate: true, animationDuration: 300 }).run();
  }, [cyRef, data]);

  /**
   * Collapse all nodes (show only root)
   */
  const collapseAll = useCallback(() => {
    if (!cyRef.current || !data?.hierarchy) return;
    
    const cy = cyRef.current;
    const rootNodes = data.hierarchy.root || ['root'];
    
    // Hide all except root
    cy.elements('node').addClass('hidden');
    rootNodes.forEach(rootId => {
      cy.getElementById(rootId).removeClass('hidden');
    });
    
    setExpandedNodes(new Set());
    
    // Relayout immediately
    cy.layout({ name: 'dagre', animate: true, animationDuration: 300 }).run();
  }, [cyRef, data]);

  /**
   * Fit view to visible nodes
   */
  const fitView = useCallback(() => {
    if (!cyRef.current) return;
    cyRef.current.fit(cyRef.current.elements(':visible'), 50);
  }, [cyRef]);

  /**
   * Reset view to default zoom and position
   */
  const resetView = useCallback(() => {
    if (!cyRef.current) return;
    cyRef.current.reset();
    cyRef.current.fit(cyRef.current.elements(':visible'), 50);
  }, [cyRef]);

  /**
   * Clear selection and highlights
   */
  const clearSelection = useCallback(() => {
    setSelectedNode(null);
    if (cyRef.current) {
      cyRef.current.elements().removeClass('highlighted dimmed');
    }
  }, [cyRef]);

  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom(cy.zoom() * 1.2);
    cy.center();
  }, [cyRef]);

  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom(cy.zoom() * 0.8);
    cy.center();
  }, [cyRef]);

  /**
   * Show context menu
   */
  const showContextMenu = useCallback((nodeData, position) => {
    setContextMenu({
      visible: true,
      position,
      targetNode: nodeData
    });
  }, []);

  /**
   * Hide context menu
   */
  const hideContextMenu = useCallback(() => {
    setContextMenu({
      visible: false,
      position: null,
      targetNode: null
    });
  }, []);

  /**
   * Start editing a node
   */
  const startEditNode = useCallback((nodeData) => {
    setEditingNode(nodeData);
  }, []);

  /**
   * Save edited node
   */
  const saveEditedNode = useCallback((updatedNode) => {
    if (!cyRef.current) return;
    
    const cy = cyRef.current;
    const node = cy.getElementById(updatedNode.id);
    
    if (node.length > 0) {
      // Update node data
      node.data('label', updatedNode.label);
      node.data('summary', updatedNode.summary);
      node.data('details', updatedNode.details);
      
      // Update selected node if it's the same
      if (selectedNode?.id === updatedNode.id) {
        setSelectedNode(updatedNode);
      }
    }
    
    setEditingNode(null);
  }, [cyRef, selectedNode]);

  /**
   * Cancel editing
   */
  const cancelEditNode = useCallback(() => {
    setEditingNode(null);
  }, []);

  /**
   * Delete a node (remove from view)
   */
  const deleteNode = useCallback((nodeId) => {
    if (!cyRef.current) return;
    
    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);
    
    if (node.length > 0) {
      // Remove node and its edges
      node.remove();
      
      // Clear selection if deleted node was selected
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      
      // Re-run layout
      setTimeout(() => {
        cy.layout({ name: currentLayout, animate: true }).run();
      }, 50);
    }
  }, [cyRef, selectedNode, currentLayout]);

  /**
   * Change layout algorithm
   */
  const changeLayout = useCallback((layoutName) => {
    if (!cyRef.current) return;
    
    setCurrentLayout(layoutName);
    setIsLoading(true);
    
    const cy = cyRef.current;
    const layoutConfig = getLayoutConfig(layoutName);
    
    cy.layout(layoutConfig).run();
    
    setTimeout(() => {
      setIsLoading(false);
    }, layoutConfig.animationDuration || 500);
  }, [cyRef]);

  return {
    selectedNode,
    hoveredNode,
    expandedNodes,
    isLoading,
    contextMenu,
    editingNode,
    currentLayout,
    handleNodeClick,
    handleNodeHover,
    handleNodeUnhover,
    toggleNodeExpansion,
    expandSingleNode,
    expandAll,
    collapseAll,
    fitView,
    resetView,
    clearSelection,
    zoomIn,
    zoomOut,
    showContextMenu,
    hideContextMenu,
    startEditNode,
    saveEditedNode,
    cancelEditNode,
    deleteNode,
    changeLayout
  };
}

/**
 * Helper function to get all descendants recursively
 */
function getAllDescendants(nodeId, hierarchy) {
  const descendants = [];
  const children = hierarchy[nodeId] || [];
  
  children.forEach(childId => {
    descendants.push(childId);
    descendants.push(...getAllDescendants(childId, hierarchy));
  });
  
  return descendants;
}

/**
 * Get layout configuration
 */
function getLayoutConfig(layoutName) {
  const configs = {
    dagre: {
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 80,
      rankSep: 100,
      animate: true,
      animationDuration: 500,
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
      padding: 50
    },
    grid: {
      name: 'grid',
      animate: true,
      animationDuration: 500,
      fit: true,
      padding: 50
    },
    concentric: {
      name: 'concentric',
      animate: true,
      animationDuration: 500,
      fit: true,
      padding: 50
    },
    cose: {
      name: 'cose',
      animate: true,
      animationDuration: 1000,
      fit: true,
      padding: 50
    }
  };
  
  return configs[layoutName] || configs.dagre;
}
