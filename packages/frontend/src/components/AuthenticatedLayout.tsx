import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiTemplate, HiCog, HiMenuAlt2, HiX } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Websites',
      icon: <HiTemplate className="w-6 h-6" />,
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: <HiCog className="w-6 h-6" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-[60] bg-[#00D8FF] text-black p-3 rounded-full shadow-lg"
      >
        {isSidebarOpen ? (
          <HiX className="w-6 h-6" />
        ) : (
          <HiMenuAlt2 className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] z-[51]`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-primary)]">
          <Link to="/dashboard" className="text-2xl font-black tracking-tight text-gradient">
            SiteLure
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  isActive(item.path)
                    ? 'bg-[#00D8FF] text-black'
                    : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Top Navigation */}
      <div className="fixed top-0 right-0 left-64 h-16 z-[51] nav-bg border-b border-[var(--border-primary)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Add any left-side content here if needed */}
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button onClick={handleLogout} className="btn-modern-sm">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[50] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AuthenticatedLayout; 