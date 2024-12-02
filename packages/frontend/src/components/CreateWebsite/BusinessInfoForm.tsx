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
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Business Information</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="businessName" className="form-label">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            className="form-input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="businessEmail" className="form-label">
            Business Email
          </label>
          <input
            type="email"
            id="businessEmail"
            name="businessEmail"
            className="form-input"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="businessDescription" className="form-label">
            Business Description
          </label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            rows={4}
            className="form-input"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-modern"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfoForm;
