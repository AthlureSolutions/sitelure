// packages/frontend/src/components/CreateWebsite/LogoAndColorPalette.tsx

import React, { useContext, useState, useEffect, useRef } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import { HiUpload, HiX } from 'react-icons/hi';

interface LogoAndColorPaletteProps {
  nextStep: () => void;
  prevStep: () => void;
}

const LogoAndColorPalette: React.FC<LogoAndColorPaletteProps> = ({ nextStep, prevStep }) => {
  const { websiteData, setLogo, setColorPalette } = useContext(WebsiteContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(websiteData.logo);
  const [preview, setPreview] = useState<string | null>(websiteData.logo ? URL.createObjectURL(websiteData.logo) : null);
  const [selectedColors, setSelectedColors] = useState<string[]>(websiteData.colorPalette);
  const [error, setError] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>(selectedColors[0] || '#00D8FF');
  const [secondaryColor, setSecondaryColor] = useState<string>(selectedColors[1] || '#0099B4');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup the object URL when component unmounts or when logo changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeLogo = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimaryColor(color);
      setSelectedColors(prev => [color, prev[1] || secondaryColor, ...prev.slice(2)]);
    } else {
      setSecondaryColor(color);
      setSelectedColors(prev => [prev[0] || primaryColor, color, ...prev.slice(2)]);
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary') => {
    let color = e.target.value;
    // Add # if not present
    if (color && !color.startsWith('#')) {
      color = '#' + color;
    }
    // Validate hex color
    if (color === '#' || /^#[0-9A-Fa-f]{0,6}$/.test(color)) {
      handleColorChange(color, type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please upload a logo.');
      return;
    }

    if (!primaryColor.match(/^#[0-9A-Fa-f]{6}$/) || !secondaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      setError('Please select valid colors.');
      return;
    }

    setLogo(selectedFile);
    setColorPalette([primaryColor, secondaryColor]);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Logo & Color Palette</h2>
      {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">{error}</div>}

      {/* Logo Upload */}
      <div className="glass p-6 rounded-lg">
        <label className="block text-lg font-semibold text-[var(--text-primary)] mb-4">
          Upload Logo
        </label>
        
        {preview ? (
          <div className="relative w-fit">
            <img
              src={preview}
              alt="Logo Preview"
              className="max-h-40 w-auto object-contain bg-[var(--bg-secondary)] rounded-lg p-4"
            />
            <button
              type="button"
              onClick={removeLogo}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? 'border-[#00D8FF] bg-[#00D8FF]/5'
                : 'border-[var(--border-primary)] hover:border-[#00D8FF]'
            }`}
          >
            <HiUpload className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]" />
            <p className="text-[var(--text-secondary)] mb-2">
              Drag and drop your logo here, or click to select
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Supported formats: PNG, JPG, GIF (Max 5MB)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Color Palette Selection */}
      <div className="glass p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Select Colors</h3>
        
        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Primary Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => handleColorChange(e.target.value, 'primary')}
              className="w-16 h-16 rounded cursor-pointer"
            />
            <div className="flex items-center bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
              <span className="text-[var(--text-tertiary)] px-3">#</span>
              <input
                type="text"
                value={primaryColor.replace('#', '')}
                onChange={(e) => handleHexInputChange(e, 'primary')}
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-28 uppercase py-2 text-[var(--text-primary)]"
                placeholder="00D8FF"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Secondary Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => handleColorChange(e.target.value, 'secondary')}
              className="w-16 h-16 rounded cursor-pointer"
            />
            <div className="flex items-center bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
              <span className="text-[var(--text-tertiary)] px-3">#</span>
              <input
                type="text"
                value={secondaryColor.replace('#', '')}
                onChange={(e) => handleHexInputChange(e, 'secondary')}
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-28 uppercase py-2 text-[var(--text-primary)]"
                placeholder="0099B4"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="btn-modern-sm"
        >
          Previous Step
        </button>
        <button
          type="submit"
          className="btn-modern"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default LogoAndColorPalette;
