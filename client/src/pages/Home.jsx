import { useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import LoginPrompt from '../components/LoginPrompt.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set()); // tracks which links are saved

  const handleSearch = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError('');
    setResources([]);

    try {
      const res = await api.post('/search', { topic });
      setResources(res.data.resources);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (resource) => {
    // not logged in — show prompt instead
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await api.post('/saved', { ...resource, savedFrom: 'search' });
      setSavedIds(prev => new Set(prev).add(resource.link)); // mark as saved
    } catch (err) {
      if (err.response?.data?.error === 'Already saved') {
        setSavedIds(prev => new Set(prev).add(resource.link));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Hero + Search */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Find Learning Resources with AI
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
          Enter any topic and get curated resources instantly
        </p>

        {/* Search bar */}
        <div className="flex gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. React hooks, System Design, SQL..."
            className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-6">{error}</p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Resource cards */}
        {!loading && resources.length > 0 && (
          <>
            {/* <p className="text-sm text-gray-500 mb-4">
              {resources.length} resources found for{' '}
              <span className="font-medium text-gray-700 dark:text-gray-200">"{topic}"</span>
            </p> */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {resources.length} resources found for{' '}
                <span className="font-medium text-gray-700 dark:text-gray-200">"{topic}"</span>
              </p>
              <Link
                to={`/path?topic=${encodeURIComponent(topic)}`}
                className="text-sm text-emerald-600 hover:underline font-medium"
              >
                Get structured learning path for "{topic}" →
              </Link>
            </div>
             
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  resource={resource}
                  onSave={handleSave}
                  isSaved={savedIds.has(resource.link)}
                />
              ))}
            </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
      ⚠️ Links are AI-generated suggestions — always verify before use
    </p>
          </>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">Search any topic to get started</p>
          </div>
        )}
      </div>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
};

export default Home;