import { useState } from 'react';
import SummarizeModal from './SummarizeModal.jsx';

const difficultyStyles = {
  beginner:
    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',

  intermediate:
    'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',

  advanced:
    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
};

const typeIcons = {
  video: '🎥',
  article: '📄',
  course: '🎓',
  book: '📚',
};

const ResourceCard = ({ resource, onSave, isSaved }) => {
  const [showSummarize, setShowSummarize] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition">

        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">
            {resource.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${difficultyStyles[resource.difficulty] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
            {resource.difficulty}
          </span>
        </div>

        {/* Type */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {typeIcons[resource.type] || '🔗'} {resource.type}
        </p>

        {/* Why recommended */}
        <p className="text-xs text-gray-500 dark:text-gray-400 italic flex-1">
          "{resource.why_recommended}"
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700">
        <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer" // If someone asks: Why did you use rel="noopener noreferrer"? 
            // A strong answer is: "Since links open in a new tab using target="_blank", 
            // I added rel="noopener noreferrer" to prevent the new page from accessing the original page 
            // through window.opener and to avoid leaking referrer information. It's a standard security best practice."
            className="text-xs text-emerald-600 hover:underline font-medium"
          >
            Visit →
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSummarize(true)}
              className="text-xs px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Summarize
            </button>
            <button
              onClick={() => onSave(resource)}
              disabled={isSaved}
              className={`text-xs px-3 py-1 rounded-lg transition ${
                isSaved
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              {isSaved ? 'Saved ✓' : '+ Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Summarize modal */}
      {showSummarize && (
        <SummarizeModal
          resource={resource}
          onClose={() => setShowSummarize(false)}
        />
      )}
    </>
  );
};

export default ResourceCard;