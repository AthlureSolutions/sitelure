// packages/frontend/src/pages/CreateWebsite.tsx

import React, { useState } from 'react';
import BusinessInfoForm from '../components/CreateWebsite/BusinessInfoForm';
import ContactInfoForm from '../components/CreateWebsite/ContactInfoForm';
import LogoAndColorPalette from '../components/CreateWebsite/LogoAndColorPalette';
import SocialMediaAndTemplateForm from '../components/CreateWebsite/SocialMediaAndTemplateForm';
import ReviewAndPublish from '../components/CreateWebsite/ReviewAndPublish';
import ProgressIndicator from '../components/CreateWebsite/ProgressIndicator';
import { WebsiteProvider } from '../context/WebsiteContext';

const CreateWebsite: React.FC = () => {
  const TOTAL_STEPS = 5;
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoForm nextStep={nextStep} />;
      case 2:
        return <ContactInfoForm nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <LogoAndColorPalette nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <SocialMediaAndTemplateForm nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <ReviewAndPublish prevStep={prevStep} />;
      default:
        return <div className="text-white">Unknown Step</div>;
    }
  };

  return (
    <WebsiteProvider>
      <div className="min-h-screen bg-[#1E1E1E] pt-24 px-6 pb-6">
        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Current Step Component */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-lg p-8 border border-gray-700">
            {renderStep()}
          </div>
        </div>
      </div>
    </WebsiteProvider>
  );
};

export default CreateWebsite;
