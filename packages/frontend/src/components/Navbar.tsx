// packages/frontend/src/components/Navbar.tsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isExactHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 top-0">
      <div className={`glass border-b border-white/10 transition-all duration-300 ${
        isExactHomePage 
          ? isScrolled ? 'bg-[#1E1E1E]/95 backdrop-blur-lg' : 'bg-transparent'
          : 'bg-[#1E1E1E]/95 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={user ? "/dashboard" : "/"} className="flex items-center">
                <span className="text-2xl font-bold text-gradient">SiteLure</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!user ? (
                <>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </Link>
                  {isExactHomePage && (
                    <a
                      href="#features"
                      onClick={scrollToFeatures}
                      className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Features
                    </a>
                  )}
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-modern py-2 px-4"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="btn-modern py-2 px-4"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!user ? (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </Link>
                  {isExactHomePage && (
                    <a
                      href="#features"
                      onClick={scrollToFeatures}
                      className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Features
                    </a>
                  )}
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 btn-modern"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
