// packages/frontend/src/context/WebsiteContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface BusinessInfo {
  name: string;
  industry: string;
  description: string;
}

interface Colors {
  primary: string;
  secondary: string;
}

interface WebsiteContextType {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  logoUrl: string;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  colors: Colors;
  setColors: React.Dispatch<React.SetStateAction<Colors>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const WebsiteContext = createContext<WebsiteContextType>({
  businessInfo: { name: '', industry: '', description: '' },
  setBusinessInfo: () => {},
  logoUrl: '',
  setLogoUrl: () => {},
  colors: { primary: '#000000', secondary: '#FFFFFF' },
  setColors: () => {},
  content: '',
  setContent: () => {},
  template: '',
  setTemplate: () => {},
});

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({ name: '', industry: '', description: '' });
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [colors, setColors] = useState<Colors>({ primary: '#000000', secondary: '#FFFFFF' });
  const [content, setContent] = useState<string>('');
  const [template, setTemplate] = useState<string>('');

  return (
    <WebsiteContext.Provider value={{ businessInfo, setBusinessInfo, logoUrl, setLogoUrl, colors, setColors, content, setContent, template, setTemplate }}>
      {children}
    </WebsiteContext.Provider>
  );
};
