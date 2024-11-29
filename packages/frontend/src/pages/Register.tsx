// packages/frontend/src/pages/Register.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden flex items-center justify-center">
      {/* Enhanced Abstract Background Design */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 w-[800px] h-[800px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 top-1/3 w-[600px] h-[600px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full m-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
          <div>
            {/* Logo or Branding */}
            <img className="mx-auto h-16 w-auto" src={logo} alt="Your Company" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          </div>
          <form className="space-y-6" onSubmit={handleRegister} noValidate>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                  aria-label="Email address"
                />
              </div>
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Password"
                  aria-label="Password"
                />
              </div>
              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            {/* Link to Login */}
            <div className="text-sm text-center pt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
