// packages/frontend/src/components/CreateWebsite/ProgressIndicator.tsx
import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Business Info',
    'Contact',
    'Logo & Colors',
    'Social & Template',
    'Review'
  ];

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-[#2A2A2A] rounded-full">
          <div
            className="h-full bg-[#00D8FF] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-full mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index + 1 <= currentStep ? 'text-[#00D8FF]' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  index + 1 === currentStep
                    ? 'bg-[#00D8FF] text-black'
                    : index + 1 < currentStep
                    ? 'bg-[#00D8FF] text-black'
                    : 'bg-[#2A2A2A] text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm whitespace-nowrap">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
