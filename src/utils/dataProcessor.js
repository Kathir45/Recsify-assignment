/**
 * Data Processor Utility
 * Transforms JSON data into Cytoscape-compatible format
 */

/**
 * Process architecture data into Cytoscape elements format
 * @param {Object} data - The mindmap data from JSON
 * @returns {Object} Processed elements with nodes and edges
 */
export function processArchitectureData(data) {
  if (!data || !data.nodes) {
    console.error('Invalid data structure');
    return { nodes: [], edges: [] };
  }

  const processedNodes = [];
  const nodeMap = new Map();

  // Process nodes
  data.nodes.forEach(node => {
    if (!node.id) return;
    
    nodeMap.set(node.id, true);
    
    processedNodes.push({
      group: 'nodes',
      data: {
        id: node.id,
        label: node.data?.label || node.id,
        type: node.data?.type || 'default',
        summary: node.data?.summary || '',
        details: node.data?.details || '',
        bgColor: getNodeColor(node.data?.type)
      },
      classes: node.data?.type || 'default'
    });
  });

  // Process edges
  const processedEdges = [];
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      if (!edge || !edge.source || !edge.target) return;

      // Auto-create missing nodes if referenced in edges
      [edge.source, edge.target].forEach(nodeId => {
        if (!nodeMap.has(nodeId)) {
          console.warn(`Auto-creating missing node: ${nodeId}`);
          nodeMap.set(nodeId, true);
          processedNodes.push({
            group: 'nodes',
            data: {
              id: nodeId,
              label: nodeId,
              type: 'default',
              summary: 'Auto-generated node',
              details: 'This node was inferred from edge connections.',
              bgColor: '#66BB6A'
            },
            classes: 'default'
          });
        }
      });

      processedEdges.push({
        group: 'edges',
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: edge.type || 'connects'
        }
      });
    });
  }

  return {
    nodes: processedNodes,
    edges: processedEdges,
    elements: [...processedNodes, ...processedEdges]
  };
}

/**
 * Get color for node based on type
 * @param {string} type - Node type
 * @returns {string} Color code
 */
function getNodeColor(type) {
  const colorMap = {
    'root': '#667eea',
    'category': '#FF9800',
    'subcategory': '#2196F3',
    'vitamin': '#9C27B0',
    'role': '#00BCD4',
    'source': '#4CAF50',
    'impact': '#FF5722',
    'default': '#66BB6A'
  };
  return colorMap[type] || colorMap.default;
}

/**
 * Get children of a node from hierarchy
 * @param {string} nodeId - Node ID
 * @param {Object} hierarchy - Hierarchy object
 * @returns {Array} Array of child node IDs
 */
export function getNodeChildren(nodeId, hierarchy) {
  if (!hierarchy || !hierarchy[nodeId]) return [];
  return hierarchy[nodeId] || [];
}

/**
 * Get all descendants of a node recursively
 * @param {string} nodeId - Node ID
 * @param {Object} hierarchy - Hierarchy object
 * @returns {Array} Array of all descendant node IDs
 */
export function getAllDescendants(nodeId, hierarchy) {
  const descendants = [];
  const children = getNodeChildren(nodeId, hierarchy);
  
  children.forEach(childId => {
    descendants.push(childId);
    descendants.push(...getAllDescendants(childId, hierarchy));
  });
  
  return descendants;
}

/**
 * Find root nodes (nodes with no parents in hierarchy)
 * @param {Object} hierarchy - Hierarchy object
 * @returns {Array} Array of root node IDs
 */
export function findRootNodes(hierarchy) {
  if (!hierarchy) return ['root'];
  return hierarchy.root || ['root'];
}

/**
 * Validate data structure
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result
 */
export function validateData(data) {
  const errors = [];
  const warnings = [];

  if (!data) {
    errors.push('Data is null or undefined');
    return { valid: false, errors, warnings };
  }

  if (!data.nodes || !Array.isArray(data.nodes)) {
    errors.push('Missing or invalid nodes array');
  }

  if (!data.edges || !Array.isArray(data.edges)) {
    warnings.push('Missing or invalid edges array');
  }

  if (!data.metadata) {
    warnings.push('Missing metadata');
  }

  // Check for duplicate node IDs
  const nodeIds = new Set();
  data.nodes?.forEach(node => {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
