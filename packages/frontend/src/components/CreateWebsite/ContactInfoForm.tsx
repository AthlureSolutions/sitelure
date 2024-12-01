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
      <h2 className="text-2xl font-bold text-white">Contact Information</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phoneNumber" className="block text-gray-300 mb-2 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-300 mb-2 font-medium">
            Business Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200"
            placeholder="123 Main St, Anytown, USA"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
            Contact Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                     text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                     transition-all duration-200"
            placeholder="contact@yourbusiness.com"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="btn-modern-sm"
          >
            Previous
          </button>
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

export default ContactInfoForm;
