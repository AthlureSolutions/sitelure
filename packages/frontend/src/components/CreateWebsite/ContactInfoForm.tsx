// packages/frontend/src/components/CreateWebsite/ContactInfoForm.tsx

import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import { isMobilePhone, isEmail } from 'validator'; // Ensure to install: npm install validator

interface ContactInfoFormProps {
  nextStep: () => void;
  prevStep: () => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ nextStep, prevStep }) => {
  const { websiteData, setContactInfo } = useContext(WebsiteContext);
  const [phoneNumber, setPhoneNumber] = useState<string>(websiteData.contactInfo.phoneNumber);
  const [address, setAddress] = useState<string>(websiteData.contactInfo.address);
  const [email, setEmail] = useState<string>(websiteData.contactInfo.email);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim() || !address.trim() || !email.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!isMobilePhone(phoneNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setContactInfo({
      phoneNumber,
      address,
      email,
    });

    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Contact Information</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="contactEmail" className="form-label">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="form-label">
            Business Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn-modern-sm"
          >
            Previous Step
          </button>
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

export default ContactInfoForm;
