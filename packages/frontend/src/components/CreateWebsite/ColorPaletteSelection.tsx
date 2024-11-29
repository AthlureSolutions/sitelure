// packages/frontend/src/components/CreateWebsite/ColorPaletteSelection.tsx
import React, { useState, useContext } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const ColorPaletteSelection: React.FC<Props> = ({ nextStep, prevStep }) => {
  const { colors, setColors } = useContext(WebsiteContext);
  const [primary, setPrimary] = useState<string>(colors.primary);
  const [secondary, setSecondary] = useState<string>(colors.secondary);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primary || !secondary) {
      setError('Both colors are required.');
      return;
    }
    setColors({ primary, secondary });
    setError('');
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Color Palette</h2>

      <div className="mb-4">
        <label htmlFor="primary" className="block text-gray-700">Primary Color</label>
        <input
          type="color"
          id="primary"
          name="primary"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          className="mt-1 block w-16 h-10 p-0 border-0"
          aria-describedby="primary-error"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="secondary" className="block text-gray-700">Secondary Color</label>
        <input
          type="color"
          id="secondary"
          name="secondary"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
          className="mt-1 block w-16 h-10 p-0 border-0"
          aria-describedby="secondary-error"
        />
      </div>

      {error && <p id="color-error" className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ColorPaletteSelection;
