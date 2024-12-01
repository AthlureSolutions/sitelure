// packages/frontend/src/components/CreateWebsite/BusinessInfoForm.tsx

import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import { isEmail } from 'validator'; // Ensure to install: npm install validator

interface BusinessInfoFormProps {
  nextStep: () => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ nextStep }) => {
  const { websiteData, setBusinessInfo } = useContext(WebsiteContext);
  const [businessName, setBusinessName] = useState<string>(websiteData.businessInfo.businessName);
  const [businessEmail, setBusinessEmail] = useState<string>(websiteData.businessInfo.businessEmail);
  const [businessDescription, setBusinessDescription] = useState<string>(
    websiteData.businessInfo.businessDescription
  );
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!businessName.trim() || !businessEmail.trim() || !businessDescription.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!isEmail(businessEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Update context
    setBusinessInfo({
      businessName,
      businessEmail,
      businessDescription,
    });

    // Proceed to next step
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Business Information</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-gray-300 mb-2 font-medium">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200"
            placeholder="Enter your business name"
          />
        </div>

        <div>
          <label htmlFor="businessEmail" className="block text-gray-300 mb-2 font-medium">
            Business Email
          </label>
          <input
            type="email"
            id="businessEmail"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200"
            placeholder="contact@yourbusiness.com"
          />
        </div>

        <div>
          <label htmlFor="businessDescription" className="block text-gray-300 mb-2 font-medium">
            Business Description
          </label>
          <textarea
            id="businessDescription"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200
                     h-32 resize-none"
            placeholder="Tell us what your business does..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn-modern px-8 py-2"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfoForm;
