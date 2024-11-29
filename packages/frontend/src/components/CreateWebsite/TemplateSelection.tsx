// packages/frontend/src/components/CreateWebsite/TemplateSelection.tsx
import React, { useState, useContext } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
}

const templates: Template[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'A clean and professional template suitable for any business.',
    image: '/assets/templates/modern-business.png',
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'A vibrant and creative template perfect for agencies.',
    image: '/assets/templates/creative-agency.png',
  },
  // Add more templates as needed
];

const TemplateSelection: React.FC<Props> = ({ nextStep, prevStep }) => {
  const { template, setTemplate } = useContext(WebsiteContext);
  const [selected, setSelected] = useState<string>(template);
  const [error, setError] = useState<string>('');

  const handleSelect = (id: string) => {
    setSelected(id);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setTemplate(selected);
      nextStep();
    } else {
      setError('Please select a template.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a Template</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => handleSelect(tpl.id)}
            className={`border rounded-lg p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selected === tpl.id ? 'border-blue-600' : 'border-gray-300'
            }`}
            role="button"
            tabIndex={0}
            aria-pressed={selected === tpl.id}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelect(tpl.id);
              }
            }}
          >
            <img src={tpl.image} alt={`${tpl.name} Template`} className="w-full h-40 object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{tpl.name}</h3>
            <p className="text-gray-600">{tpl.description}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
          disabled={!selected}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            !selected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default TemplateSelection;
