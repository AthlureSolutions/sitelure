// packages/frontend/src/components/CreateWebsite/LogoUpload.tsx
import React, { useState, useContext } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import axios from 'axios';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const LogoUpload: React.FC<Props> = ({ nextStep, prevStep }) => {
  const { logoUrl, setLogoUrl } = useContext(WebsiteContext);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(logoUrl || '');
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selected.type)) {
        setError('Only PNG, JPEG, and JPG files are allowed.');
        return;
      }
      if (selected.size > 2 * 1024 * 1024) { // 2MB
        setError('File size must be less than 2MB.');
        return;
      }
      setError('');
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await axios.post('/api/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLogoUrl(response.data.url);
      nextStep();
    } catch (err) {
      console.error(err);
      setError('Failed to upload logo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Logo</h2>

      {preview && (
        <div className="mb-6">
          <img src={preview} alt="Logo Preview" className="w-32 h-32 object-contain border border-gray-300 rounded" />
        </div>
      )}

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        className="mb-4"
        aria-describedby="logo-error"
      />
      {error && <p id="logo-error" className="text-red-500 text-sm mb-4">{error}</p>}

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
          onClick={handleUpload}
          disabled={uploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Next'}
        </button>
      </div>
    </form>
  );
};

export default LogoUpload;
