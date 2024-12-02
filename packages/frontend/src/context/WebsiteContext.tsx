// packages/frontend/src/context/WebsiteContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface BusinessInfo {
  businessName: string;
  businessEmail: string;
  businessDescription: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

interface SocialMediaLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface ContactInfo {
  phoneNumber: string;
  address: string;
  email: string;
}

interface WebsiteData {
  businessInfo: BusinessInfo;
  contactInfo: ContactInfo;
  logo: File | null;
  colorPalette: string[];
  keywords: string[]; // New field for SEO keywords
  seoSettings: SEOSettings;
  socialMediaLinks: SocialMediaLinks;
  template: string;
  content: string; // Will be generated automatically
}

interface WebsiteContextType {
  websiteData: WebsiteData;
  setBusinessInfo: (info: BusinessInfo) => void;
  setContactInfo: (info: ContactInfo) => void;
  setLogo: (logo: File) => void;
  setColorPalette: (colors: string[]) => void;
  setKeywords: (keywords: string[]) => void;
  setSEOSettings: (seo: SEOSettings) => void;
  setSocialMediaLinks: (links: SocialMediaLinks) => void;
  setTemplate: (template: string) => void;
  setContent: (content: string) => void;
  resetWebsiteData: () => void;
}

export const WebsiteContext = createContext<WebsiteContextType>({
  websiteData: {
    businessInfo: {
      businessName: '',
      businessEmail: '',
      businessDescription: '',
    },
    contactInfo: {
      phoneNumber: '',
      address: '',
      email: '',
    },
    logo: null,
    colorPalette: [],
    keywords: [],
    seoSettings: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    template: '',
    content: '',
  },
  setBusinessInfo: () => {},
  setContactInfo: () => {},
  setLogo: () => {},
  setColorPalette: () => {},
  setKeywords: () => {},
  setSEOSettings: () => {},
  setSocialMediaLinks: () => {},
  setTemplate: () => {},
  setContent: () => {},
  resetWebsiteData: () => {},
});

export const WebsiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    businessInfo: {
      businessName: '',
      businessEmail: '',
      businessDescription: '',
    },
    contactInfo: {
      phoneNumber: '',
      address: '',
      email: '',
    },
    logo: null,
    colorPalette: [],
    keywords: [],
    seoSettings: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    template: '',
    content: '',
  });

  const setBusinessInfo = (info: BusinessInfo) => {
    setWebsiteData((prev) => ({ ...prev, businessInfo: info }));
  };

  const setContactInfo = (info: ContactInfo) => {
    setWebsiteData((prev) => ({ ...prev, contactInfo: info }));
  };

  const setLogo = (logo: File) => {
    setWebsiteData((prev) => ({ ...prev, logo }));
  };

  const setColorPalette = (colors: string[]) => {
    setWebsiteData((prev) => ({ ...prev, colorPalette: colors }));
  };

  const setKeywords = (keywords: string[]) => {
    setWebsiteData((prev) => ({ ...prev, keywords }));
  };

  const setSEOSettings = (seo: SEOSettings) => {
    setWebsiteData((prev) => ({ ...prev, seoSettings: seo }));
  };

  const setSocialMediaLinks = (links: SocialMediaLinks) => {
    setWebsiteData((prev) => ({ ...prev, socialMediaLinks: links }));
  };

  const setTemplate = (template: string) => {
    setWebsiteData((prev) => ({ ...prev, template }));
  };

  const setContent = (content: string) => {
    setWebsiteData((prev) => ({ ...prev, content }));
  };

  const resetWebsiteData = () => {
    setWebsiteData({
      businessInfo: {
        businessName: '',
        businessEmail: '',
        businessDescription: '',
      },
      contactInfo: {
        phoneNumber: '',
        address: '',
        email: '',
      },
      logo: null,
      colorPalette: [],
      keywords: [],
      seoSettings: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      },
      socialMediaLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
      template: '',
      content: '',
    });
  };

  return (
    <WebsiteContext.Provider
      value={{
        websiteData,
        setBusinessInfo,
        setContactInfo,
        setLogo,
        setColorPalette,
        setKeywords,
        setSEOSettings,
        setSocialMediaLinks,
        setTemplate,
        setContent,
        resetWebsiteData,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};
