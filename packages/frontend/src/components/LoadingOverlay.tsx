import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Publishing your website...' }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#00D8FF]/30 border-t-[#00D8FF] rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
            <p className="text-gray-400">Please don't close this window</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 