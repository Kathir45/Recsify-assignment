import { useState } from 'react';

export default function EditNodeDialog({ node, onSave, onCancel, visible }) {
  const [label, setLabel] = useState(node?.label || '');
  const [summary, setSummary] = useState(node?.summary || '');
  const [details, setDetails] = useState(node?.details || '');

  const handleSave = () => {
    onSave({
      ...node,
      label,
      summary,
      details
    });
  };

  if (!visible || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary-dark border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Node</h2>
          <p className="text-sm text-white/80 mt-1">Modify node information</p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {/* Node ID (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Node ID
              </label>
              <input
                type="text"
                value={node.id}
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Label *
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100"
                placeholder="Enter node label"
              />
            </div>

            {/* Type (read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <input
                type="text"
                value={node.type}
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
                placeholder="Brief summary for tooltip"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detailed Information
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
                placeholder="Full description for sidebar"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
