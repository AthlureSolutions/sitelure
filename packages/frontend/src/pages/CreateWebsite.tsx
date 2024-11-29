// packages/frontend/src/pages/CreateWebsite.tsx
import React, { useState } from 'react';
import BusinessInfoForm from '../components/CreateWebsite/BusinessInfoForm';
import LogoUpload from '../components/CreateWebsite/LogoUpload';
import ColorPaletteSelection from '../components/CreateWebsite/ColorPaletteSelection';
import ContentGeneration from '../components/CreateWebsite/ContentGeneration';
import TemplateSelection from '../components/CreateWebsite/TemplateSelection';
import ReviewAndPublish from '../components/CreateWebsite/ReviewAndPublish';
import ProgressIndicator from '../components/CreateWebsite/ProgressIndicator';
import { WebsiteProvider } from '../context/WebsiteContext';

const CreateWebsite: React.FC = () => {
  const TOTAL_STEPS = 6;
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoForm nextStep={nextStep} />;
      case 2:
        return <LogoUpload nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ColorPaletteSelection nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <ContentGeneration nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <TemplateSelection nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <ReviewAndPublish prevStep={prevStep} />;
      default:
        return <div className="text-gray-700">Unknown Step</div>;
    }
  };

  return (
    <WebsiteProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Step Indicator */}
        <div className="mb-6">
          <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Current Step Component */}
        {renderStep()}
      </div>
    </WebsiteProvider>
  );
};

export default CreateWebsite;
