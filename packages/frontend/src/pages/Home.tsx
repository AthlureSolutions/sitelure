// packages/frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1E1E1E]">
      {/* Hero Section - Full Screen */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        {/* Enhanced Futuristic Background */}
        <div className="absolute inset-0 animated-bg"></div>
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-full h-full">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D8FF]/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF3366]/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse delay-700"></div>
          </div>
          {/* Animated grid background */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(30, 30, 30, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30, 30, 30, 0.8) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.2
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
            <span className="block text-white mb-4">Create Your</span>
            <span className="text-gradient">Future Website</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-light">
            Build a stunning website with our AI-powered platform. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="btn-modern group flex items-center justify-center"
            >
              Get Started
              <span className="absolute right-4 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="glass px-8 py-4 text-white text-lg font-medium rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1E1E]/90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-[#00D8FF] font-semibold tracking-wide uppercase text-sm">The Future of Web Design</h2>
            <p className="mt-2 text-4xl font-bold text-white">
              Powered by Advanced Technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature cards with modern styling */}
            <div className="glass p-8 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r from-[#00D8FF] to-[#FF3366]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Design</h3>
              <p className="text-gray-300">
                Advanced algorithms create stunning designs tailored to your brand identity.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r from-[#00D8FF] to-[#FF3366]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Responsive Design</h3>
              <p className="text-gray-300">
                Automatically adapts to any device with intelligent layout optimization.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r from-[#00D8FF] to-[#FF3366]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Analytics</h3>
              <p className="text-gray-300">
                Real-time insights and performance metrics to optimize your online presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="p-8">
                <h2 className="text-[#00D8FF] font-semibold tracking-wide uppercase mb-4">Intelligent Platform</h2>
                <p className="text-4xl font-bold text-white">
                  The Future of Website Creation
                </p>
                <p className="mt-4 text-gray-300 text-lg">
                  Experience the next generation of web design with our AI-powered platform.
                </p>
              </div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-[#00D8FF] to-[#FF3366] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Instant Deployment</h3>
                    <p className="text-gray-300">Launch your website with one click using our advanced cloud infrastructure.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D8FF] to-[#FF3366] transform rotate-6 rounded-2xl opacity-75 blur-lg"></div>
              <div className="glass p-4 rounded-2xl relative transform hover:rotate-0 transition-all duration-500 rotate-6">
                <img 
                  src="https://miro.medium.com/v2/resize:fit:3200/1*3PuVKqPTpotv5eJSwM0ALQ.png" 
                  alt="Dashboard Preview" 
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
