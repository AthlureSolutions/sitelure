// packages/frontend/src/components/CreateWebsite/ProgressIndicator.tsx
import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  return (
    <nav aria-label="Progress" className="mt-8 mb-24 w-full">
      <h2 className="text-2xl font-bold text-center mb-8">Step {currentStep} of {totalSteps}</h2>
      <ol className="flex items-center justify-center max-w-4xl mx-auto px-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <li key={step} className={`${step === totalSteps ? '' : 'flex-1'}`}>
            <div className="flex items-center">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full border-3 font-bold text-lg ${
                  step === currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
                aria-current={step === currentStep ? 'step' : undefined}
              >
                {step}
              </div>
              {step !== totalSteps && (
                <div
                  className={`flex-1 h-2 ${
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
