// packages/frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient that stays under navbar */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>

      {/* Hero Section - Full Screen */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        {/* Enhanced Abstract Background Design */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -left-1/4 -top-1/4 w-[800px] h-[800px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 top-1/3 w-[600px] h-[600px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            <span className="block mb-4">Create Your Professional</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Website in Minutes</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            Build a stunning website for your business with our AI-powered platform. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - 3 Column Design */}
      <section className="py-24 bg-white/80 backdrop-blur-lg relative">
        <div className="absolute inset-0 bg-white/80 h-24 top-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Built for Success</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">
              Optimized for Growth and Performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Cards with hover effects and consistent styling */}
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SEO Optimized</h3>
              <p className="text-gray-600">
                Built with semantic HTML, meta tags, and schema markup. Your website will be ready for search engines from day one.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized code, compressed images, and CDN delivery ensure your website loads quickly for every visitor.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-pink-100 w-12 h-12 rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Built to Convert</h3>
              <p className="text-gray-600">
                Strategic placement of call-to-actions, optimized user flows, and mobile-first design to maximize lead generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Two Column Design */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="p-8 mb-8">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-4">Features</h2>
                <p className="text-4xl font-extrabold text-gray-900">
                  Everything you need to succeed online
                </p>
              </div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Content</h3>
                    <p className="text-gray-600">Generate professional content for your website automatically using our advanced AI technology.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Beautiful Templates</h3>
                    <p className="text-gray-600">Choose from our collection of professionally designed templates that look great on any device.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 transform rotate-3 rounded-2xl"></div>
              <img 
                src="/assets/images/dashboard-preview.png" 
                alt="Dashboard Preview" 
                className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
