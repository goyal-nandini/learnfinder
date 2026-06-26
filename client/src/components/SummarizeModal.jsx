import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const SummarizeModal = ({ resource, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.post('/summarize', {
          title: resource.title,
          type: resource.type,
          difficulty: resource.difficulty,
        });
        setSummary(res.data.summary);
        setError('');
      } catch (err) {
        setError('Failed to summarize. Try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">{resource.title}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{resource.type} · {resource.difficulty}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Summary content */}
        {summary && (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-600 mb-1">What you'll learn</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{summary.what_you_learn}</p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-600 mb-1">Best for</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{summary.best_for}</p>
            </div>

            <div className="flex gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex-1">
                <p className="text-xs font-semibold text-green-600 mb-1">Time commitment</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">{summary.time_commitment}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 flex-1">
                <p className="text-xs font-semibold text-orange-600 mb-1">Prerequisite</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">{summary.prerequisite}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <button
            onClick={onClose}
            className="w-full mt-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default SummarizeModal;