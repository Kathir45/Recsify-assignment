export default function Controls({
  onExpandAll,
  onCollapseAll,
  onFitView,
  onResetView,
  onZoomIn,
  onZoomOut,
  onExportPNG,
  onExportJSON,
  isLoading
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Expand/Collapse */}
      <button
        onClick={onExpandAll}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        title="Expand all nodes"
      >
        Expand All
      </button>
      
      <button
        onClick={onCollapseAll}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        title="Collapse all nodes"
      >
        Collapse All
      </button>

      {/* View Controls */}
      <button
        onClick={onFitView}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-md hover:bg-cyan-600 transition-all hover:shadow-lg text-sm font-medium"
        title="Fit view to visible nodes"
      >
        Fit View
      </button>

      <button
        onClick={onResetView}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-md hover:bg-cyan-600 transition-all hover:shadow-lg text-sm font-medium"
        title="Reset view to default"
      >
        Reset View
      </button>

      {/* Zoom Controls */}
      <div className="flex gap-1 bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <button
          onClick={onZoomOut}
          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 font-bold"
          title="Zoom out"
        >
          −
        </button>
        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
        <button
          onClick={onZoomIn}
          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 font-bold"
          title="Zoom in"
        >
          +
        </button>
      </div>

      {/* Export Controls */}
      <div className="flex gap-1 bg-green-500 rounded-lg shadow-md overflow-hidden">
        <button
          onClick={onExportPNG}
          className="px-4 py-2 hover:bg-green-600 transition-colors text-white text-sm font-medium"
          title="Export as PNG image"
        >
          📷 PNG
        </button>
        <div className="w-px bg-green-600"></div>
        <button
          onClick={onExportJSON}
          className="px-4 py-2 hover:bg-green-600 transition-colors text-white text-sm font-medium"
          title="Download JSON data"
        >
          💾 JSON
        </button>
      </div>
    </div>
  );
}
