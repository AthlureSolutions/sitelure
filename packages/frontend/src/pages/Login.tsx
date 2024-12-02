// packages/frontend/src/pages/Login.tsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Only redirect if user is logged in and we're on the login page
    if (user && location.pathname === '/login') {
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('At useEffect, from:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;

    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by useEffect after user is set
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
      setFormData(prev => ({ ...prev, password: '' })); // Clear only password field on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="max-w-md w-full glass p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Login to Your Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              value={formData.password}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-modern ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00D8FF] hover:text-[#FF3366] font-medium transition-colors duration-200">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
