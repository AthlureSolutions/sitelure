// packages/frontend/src/components/CreateWebsite/SocialMediaAndTemplateForm.tsx

import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../../context/WebsiteContext';

interface SocialMediaAndTemplateFormProps {
  nextStep: () => void;
  prevStep: () => void;
}

const availableTemplates = [
  { name: 'Modern Business Template', description: 'A professional, modern business website template with clean design and optimized user experience.' },
];

const SocialMediaAndTemplateForm: React.FC<SocialMediaAndTemplateFormProps> = ({ nextStep, prevStep }) => {
  const { websiteData, setSocialMediaLinks, setTemplate, setKeywords } = useContext(WebsiteContext);
  const [facebook, setFacebook] = useState<string>(websiteData.socialMediaLinks.facebook);
  const [twitter, setTwitter] = useState<string>(websiteData.socialMediaLinks.twitter);
  const [instagram, setInstagram] = useState<string>(websiteData.socialMediaLinks.instagram);
  const [linkedin, setLinkedin] = useState<string>(websiteData.socialMediaLinks.linkedin);
  const [keywordsInput, setKeywordsInput] = useState<string>(websiteData.keywords.join(', '));
  const [selectedTemplate, setSelectedTemplate] = useState<string>(websiteData.template);
  const [error, setError] = useState<string>('');

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Process keywords
    const keywordsArray = keywordsInput
      .split(',')
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0);

    if (keywordsArray.length === 0) {
      setError('Please enter at least one keyword.');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template.');
      return;
    }

    setSocialMediaLinks({
      facebook,
      twitter,
      instagram,
      linkedin,
    });
    setKeywords(keywordsArray);
    setTemplate(selectedTemplate);

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Social Media & Template</h2>
      {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-center">{error}</div>}

      {/* Social Media Links */}
      <div className="glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="facebook" className="block text-gray-300 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              placeholder="https://facebook.com/yourprofile"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-gray-300 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              placeholder="https://twitter.com/yourprofile"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-gray-300 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-gray-300 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                       text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                       transition-all duration-200"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>

      {/* Keywords Input */}
      <div className="glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Keywords for SEO</h3>
        <label htmlFor="keywords" className="block text-gray-300 mb-2">
          Enter keywords you want to rank for (separated by commas)
        </label>
        <input
          type="text"
          id="keywords"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg p-3 
                   text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-[#00D8FF] focus:border-transparent
                   transition-all duration-200"
          placeholder="e.g., web development, AI solutions, digital marketing"
        />
      </div>

      {/* Template Selection */}
      <div className="glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Template</h3>
        <div className="grid grid-cols-1 gap-6">
          {availableTemplates.map((template) => (
            <div
              key={template.name}
              onClick={() => handleTemplateSelect(template.name)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                ${selectedTemplate === template.name 
                  ? 'border-[#00D8FF] shadow-[0_0_15px_rgba(0,216,255,0.3)]' 
                  : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className="aspect-video bg-[#2A2A2A] rounded-lg mb-3"></div>
              <h4 className="text-white font-medium mb-1">{template.name}</h4>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="btn-modern-sm"
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn-modern px-8 py-2"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default SocialMediaAndTemplateForm;
