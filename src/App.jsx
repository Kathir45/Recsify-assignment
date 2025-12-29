import { useState, useRef, useEffect } from 'react';
import MindmapCanvas from './components/MindmapCanvas';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import ThemeSelector from './components/ThemeSelector';
import Tooltip from './components/Tooltip';
import ContextMenu from './components/ContextMenu';
import EditNodeDialog from './components/EditNodeDialog';
import SearchBar from './components/SearchBar';
import LayoutSelector from './components/LayoutSelector';
import KeyboardHelp from './components/KeyboardHelp';
import MiniMap from './components/MiniMap';
import { useMindmap } from './hooks/useMindmap';
import { useTheme } from './hooks/useTheme';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    nodeData: null,
    position: null
  });
  
  const cyRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  
  const {
    selectedNode,
    isLoading: mindmapLoading,
    contextMenu,
    editingNode,
    currentLayout,
    handleNodeClick,
    handleNodeHover,
    handleNodeUnhover,
    expandAll,
    collapseAll,
    fitView,
    resetView,
    zoomIn,
    zoomOut,
    showContextMenu,
    hideContextMenu,
    startEditNode,
    saveEditedNode,
    cancelEditNode,
    deleteNode,
    toggleNodeExpansion,
    expandSingleNode,
    changeLayout
  } = useMindmap(cyRef, data);

  // Load data from JSON
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/data/mindmap-data.json');
        if (!response.ok) {
          throw new Error('Failed to load mindmap data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Handle node hover for tooltip
  const handleTooltipShow = (nodeData, event) => {
    handleNodeHover(nodeData);
    
    if (event && event.renderedPosition) {
      const containerRect = cyRef.current?.container()?.getBoundingClientRect();
      if (containerRect) {
        setTooltipState({
          visible: true,
          nodeData,
          position: {
            x: event.renderedPosition.x + containerRect.left,
            y: event.renderedPosition.y + containerRect.top
          }
        });
      }
    }
  };

  const handleTooltipHide = () => {
    handleNodeUnhover();
    setTooltipState({
      visible: false,
      nodeData: null,
      position: null
    });
  };

  // Handle double-click to expand single node
  const handleNodeDoubleClick = (nodeData) => {
    if (nodeData) {
      expandSingleNode(nodeData.id);
    }
  };

  // Handle search result selection
  const handleSearchResult = (nodeData) => {
    handleNodeClick(nodeData);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key.toLowerCase()) {
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            document.querySelector('input[placeholder="Search nodes..."]')?.focus();
          }
          break;
        case 'r':
          e.preventDefault();
          resetView();
          break;
        case 'e':
          e.preventDefault();
          expandAll();
          break;
        case 'c':
          e.preventDefault();
          collapseAll();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomOut();
          break;
        case 'escape':
          hideContextMenu();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expandAll, collapseAll, resetView, zoomIn, zoomOut, hideContextMenu]);

  // Export as PNG
  const handleExportPNG = () => {
    if (!cyRef.current) return;
    
    const cy = cyRef.current;
    const png = cy.png({
      output: 'blob',
      bg: theme === 'dark' ? '#1a202c' : '#ffffff',
      full: true,
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = 'mindmap-export.png';
    link.href = URL.createObjectURL(png);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Export JSON data
  const handleExportJSON = () => {
    if (!data) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'mindmap-data.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Context menu actions
  const contextMenuActions = [
    {
      label: 'Edit Node',
      icon: '✏️',
      onClick: (node) => startEditNode(node),
      disabled: false
    },
    {
      label: 'Expand/Collapse',
      icon: '🔽',
      onClick: (node) => toggleNodeExpansion(node.id),
      disabled: false
    },
    {
      label: 'Focus Node',
      icon: '🎯',
      onClick: (node) => {
        if (cyRef.current) {
          const cy = cyRef.current;
          const cyNode = cy.getElementById(node.id);
          if (cyNode.length > 0) {
            cy.animate({
              center: { eles: cyNode },
              zoom: 1.5
            }, {
              duration: 500
            });
          }
        }
      },
      disabled: false
    },
    {
      label: 'Delete Node',
      icon: '🗑️',
      onClick: (node) => {
        if (confirm(`Are you sure you want to delete "${node.label}"?`)) {
          deleteNode(node.id);
        }
      },
      disabled: false
    }
  ];

  // Loading State
  if (loading || mindmapLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading mindmap...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading data</p>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side: Graph Canvas (70%) */}
      <div className="relative w-[70%] h-screen border-r-2 border-gray-300 dark:border-gray-700">
        {/* Search Bar */}
        <div className="absolute top-6 right-6 z-20">
          <SearchBar cyRef={cyRef} onSearchResult={handleSearchResult} />
        </div>

        {/* Controls */}
        <div className="absolute top-6 left-6 z-10 max-w-[calc(100%-400px)]">
          <div className="flex flex-wrap gap-2">
            <Controls
              onExpandAll={expandAll}
              onCollapseAll={collapseAll}
              onFitView={fitView}
              onResetView={resetView}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onExportPNG={handleExportPNG}
              onExportJSON={handleExportJSON}
              isLoading={mindmapLoading}
            />
            <LayoutSelector 
              currentLayout={currentLayout}
              onLayoutChange={changeLayout}
            />
            <KeyboardHelp />
          </div>
        </div>

        {/* Mindmap Canvas */}
        <MindmapCanvas
          data={data}
          onNodeClick={handleNodeClick}
          onNodeHover={handleTooltipShow}
          onNodeUnhover={handleTooltipHide}
          onNodeRightClick={showContextMenu}
          onNodeDoubleClick={handleNodeDoubleClick}
          cyRef={cyRef}
        />

        {/* Tooltip */}
        <Tooltip
          nodeData={tooltipState.nodeData}
          position={tooltipState.position}
          visible={tooltipState.visible}
        />

        {/* Context Menu */}
        <ContextMenu
          visible={contextMenu.visible}
          position={contextMenu.position}
          targetNode={contextMenu.targetNode}
          actions={contextMenuActions}
          onClose={hideContextMenu}
        />

        {/* Edit Node Dialog */}
        <EditNodeDialog
          visible={editingNode !== null}
          node={editingNode}
          onSave={saveEditedNode}
          onCancel={cancelEditNode}
        />

        {/* Mini-Map */}
        <MiniMap cyRef={cyRef} />
      </div>

      {/* Right Side: Sidebar (30%) */}
      <div className="w-[30%] h-screen flex flex-col">
        <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <ThemeSelector />
        </div>
        <div className="flex-1 overflow-auto">
          <Sidebar 
            selectedNode={selectedNode} 
            metadata={data?.metadata}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
