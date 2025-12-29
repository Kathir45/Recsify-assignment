import { useState, useEffect } from 'react';

export default function SearchBar({ cyRef, onSearchResult }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!cyRef.current || !searchTerm.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const cy = cyRef.current;
    const term = searchTerm.toLowerCase();
    
    // Search in node labels and summaries
    const matchingNodes = cy.nodes().filter(node => {
      const label = node.data('label')?.toLowerCase() || '';
      const summary = node.data('summary')?.toLowerCase() || '';
      return label.includes(term) || summary.includes(term);
    });

    const nodeResults = matchingNodes.map(node => ({
      id: node.data('id'),
      label: node.data('label'),
      type: node.data('type'),
      summary: node.data('summary')
    }));

    setResults(nodeResults);
    setShowResults(nodeResults.length > 0);
  }, [searchTerm, cyRef]);

  const handleSelectResult = (nodeId) => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);

    if (node.length > 0) {
      // Clear previous highlights
      cy.elements().removeClass('highlighted dimmed');
      
      // Highlight the node
      node.addClass('highlighted');
      
      // Zoom to node
      cy.animate({
        center: { eles: node },
        zoom: 1.5
      }, {
        duration: 500
      });

      // Notify parent
      onSearchResult?.(node.data());
    }

    setSearchTerm('');
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
    
    if (cyRef.current) {
      cyRef.current.elements().removeClass('highlighted dimmed');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg shadow-md px-4 py-2">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search nodes..."
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-sm min-w-[200px]"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto z-50 animate-fadeIn">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-medium">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectResult(result.id)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {result.label}
                </div>
                {result.type && (
                  <span className="text-xs text-primary font-medium">
                    {result.type}
                  </span>
                )}
                {result.summary && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {result.summary}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
