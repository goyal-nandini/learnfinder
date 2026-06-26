import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-emerald-600 tracking-tight">
        LearnFinder
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
              onClick={toggle}
              className="text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {dark ? '☀️' : '🌙'}
            </button>
        {user ? (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">Hi, {user.name}</span>
            <Link
              to="/saved"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition"
            >
              Saved Items
            </Link>
            {/* <Link to="/path" className="text-sm text-gray-600 hover:text-emerald-600 transition">
              Learning Path
            </Link> */}
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            
            <Link
              to="/login"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition"            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
            
          </>
        )}
        
      </div>
    </nav>
  );
};

export default Navbar;