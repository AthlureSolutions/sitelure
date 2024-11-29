// packages/frontend/src/components/CreateWebsite/ContentGeneration.tsx
import React, { useState, useContext } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';
import axios from 'axios';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const ContentGeneration: React.FC<Props> = ({ nextStep, prevStep }) => {
  const { content, setContent } = useContext(WebsiteContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/generate-content', { prompt: 'Generate a professional business description for my website.' });
      setContent(response.data.content);
    } catch (err) {
      console.error(err);
      setError('Failed to generate content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      nextStep();
    } else {
      setError('Content cannot be empty.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Content</h2>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">Website Content</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your content will appear here..."
          aria-describedby="content-error"
        ></textarea>
      </div>

      {error && <p id="content-error" className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Generating...' : 'Generate with AI'}
        </button>
        <div>
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className={`ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContentGeneration;
