import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const UserIcon = getIcon('User');
const LogOutIcon = getIcon('LogOut');

const Header = () => {
  const { darkMode, toggleDarkMode, isAuthenticated, logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);

  return (
    <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          TaskFlow
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user?.firstName?.[0] || <UserIcon className="w-5 h-5" />}
                  </div>
                  <span className="hidden md:block text-surface-800 dark:text-surface-200">
                    {user?.firstName || 'User'}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 truncate">{user?.emailAddress}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-surface-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;