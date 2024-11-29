// packages/frontend/src/components/CreateWebsite/ReviewAndPublish.tsx
import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface Props {
  prevStep: () => void;
}

const ReviewAndPublish: React.FC<Props> = ({ prevStep }) => {
  const { businessInfo, logoUrl, colors, content, template } = useContext(WebsiteContext);
  const { user } = useContext(AuthContext);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handlePublish = async () => {
    setPublishing(true);
    setError('');
    try {
      const response = await axios.post('/api/websites', {
        businessInfo,
        logoUrl,
        colors,
        content,
        template,
      }, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setSuccess('Website is being generated and will be live shortly!');
      // Optionally, redirect to dashboard
      // navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to publish website.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Review and Publish</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Information</h3>
        <p className="text-gray-700"><strong>Name:</strong> {businessInfo.name}</p>
        <p className="text-gray-700"><strong>Industry:</strong> {businessInfo.industry}</p>
        <p className="text-gray-700"><strong>Description:</strong> {businessInfo.description}</p>
        {logoUrl && (
          <div className="mt-4">
            <strong className="text-gray-700">Logo:</strong>
            <img src={logoUrl} alt="Business Logo" className="w-24 h-24 object-cover mt-2 border border-gray-300 rounded" />
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Color Palette</h3>
        <p className="text-gray-700 flex items-center">
          <strong>Primary Color:</strong>
          <span 
            className="inline-block w-6 h-6 rounded-full ml-2 border border-gray-300" 
            style={{ backgroundColor: colors.primary }} 
            aria-hidden="true"
          ></span>
          <span className="ml-2">{colors.primary}</span>
        </p>
        <p className="text-gray-700 flex items-center">
          <strong>Secondary Color:</strong>
          <span 
            className="inline-block w-6 h-6 rounded-full ml-2 border border-gray-300" 
            style={{ backgroundColor: colors.secondary }} 
            aria-hidden="true"
          ></span>
          <span className="ml-2">{colors.secondary}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Generated Content</h3>
        <p className="text-gray-700">{content}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Selected Template</h3>
        <p className="text-gray-700 capitalize">{template.replace('-', ' ')}</p>
        <img src={`/assets/templates/${template}.png`} alt={`${template} Template`} className="w-full h-auto rounded shadow-md mt-4" />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing}
          className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
            publishing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default ReviewAndPublish;
