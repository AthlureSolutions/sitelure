import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiGlobe, HiTemplate } from 'react-icons/hi';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Placeholder for websites data - in the future, this would come from an API
  const websites: any[] = [];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Websites</h1>
          <button
            onClick={() => navigate('/create-website')}
            className="btn-modern flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Start Website Builder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.length > 0 ? (
            websites.map((website, index) => (
              <div
                key={index}
                className="glass cursor-pointer transform hover:scale-[1.02] transition-all duration-300 rounded-lg p-6 border border-gray-700 hover:border-[#00D8FF]"
              >
                <div className="flex items-center justify-center h-32 mb-4">
                  <HiGlobe className="w-16 h-16 text-[#00D8FF]" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{website.name}</h3>
                <p className="text-gray-400 text-center mb-4">{website.description}</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                    }} 
                    className="btn-modern-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement view functionality
                    }} 
                    className="btn-modern-sm"
                  >
                    View Live
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="glass rounded-lg p-8 border border-gray-700">
                <div className="flex flex-col items-center justify-center text-center">
                  <HiTemplate className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Websites Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start your journey by creating your first website with our step-by-step builder
                  </p>
                  <button
                    onClick={() => navigate('/create-website')}
                    className="btn-modern flex items-center gap-2"
                  >
                    <HiPlus className="w-5 h-5" />
                    Start Website Builder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
