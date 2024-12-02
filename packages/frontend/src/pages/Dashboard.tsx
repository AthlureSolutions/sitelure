import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiPlus, HiGlobe, HiTemplate, HiExternalLink, HiTrash, HiX } from 'react-icons/hi';
import api from '../api';

interface Website {
  id: string;
  businessName: string;
  businessEmail: string;
  businessDescription: string;
  contactEmail: string;
  phoneNumber?: string;
  address?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  template: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  deployUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/websites');
      setWebsites(response.data);
    } catch (err: any) {
      console.error('Error fetching websites:', err);
      setError(err.response?.data?.message || 'Failed to fetch websites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWebsite) return;
    
    try {
      setIsDeleting(true);
      await api.delete(`/websites/${selectedWebsite.id}`);
      setWebsites(websites.filter(site => site.id !== selectedWebsite.id));
      setSelectedWebsite(null);
    } catch (err: any) {
      console.error('Error deleting website:', err);
      setError(err.response?.data?.message || 'Failed to delete website');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

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
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Websites</h1>
          <button
            onClick={() => navigate('/create-website')}
            className="btn-modern flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Start Website Builder
          </button>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.length > 0 ? (
              websites.map((website) => (
                <div
                  key={website.id}
                  onClick={() => setSelectedWebsite(website)}
                  className="glass cursor-pointer transform hover:scale-[1.02] transition-all duration-300 rounded-lg p-6 border border-[var(--border-primary)] hover:border-[#00D8FF]"
                >
                  <div className="flex items-center justify-center h-32 mb-4">
                    {website.logoUrl ? (
                      <img
                        src={website.logoUrl}
                        alt={`${website.businessName} logo`}
                        className="h-full object-contain"
                      />
                    ) : (
                      <HiGlobe className="w-16 h-16 text-[#00D8FF]" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-primary)]">{website.businessName}</h3>
                  <p className="text-[var(--text-secondary)] text-center mb-4 line-clamp-2">{website.businessDescription}</p>
                  {website.deployUrl && (
                    <div className="flex justify-center">
                      <a
                        href={website.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-modern-sm flex items-center gap-2"
                      >
                        View Live <HiExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  <div className="mt-4 text-center text-sm text-[var(--text-tertiary)]">
                    Created {formatDate(website.createdAt)}
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
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={() => setSelectedWebsite(null)}
          >
            <div 
              className="bg-[var(--bg-primary)] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[var(--border-primary)]"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <button
                    onClick={() => setSelectedWebsite(null)}
                    className="btn-modern-sm"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">Business Information</h3>
                  <div className="space-y-2 text-[var(--text-secondary)]">
                    <p>Name: {selectedWebsite.businessName}</p>
                    <p>Email: {selectedWebsite.businessEmail}</p>
                    <p>Description: {selectedWebsite.businessDescription}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">Contact Information</h3>
                  <div className="space-y-2 text-[var(--text-secondary)]">
                    <p>Email: {selectedWebsite.contactEmail}</p>
                    <p>Phone: {selectedWebsite.phoneNumber || 'Not provided'}</p>
                    <p>Address: {selectedWebsite.address || 'Not provided'}</p>
                  </div>
                </div>

                {/* Design */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">Design</h3>
                  <div className="space-y-4">
                    {selectedWebsite.logoUrl && (
                      <div>
                        <p className="text-[var(--text-secondary)] mb-2">Logo:</p>
                        <img 
                          src={selectedWebsite.logoUrl} 
                          alt="Logo" 
                          className="h-20 object-contain bg-[var(--bg-secondary)] rounded-lg p-2"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-[var(--text-secondary)] mb-2">Colors:</p>
                      <div className="flex gap-4 items-center">
                        <div>
                          <p className="text-sm text-[var(--text-tertiary)] mb-1">Primary</p>
                          <div 
                            className="w-8 h-8 rounded-full border border-[var(--border-primary)]" 
                            style={{ backgroundColor: selectedWebsite.primaryColor }}
                            title={selectedWebsite.primaryColor}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-[var(--text-tertiary)] mb-1">Secondary</p>
                          <div 
                            className="w-8 h-8 rounded-full border border-[var(--border-primary)]" 
                            style={{ backgroundColor: selectedWebsite.secondaryColor }}
                            title={selectedWebsite.secondaryColor}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--text-secondary)]">Template: {selectedWebsite.template}</p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">Social Media</h3>
                  <div className="space-y-2 text-[var(--text-secondary)]">
                    {selectedWebsite.facebookUrl && (
                      <p>Facebook: <a href={selectedWebsite.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-[#00D8FF] hover:underline">View Profile</a></p>
                    )}
                    {selectedWebsite.twitterUrl && (
                      <p>Twitter: <a href={selectedWebsite.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-[#00D8FF] hover:underline">View Profile</a></p>
                    )}
                    {selectedWebsite.instagramUrl && (
                      <p>Instagram: <a href={selectedWebsite.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#00D8FF] hover:underline">View Profile</a></p>
                    )}
                    {selectedWebsite.linkedinUrl && (
                      <p>LinkedIn: <a href={selectedWebsite.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#00D8FF] hover:underline">View Profile</a></p>
                    )}
                    {!selectedWebsite.facebookUrl && !selectedWebsite.twitterUrl && !selectedWebsite.instagramUrl && !selectedWebsite.linkedinUrl && (
                      <p className="text-[var(--text-tertiary)]">No social media links provided</p>
                    )}
                  </div>
                </div>

                {/* SEO Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">SEO Settings</h3>
                  <div className="space-y-2 text-[var(--text-secondary)]">
                    <p>Title: {selectedWebsite.metaTitle || selectedWebsite.businessName}</p>
                    <p>Description: {selectedWebsite.metaDescription || selectedWebsite.businessDescription}</p>
                    <p>Keywords: {selectedWebsite.metaKeywords || 'None specified'}</p>
                  </div>
                </div>

                {/* Deployment */}
                <div>
                  <h3 className="text-lg font-semibold text-[#00D8FF] mb-2">Deployment</h3>
                  {selectedWebsite.deployUrl ? (
                    <a 
                      href={selectedWebsite.deployUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#00D8FF] hover:underline flex items-center gap-2"
                    >
                      View Live Website <HiExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-[var(--text-tertiary)]">Website not deployed yet</p>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-primary)]">
                  <p>Created: {formatDate(selectedWebsite.createdAt)}</p>
                  <p>Last Updated: {formatDate(selectedWebsite.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
