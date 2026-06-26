import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const difficultyStyles = {
  beginner: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  intermediate: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  advanced: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
};

const typeIcons = {
  video: '🎥',
  article: '📄',
  course: '🎓',
  book: '📚',
};

const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const [resResources, resPaths] = await Promise.all([
        api.get('/saved'),
        api.get('/savedpath'),
      ]);
      setResources(resResources.data.resources);
      setPaths(resPaths.data.paths);
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/saved/${id}`);
      setResources(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePath = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/savedpath/${id}`);
      setPaths(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Saved Items</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'resources'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Resources {resources.length > 0 && `(${resources.length})`}
          </button>
          <button
            onClick={() => setActiveTab('paths')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'paths'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Learning Paths {paths.length > 0 && `(${paths.length})`}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Resources tab */}
        {activeTab === 'resources' && (
          <>
            {resources.length === 0 ? (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-lg mb-6">No saved resources yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition"
                >
                  Find resources
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {resources.map((resource) => (
                  <div key={resource._id} className="bg-white dark:bg-gray-900 border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">{resource.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${difficultyStyles[resource.difficulty] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{typeIcons[resource.type] || '🔗'} {resource.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic flex-1">"{resource.why_recommended}"</p>
                    <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700">
                      <a href={resource.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-emerald-600 hover:underline font-medium">
                        Visit →
                      </a>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        disabled={deletingId === resource._id}
                        className="text-xs px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        {deletingId === resource._id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Paths tab */}
        {activeTab === 'paths' && (
          <>
            {paths.length === 0 ? (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p className="text-5xl mb-4">🗺️</p>
                <p className="text-lg mb-6">No saved learning paths yet</p>
                <button
                  onClick={() => navigate('/path')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition"
                >
                  Generate a path
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {paths.map((path) => (
                  <div key={path._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">

                    {/* Path header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
                      <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg capitalize">{path.topic}</h2>
                      <button
                        onClick={() => handleDeletePath(path._id)}
                        disabled={deletingId === path._id}
                        className="text-xs px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        {deletingId === path._id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>

                    {/* Weeks */}
                    <div className="space-y-3">
                      {path.weeks.map((week) => (
                        <div key={week.week} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                              Week {week.week}
                            </span>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{week.focus}</h3>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">🎯 {week.goal}</p>
                          <div className="space-y-1">
                            {week.resources.map((r, i) => (
                              <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{r.title}</p>
                                <a href={r.link} target="_blank" rel="noopener noreferrer"
                                  className="text-xs text-emerald-600 hover:underline">
                                  Visit →
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Saved;