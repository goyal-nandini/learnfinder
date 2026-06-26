import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoginPrompt from '../components/LoginPrompt.jsx';

const Path = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicFromUrl = searchParams.get('topic');
    const [topic, setTopic] = useState(topicFromUrl || '');
    const [path, setPath] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setError('');
        setPath(null);
        setSaved(false);

        try {
            const res = await api.post('/path', { topic });
            setPath(res.data.path);
        } catch (err) {
            setError('Failed to generate path. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // auto generate if topic came from URL
    useEffect(() => {
        if (topicFromUrl) handleGenerate();
    }, []);

    const handleSave = async () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        setSaving(true);
        try {
            await api.post('/savedpath', { topic, weeks: path });
            setSaved(true);
        } catch (err) {
            if (err.response?.data?.error === 'Path already saved') {
                setSaved(true);
            } else {
                setError('Failed to save path.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Hero */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Generate a Learning Path
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                    Get a structured 4-week plan for any topic
                </p>

                <div className="flex gap-3 max-w-xl mx-auto">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g. Machine Learning, React, System Design..."
                        className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition"
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-center mb-6">{error}</p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Path result */}
                {!loading && path && (
                    <>
                        {/* Save button */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                Your 4-Week Plan for <span className="text-emerald-600">"{topic}"</span>
                            </h2>
                            <button
                                onClick={handleSave}
                                disabled={saving || saved}
                                className={`text-sm px-5 py-2 rounded-xl font-medium transition ${saved
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
                                    }`}
                            >
                                {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Path'}
                            </button>
                        </div>

                        {/* Week cards */}
                        <div className="space-y-4">
                            {path.map((week) => (
                                <div key={week.week} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">

                                    {/* Week header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Week {week.week}
                                        </span>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{week.focus}</h3>
                                    </div>

                                    {/* Goal */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        🎯 <span className="font-medium">Goal:</span> {week.goal}
                                    </p>

                                    {/* Resources */}
                                    <div className="space-y-2">
                                        {week.resources.map((resource, i) => (
                                            <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{resource.title}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{resource.type}</p>
                                                </div>
                                                <a
                                                    href={resource.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-emerald-600 hover:underline"
                                                >
                                                    Visit →
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Empty state */}
                {!loading && !path && !error && (
                    <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                        <p className="text-5xl mb-4">🗺️</p>
                        <p className="text-lg">Enter a topic to generate your learning path</p>
                    </div>
                )}
            </div>

            {showLoginPrompt && (
                <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
            )}
        </div>
    );
};

export default Path;