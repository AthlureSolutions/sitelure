// packages/frontend/src/components/CreateWebsite/BusinessInfoForm.tsx
import React, { useState, useContext } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';

interface Props {
  nextStep: () => void;
}

const BusinessInfoForm: React.FC<Props> = ({ nextStep }) => {
  const { businessInfo, setBusinessInfo } = useContext(WebsiteContext);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!businessInfo.name) newErrors.name = 'Business name is required';
    if (!businessInfo.industry) newErrors.industry = 'Industry is required';
    if (!businessInfo.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">Business Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={businessInfo.name}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby="name-error"
        />
        {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="industry" className="block text-gray-700">Industry</label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={businessInfo.industry}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-invalid={errors.industry ? 'true' : 'false'}
          aria-describedby="industry-error"
        />
        {errors.industry && <p id="industry-error" className="text-red-500 text-sm mt-1">{errors.industry}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={businessInfo.description}
          onChange={handleChange}
          className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={4}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby="description-error"
        ></textarea>
        {errors.description && <p id="description-error" className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessInfoForm;
