import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          Job<span className="text-blue-400">Board</span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-colors ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            Browse Jobs
          </NavLink>

          {user ? (
            <>
              {user.role === 'employer' && (
                <Link to="/post-job" className="btn-primary text-sm">
                  + Post a Job
                </Link>
              )}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-colors ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
                }
              >
                Dashboard
              </NavLink>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700">
                <span className="text-slate-400 text-xs">Hi, {user.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-colors ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
                }
              >
                Login
              </NavLink>
              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
