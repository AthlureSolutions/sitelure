import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Settings: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');
      
      await api.delete('/auth/delete-account');
      
      // Log out the user after successful deletion
      logout();
      navigate('/', { 
        state: { 
          success: true, 
          message: 'Your account has been successfully deleted.' 
        } 
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="glass p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
          <p className="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500/10 text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-red-500 font-semibold">
                Are you sure? This will:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Permanently delete your account</li>
                <li>Delete all your websites</li>
                <li>Remove all your data from our servers</li>
              </ul>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 