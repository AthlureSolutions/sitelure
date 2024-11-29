// packages/frontend/src/components/CreateWebsite/ProgressIndicator.tsx
import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <li key={step} className="flex-1">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  step === currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
                aria-current={step === currentStep ? 'step' : undefined}
              >
                {step}
              </div>
              {step !== totalSteps && (
                <div
                  className={`flex-1 h-1 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                ></div>
              )}
            </div>
            <span className="sr-only">Step {step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressIndicator;
