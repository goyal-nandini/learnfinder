import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <p className="text-3xl mb-3">🔒</p>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Login to save resources</h2>
        <p className="text-sm text-gray-500 mb-6">
          Create a free account to bookmark resources and build your personal learning list.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Maybe later
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Register free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;