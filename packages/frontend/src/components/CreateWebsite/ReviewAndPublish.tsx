// packages/frontend/src/components/CreateWebsite/ReviewAndPublish.tsx

import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import api from '../../api'; // Ensure Axios is correctly configured
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading'; // Optional: A loading spinner component

const ReviewAndPublish: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
  const { websiteData, resetWebsiteData } = useContext(WebsiteContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>(''); // URL of the published website

  const handlePublish = async () => {
    setError('');
    setSuccess('');
    setPublishedUrl('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('businessName', websiteData.businessInfo.businessName);
      formData.append('businessEmail', websiteData.businessInfo.businessEmail);
      formData.append('businessDescription', websiteData.businessInfo.businessDescription);
      formData.append('phoneNumber', websiteData.contactInfo.phoneNumber);
      formData.append('address', websiteData.contactInfo.address);
      formData.append('contactEmail', websiteData.contactInfo.email);
      if (websiteData.logo) {
        formData.append('logo', websiteData.logo);
      }
      formData.append('colorPalette', JSON.stringify(websiteData.colorPalette));
      formData.append('keywords', JSON.stringify(websiteData.keywords));
      formData.append('socialMediaLinks', JSON.stringify(websiteData.socialMediaLinks));
      formData.append('template', websiteData.template);

      // Make API call to publish the website
      const response = await api.post('/websites/publish', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the backend returns the URL of the published site
      const { website, publishedUrl } = response.data;

      setSuccess('Website published successfully!');
      setPublishedUrl(publishedUrl);
      setLoading(false);
      resetWebsiteData();
      // Optionally, navigate to the dashboard or the published site
      // navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to publish website:', err);
      setError(err.response?.data?.message || 'Failed to publish website. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Review and Publish</h2>
      {error && <p className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 text-red-500 text-center text-sm">{error}</p>}
      {success && <p className="bg-green-500/10 border border-green-500/50 rounded-lg p-2 text-green-500 text-center text-sm">{success}</p>}
      
      {loading && <Loading />}

      {/* Business & Contact Information */}
      <div className="glass p-4 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Business Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Business Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Name:</span> <span className="text-white ml-2">{websiteData.businessInfo.businessName}</span></p>
              <p><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{websiteData.businessInfo.businessEmail}</span></p>
              <p><span className="text-gray-400">Description:</span> <span className="text-white ml-2">{websiteData.businessInfo.businessDescription}</span></p>
            </div>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Contact Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Phone:</span> <span className="text-white ml-2">{websiteData.contactInfo.phoneNumber}</span></p>
              <p><span className="text-gray-400">Address:</span> <span className="text-white ml-2">{websiteData.contactInfo.address}</span></p>
              <p><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{websiteData.contactInfo.email}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo & Colors */}
      <div className="glass p-4 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Logo */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Logo</h3>
            {websiteData.logo ? (
              <div className="bg-[#2A2A2A] rounded-lg p-2">
                <img src={URL.createObjectURL(websiteData.logo)} alt="Logo Preview" className="max-h-24 w-auto object-contain mx-auto" />
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No logo uploaded</p>
            )}
          </div>
          {/* Color Palette */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Color Palette</h3>
            <div className="flex flex-wrap gap-2">
              {websiteData.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg ring-1 ring-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Social */}
      <div className="glass p-4 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4">
          {/* SEO Settings */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">SEO Settings</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Title:</span> <span className="text-white ml-2">{websiteData.seoSettings.metaTitle}</span></p>
              <p><span className="text-gray-400">Description:</span> <span className="text-white ml-2">{websiteData.seoSettings.metaDescription}</span></p>
              <p><span className="text-gray-400">Keywords:</span> <span className="text-white ml-2">{websiteData.seoSettings.metaKeywords}</span></p>
            </div>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Social Media Links</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Facebook:</span> <span className="text-white ml-2 break-all">{websiteData.socialMediaLinks.facebook || 'N/A'}</span></p>
              <p><span className="text-gray-400">Twitter:</span> <span className="text-white ml-2 break-all">{websiteData.socialMediaLinks.twitter || 'N/A'}</span></p>
              <p><span className="text-gray-400">Instagram:</span> <span className="text-white ml-2 break-all">{websiteData.socialMediaLinks.instagram || 'N/A'}</span></p>
              <p><span className="text-gray-400">LinkedIn:</span> <span className="text-white ml-2 break-all">{websiteData.socialMediaLinks.linkedin || 'N/A'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Template */}
      <div className="glass p-4 rounded-lg">
        <div className="space-y-4">
          {/* Template */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Selected Template</h3>
            <p className="text-white text-sm">{websiteData.template}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="btn-modern-sm"
        >
          Back
        </button>
        <button
          onClick={handlePublish}
          disabled={loading}
          className={`bg-gradient-to-r from-[#00D8FF] to-[#00FF94] text-black font-bold px-6 py-2 rounded-lg 
                     transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,216,255,0.3)]
                     ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {loading ? 'Publishing...' : 'Launch Website'}
        </button>
      </div>
    </div>
  );
};

export default ReviewAndPublish;
