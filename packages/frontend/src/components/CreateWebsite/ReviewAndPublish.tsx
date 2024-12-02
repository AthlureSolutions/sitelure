// packages/frontend/src/components/CreateWebsite/ReviewAndPublish.tsx

import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import api from '../../api';
import Loading from '../LoadingOverlay';
import { useNavigate } from 'react-router-dom';

const ReviewAndPublish: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
  const { websiteData } = useContext(WebsiteContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishStatus, setPublishStatus] = useState('');
  const navigate = useNavigate();

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/websites/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  };

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    setPublishStatus('Preparing your website...');

    try {
      let logoUrl = '';
      if (websiteData.logo) {
        setPublishStatus('Uploading logo...');
        logoUrl = await uploadLogo(websiteData.logo);
      }

      setPublishStatus('Processing website data...');

      // Validate business name before formatting data
      if (!websiteData.businessInfo.businessName?.trim()) {
        throw new Error('Business name is required');
      }

      // Format data for backend
      const formattedData = {
        businessInfo: {
          name: websiteData.businessInfo.businessName,
          email: websiteData.businessInfo.businessEmail,
          description: websiteData.businessInfo.businessDescription
        },
        contactInfo: {
          phoneNumber: websiteData.contactInfo.phoneNumber,
          email: websiteData.contactInfo.email,
          address: websiteData.contactInfo.address
        },
        logoUrl,
        colors: {
          primary: websiteData.colorPalette[0] || '#3B82F6',
          secondary: websiteData.colorPalette[1] || '#1E40AF'
        },
        template: websiteData.template || 'default',
        content: websiteData.content || '',
        seoSettings: {
          metaTitle: websiteData.businessInfo.businessName,
          metaDescription: websiteData.businessInfo.businessDescription,
          metaKeywords: websiteData.keywords?.join(', ') || ''
        },
        socialMediaLinks: {
          facebook: websiteData.socialMediaLinks.facebook || '',
          twitter: websiteData.socialMediaLinks.twitter || '',
          instagram: websiteData.socialMediaLinks.instagram || '',
          linkedin: websiteData.socialMediaLinks.linkedin || ''
        }
      };

      setPublishStatus('Creating your website...');
      const response = await api.post('/websites', formattedData);

      setPublishStatus('Website published successfully!');
      setSuccess(`Your website has been published! You can view it at: ${response.data.deployUrl}`);
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error publishing website:', err);
      setError(err.response?.data?.message || err.message || 'Failed to publish website');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Review & Publish</h2>
      {error && <p className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 text-red-500 text-center text-sm">{error}</p>}
      {success && <p className="bg-green-500/10 border border-green-500/50 rounded-lg p-2 text-green-500 text-center text-sm">{success}</p>}
      
      {loading && <Loading message={publishStatus} />}

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
