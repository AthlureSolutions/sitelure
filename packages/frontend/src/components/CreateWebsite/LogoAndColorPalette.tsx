// packages/frontend/src/components/CreateWebsite/LogoAndColorPalette.tsx

import React, { useContext, useState, useEffect } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';

interface LogoAndColorPaletteProps {
  nextStep: () => void;
  prevStep: () => void;
}

const availableColors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F333FF',
  '#FF33A8',
  '#33FFF6',
  '#F6FF33',
  '#FF8633',
];

const LogoAndColorPalette: React.FC<LogoAndColorPaletteProps> = ({ nextStep, prevStep }) => {
  const { websiteData, setLogo, setColorPalette } = useContext(WebsiteContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(websiteData.logo);
  const [preview, setPreview] = useState<string | null>(websiteData.logo ? URL.createObjectURL(websiteData.logo) : null);
  const [selectedColors, setSelectedColors] = useState<string[]>(websiteData.colorPalette);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Cleanup the object URL when component unmounts or when logo changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleColor = (color: string) => {
    setError('');
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please upload a logo.');
      return;
    }

    if (selectedColors.length < 3) {
      setError('Please select at least 3 colors for your palette.');
      return;
    }

    setLogo(selectedFile);
    setColorPalette(selectedColors);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Logo & Color Palette</h2>
      {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">{error}</div>}
      
      {/* Logo Upload */}
      <div className="glass p-6 rounded-lg">
        <label htmlFor="logo" className="block text-lg font-semibold text-white mb-4">
          Select Logo
        </label>
        <input 
          type="file" 
          id="logo"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#2A2A2A] file:text-white hover:file:bg-gray-700 file:cursor-pointer cursor-pointer"
        />
      </div>

      {preview && (
        <div className="glass p-6 rounded-lg">
          <p className="text-lg font-semibold text-white mb-4">Logo Preview:</p>
          <img src={preview} alt="Logo Preview" className="max-h-40 w-auto object-contain mx-auto" />
        </div>
      )}

      {/* Color Palette Selection */}
      <div className="glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Select Color Palette</h3>
        <div className="grid grid-cols-4 gap-4">
          {availableColors.map((color) => (
            <div
              key={color}
              onClick={() => toggleColor(color)}
              className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-200 
                ${selectedColors.includes(color) 
                  ? 'ring-4 ring-[#00D8FF] shadow-[0_0_15px_rgba(0,216,255,0.3)]' 
                  : 'ring-2 ring-gray-600 hover:ring-gray-400'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-4">Select at least 3 colors.</p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="btn-modern-sm"
        >
          Back
        </button>
        <button
          type="submit"
          className={`btn-modern px-8 py-2 ${!selectedFile || selectedColors.length < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedFile || selectedColors.length < 3}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default LogoAndColorPalette;
