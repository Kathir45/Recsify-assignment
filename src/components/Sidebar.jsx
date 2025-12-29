export default function Sidebar({ selectedNode, metadata }) {
  if (!selectedNode) {
    return (
      <div className="h-full bg-gray-100 dark:bg-gray-800 p-6 overflow-y-auto">
        {/* Project Header */}
        <div className="mb-6 p-4 bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-md">
          <h1 className="text-xl font-semibold text-white mb-1">
            {metadata?.title || 'Interactive Mindmap'}
          </h1>
          <p className="text-sm text-white/90">
            {metadata?.description || 'Click on a node to see details'}
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-3">
            <svg 
              className="w-16 h-16 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No Node Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click on any node in the mindmap to view its details, summary, and related information.
          </p>
        </div>

        {/* Stats */}
        {metadata && (
          <div className="mt-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Mindmap Statistics
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Nodes:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {metadata.nodeCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {metadata.contentType || 'mindmap'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 p-6 overflow-y-auto">
      {/* Project Header */}
      <div className="mb-6 p-4 bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-white mb-1">
          {metadata?.title || 'Interactive Mindmap'}
        </h1>
        <p className="text-sm text-white/90">
          Node Details
        </p>
      </div>

      {/* Node Details Card */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-5 mb-4 transition-all hover:shadow-lg">
        {/* Node Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {selectedNode.label}
          </h2>
          {selectedNode.type && (
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {selectedNode.type}
            </span>
          )}
        </div>

        {/* Summary Section */}
        {selectedNode.summary && (
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Summary
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {selectedNode.summary}
            </p>
          </div>
        )}

        {/* Detailed Information */}
        {selectedNode.details && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Detailed Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedNode.details}
              </p>
            </div>
          </div>
        )}

        {/* Node ID for reference */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Node ID:</span>
            <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
              {selectedNode.id}
            </code>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Tips
        </h4>
        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Hover over nodes to see quick summaries</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use mouse wheel to zoom in/out</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Drag to pan around the mindmap</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Click background to deselect nodes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
