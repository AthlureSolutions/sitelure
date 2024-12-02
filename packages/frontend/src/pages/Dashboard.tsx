import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiPlus, HiGlobe, HiTemplate, HiExternalLink, HiTrash } from 'react-icons/hi';
import api from '../api';

interface Website {
  id: string;
  ownerId: string;
  
  // Business Information
  businessName: string;
  businessEmail: string;
  businessDescription: string;
  
  // Contact Information
  contactEmail: string;
  phoneNumber: string;
  address: string;

  // Design
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  template: string;

  // Social Media Links
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;

  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Deployment
  deployUrl: string | undefined;
  content: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching websites...');
      const response = await api.get('/websites');
      console.log('Websites response:', response.data);
      setWebsites(response.data);
    } catch (err: any) {
      console.error('Error fetching websites:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch websites. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteClick = async (websiteId: string) => {
    try {
      setError('');
      console.log('Fetching website details for:', websiteId);
      const response = await api.get(`/websites/${websiteId}`);
      console.log('Website details response:', response.data);
      setSelectedWebsite(response.data);
    } catch (err: any) {
      console.error('Error fetching website details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch website details. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedWebsite) return;
    
    try {
      setIsDeleting(true);
      await api.delete(`/websites/${selectedWebsite.id}`);
      setWebsites(websites.filter(site => site.id !== selectedWebsite.id));
      setSelectedWebsite(null);
      setDeleteConfirm(false);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting website');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {location.state?.success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8">
            {location.state.message}
            {location.state.deployUrl && (
              <div className="mt-2">
                <a 
                  href={location.state.deployUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00D8FF] hover:underline flex items-center gap-2"
                >
                  View your website <HiExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Websites</h1>
          <button
            onClick={() => navigate('/create-website')}
            className="btn-modern flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Start Website Builder
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.length > 0 ? (
              websites.map((website) => (
                <div 
                  key={website.id} 
                  onClick={() => handleWebsiteClick(website.id)}
                  className="glass cursor-pointer transform hover:scale-[1.02] transition-all duration-300 rounded-lg p-6 border border-[var(--border-primary)] hover:border-[#00D8FF]"
                >
                  <div className="flex items-center justify-center h-32 mb-4">
                    <HiGlobe className="w-16 h-16 text-[#00D8FF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-primary)]">{website.businessName}</h3>
                  <p className="text-[var(--text-secondary)] text-center mb-4">{website.businessDescription}</p>
                  <div className="flex justify-center gap-4">
                    {website.deployUrl && (
                      <a 
                        href={website.deployUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-modern-sm flex items-center gap-2"
                      >
                        View Live <HiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="mt-4 text-center text-sm text-[var(--text-tertiary)]">
                    Created on {formatDate(website.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="glass rounded-lg p-8 border border-[var(--border-primary)]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <HiTemplate className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">No Websites Yet</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Start your journey by creating your first website with our step-by-step builder
                    </p>
                    <button
                      onClick={() => navigate('/create-website')}
                      className="btn-modern flex items-center gap-2"
                    >
                      <HiPlus className="w-5 h-5" />
                      Start Website Builder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Website Details Modal */}
        {selectedWebsite && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedWebsite.businessName}</h2>
                <div className="flex gap-2">
                  {!deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="btn-modern-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center gap-2"
                      title="Delete Website"
                    >
                      <HiTrash className="w-4 h-4" />
                      Delete
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn-modern-sm bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="btn-modern-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Add more website details here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
