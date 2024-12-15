// packages/backend/src/controllers/websiteController.ts
import { Request, Response } from 'express';
import { createWebsite, updateWebsiteDeployUrl, getUserWebsites, getWebsiteById, deleteWebsite } from '../models/websiteModel';
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get workspace root
const getWorkspaceRoot = () => {
  return path.join(__dirname, '../../../..');
};

// Helper function to ensure directory exists
const ensureDir = async (dirPath: string) => {
  try {
    await fs.ensureDir(dirPath);
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

// Helper function to copy file
const copyFile = async (src: string, dest: string) => {
  try {
    await fs.copy(src, dest);
  } catch (error) {
    console.error('Error copying file:', error);
    throw error;
  }
};

// Helper function to create URL-friendly slug
const createSlug = (businessName: string): string => {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to generate website data using OpenAI
const generateWebsiteData = async (businessInfo: any, contactInfo: any, colors: any, socialMediaLinks: any, seoSettings: any) => {
  const prompt = `Create a modern, professional website content for ${businessInfo.name}. You MUST return a JSON object that EXACTLY matches this structure, including ALL fields:

{
  "theme": {
    "colors": {
      "primary": {
        "default": "${colors?.primary || '#3B82F6'}",
        "light": "${colors?.primaryLight || adjustColor(colors?.primary || '#3B82F6', 20)}",
        "dark": "${colors?.primaryDark || adjustColor(colors?.primary || '#3B82F6', -20)}"
      },
      "secondary": {
        "default": "${colors?.secondary || '#1E40AF'}",
        "light": "${colors?.secondaryLight || adjustColor(colors?.secondary || '#1E40AF', 20)}",
        "dark": "${colors?.secondaryDark || adjustColor(colors?.secondary || '#1E40AF', -20)}"
      },
      "accent": {
        "default": "#759186",
        "light": "#8AA39B",
        "dark": "#607F71"
      },
      "action": {
        "default": "#FFFF47",
        "light": "#FFFF7A",
        "dark": "#CCCC14"
      }
    },
    "typography": {
      "heading": "Poppins",
      "body": "Montserrat"
    }
  },
  "site": {
    "name": "${businessInfo.name}",
    "description": "${businessInfo.description || ''}",
    "defaultImage": "https://freesvg.org/img/Placeholder.png",
    "logo": {
      "src": "${businessInfo.logoUrl || 'https://freesvg.org/img/Placeholder.png'}",
      "alt": "${businessInfo.name} Logo"
    },
    "quote": {
      "text": "A compelling quote about our business",
      "author": "Business Owner",
      "role": "Founder & CEO"
    },
    "navigation": {
      "links": [
        { "text": "Home", "href": "/" },
        { "text": "About", "href": "/about" },
        { "text": "Services", "href": "/services" },
        { "text": "Contact", "href": "/contact" }
      ]
    },
    "hero": {
      "headline": "",
      "subheadline": "",
      "backgroundImage": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      "cta": {
        "primary": {
          "text": "Get Started",
          "href": "/contact"
        },
        "secondary": {
          "text": "Learn More",
          "href": "/about"
        }
      }
    },
    "features": {
      "title": "",
      "subtitle": "",
      "learnMoreText": "Learn More",
      "items": []
    },
    "services": {
      "title": "Our Services",
      "subtitle": "What we offer",
      "learnMoreText": "Learn More",
      "ctaText": "Get Started",
      "ctaLink": "/contact",
      "services": [
        {
          "id": "service-1",
          "title": "Service 1",
          "shortDescription": "Description of service 1",
          "icon": "star",
          "heroImage": "https://freesvg.org/img/Placeholder.png",
          "features": [
            {
              "title": "Feature 1",
              "description": "Description of feature 1",
              "icon": "star",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 2",
              "description": "Description of feature 2",
              "icon": "heart",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 3",
              "description": "Description of feature 3",
              "icon": "shield",
              "image": "https://freesvg.org/img/Placeholder.png"
            }
          ],
          "quote": {
            "text": "A relevant quote about this service",
            "author": "Quote Author",
            "role": "Author's Role"
          }
        },
        {
          "id": "service-2",
          "title": "Service 2",
          "shortDescription": "Description of service 2",
          "icon": "heart",
          "heroImage": "https://freesvg.org/img/Placeholder.png",
          "features": [
            {
              "title": "Feature 1",
              "description": "Description of feature 1",
              "icon": "star",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 2",
              "description": "Description of feature 2",
              "icon": "heart",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 3",
              "description": "Description of feature 3",
              "icon": "shield",
              "image": "https://freesvg.org/img/Placeholder.png"
            }
          ],
          "quote": {
            "text": "A relevant quote about this service",
            "author": "Quote Author",
            "role": "Author's Role"
          }
        },
        {
          "id": "service-3",
          "title": "Service 3",
          "shortDescription": "Description of service 3",
          "icon": "shield",
          "heroImage": "https://freesvg.org/img/Placeholder.png",
          "features": [
            {
              "title": "Feature 1",
              "description": "Description of feature 1",
              "icon": "star",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 2",
              "description": "Description of feature 2",
              "icon": "heart",
              "image": "https://freesvg.org/img/Placeholder.png"
            },
            {
              "title": "Feature 3",
              "description": "Description of feature 3",
              "icon": "shield",
              "image": "https://freesvg.org/img/Placeholder.png"
            }
          ],
          "quote": {
            "text": "A relevant quote about this service",
            "author": "Quote Author",
            "role": "Author's Role"
          }
        }
      ]
    },
    "about": {
      "title": "About ${businessInfo.name}",
      "subtitle": "Learn more about who we are",
      "heroImage": "https://freesvg.org/img/Placeholder.png",
      "ctaText": "Contact Us",
      "ctaLink": "/contact",
      "mission": {
        "title": "Our Mission",
        "description": "Brief mission statement here"
      },
      "story": {
        "title": "Our Story",
        "content": "IMPORTANT: Write a detailed story about ${businessInfo.name}'s history, values, and journey. This must be at least 100 characters long and should be engaging and professional.",
        "image": "https://freesvg.org/img/Placeholder.png",
        "imageAlt": "Our Story"
      },
      "values": [
        {
          "title": "Value 1",
          "description": "Value 1 description",
          "icon": "star"
        },
        {
          "title": "Value 2",
          "description": "Value 2 description",
          "icon": "heart"
        },
        {
          "title": "Value 3",
          "description": "Value 3 description",
          "icon": "shield"
        }
      ],
      "stats": [
        {
          "value": "100+",
          "label": "Stat 1"
        },
        {
          "value": "50+",
          "label": "Stat 2"
        },
        {
          "value": "10+",
          "label": "Stat 3"
        }
      ]
    },
    "contact": {
      "title": "",
      "subtitle": "",
      "description": "",
      "heroImage": "https://freesvg.org/img/Placeholder.png",
      "locations": [
        {
          "name": "${businessInfo.name}",
          "address": "${contactInfo.address || ''}",
          "phone": "${contactInfo.phoneNumber || ''}",
          "email": "${contactInfo.email || ''}",
          "hours": ""
        }
      ],
      "form": {
        "title": "",
        "submitText": "",
        "fields": [
          {
            "name": "name",
            "label": "Full Name",
            "type": "text",
            "required": true,
            "placeholder": "Your name"
          },
          {
            "name": "email",
            "label": "Email Address",
            "type": "email",
            "required": true,
            "placeholder": "your.email@example.com"
          },
          {
            "name": "message",
            "label": "Message",
            "type": "textarea",
            "required": true,
            "placeholder": "How can we help you?"
          }
        ]
      }
    },
    "footer": {
      "businessInfo": {
        "name": "${businessInfo.name}",
        "address": "${contactInfo.address || ''}",
        "phone": "${contactInfo.phoneNumber || ''}",
        "email": "${contactInfo.email || ''}"
      },
      "socialLinks": [
        {
          "platform": "Twitter",
          "url": "${socialMediaLinks?.twitter || '#'}",
          "icon": "twitter"
        },
        {
          "platform": "LinkedIn",
          "url": "${socialMediaLinks?.linkedin || '#'}",
          "icon": "linkedin"
        },
        {
          "platform": "Instagram",
          "url": "${socialMediaLinks?.instagram || '#'}",
          "icon": "instagram"
        }
      ],
      "quickLinks": [
        { "text": "Privacy Policy", "href": "/privacy" },
        { "text": "Terms of Service", "href": "/terms" }
      ]
    }
  }
}

Fill in the empty strings and arrays with engaging, professional content tailored to this business type: ${businessInfo.type || 'service business'}.
Business description: ${businessInfo.description || 'A professional modern business'}

The following sections need to be filled with content:
1. Hero section:
   - headline
   - subheadline

2. Features section:
   - title
   - subtitle
   - items array (3 compelling features with title, description, icon, image, and link)

3. Services section:
   - title
   - subtitle
   - services array with exactly this structure for each service:
     {
       "id": "unique-service-id",
       "title": "Service Title",
       "shortDescription": "Brief description of the service",
       "icon": "icon-name",
       "heroImage": "https://freesvg.org/img/Placeholder.png",
       "features": [
         {
           "title": "Feature Title",
           "description": "Feature description",
           "icon": "feature-icon",
           "image": "https://freesvg.org/img/Placeholder.png"
         }
       ],
       "quote": {
         "text": "A relevant quote about this service",
         "author": "Quote Author",
         "role": "Author's Role"
       }
     }
   Create 3 services following this exact structure.

4. About section:
   - title
   - subtitle
   - mission description
   - story section (title is "Our Story", content should be a compelling company story)
   - values array (3-4 values with title, description, and icon)
   - stats array (3-4 statistics with value and label)

5. Contact section:
   - title
   - subtitle
   - description
   - form title
   - form submitText
   - location hours

Important: Ensure each service has ALL required fields and follows the exact structure shown above.
Keep the content professional and aligned with the business description. Do not modify any pre-filled values or structure.

Important notes for content generation:
1. For all images (except logo), use "https://freesvg.org/img/Placeholder.png"
2. For icons in values array, use one of these values: star, heart, shield, target, users, chart
3. For icons in features and services, use one of these values: star, heart, shield, target, users, chart
4. Each service must have exactly 3 features
5. Each feature must have an icon from the list above
6. Values array must have exactly 3 items, each with a title, description, and icon
7. Stats array must have exactly 3 items, each with a value and label

Keep the content professional and aligned with the business description. Do not modify any pre-filled values or structure.`;

  const systemPrompt = `You are a professional web content creator. Your task is to generate website content that EXACTLY matches this structure:

{
  "theme": { ... },
  "site": {
    "name": "Business Name",
    "description": "Business Description",
    "quote": {
      "text": "A compelling quote about the business",
      "author": "Quote Author",
      "role": "Author Role"
    },
    "about": {
      "story": {
        "title": "Our Story",
        "content": "A detailed story about the company's history, values, and journey. This must be at least 100 characters long.",
        "image": "https://freesvg.org/img/Placeholder.png",
        "imageAlt": "Our Story"
      }
    }
  }
}

CRITICAL REQUIREMENTS:
1. The site MUST have a quote section with text, author, and role
2. The about.story section MUST have exactly these fields:
   - title: Must be exactly "Our Story"
   - content: Must be a detailed paragraph at least 100 characters long
   - image: Must be exactly "https://freesvg.org/img/Placeholder.png"
   - imageAlt: Must be exactly "Our Story"
3. The services array MUST be inside site.services.services
4. Each service MUST have exactly 3 features
5. Each service MUST have a unique ID (service-1, service-2, service-3)
6. Each feature MUST have title, description, icon, and image
7. Each service MUST have a quote with text, author, and role
8. Use ONLY these icons: star, heart, shield, target, users, chart`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        },
        {
          role: "system",
          content: `IMPORTANT: The services array MUST contain EXACTLY 3 services with this structure:
[
  {
    "id": "service-1",
    "title": "First Service",
    "shortDescription": "Description here",
    "icon": "star",
    "heroImage": "https://freesvg.org/img/Placeholder.png",
    "features": [
      {
        "title": "Feature 1",
        "description": "Feature description",
        "icon": "star",
        "image": "https://freesvg.org/img/Placeholder.png"
      },
      {
        "title": "Feature 2",
        "description": "Feature description",
        "icon": "heart",
        "image": "https://freesvg.org/img/Placeholder.png"
      },
      {
        "title": "Feature 3",
        "description": "Feature description",
        "icon": "shield",
        "image": "https://freesvg.org/img/Placeholder.png"
      }
    ],
    "quote": {
      "text": "Quote text",
      "author": "Author Name",
      "role": "Author Role"
    }
  },
  {
    "id": "service-2",
    // ... same structure as above
  },
  {
    "id": "service-3",
    // ... same structure as above
  }
]`
        }
      ],
      temperature: 0.5, // Lower temperature for more consistent output
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    const generatedData = JSON.parse(content);

    // Validate the final structure
    const validateSection = (section: any, requiredFields: string[], arrayFields: string[] = []) => {
      if (!section) {
        console.error('Section is undefined');
        return false;
      }
      
      // Check required fields
      for (const field of requiredFields) {
        if (section[field] === undefined || section[field] === '') {
          console.error(`Missing required field: ${field}`);
          return false;
        }
      }
      
      // Check array fields
      for (const field of arrayFields) {
        if (!Array.isArray(section[field]) || section[field].length === 0) {
          console.error(`Missing or empty array field: ${field}`);
          return false;
        }
      }
      
      return true;
    };

    // Helper function to validate icons
    const validIcons = ['star', 'heart', 'shield', 'target', 'users', 'chart'];
    const validateIcon = (icon: string) => validIcons.includes(icon);

    // Update the story validation function
    const validateStorySection = (story: any) => {
      console.log('Validating story section:', JSON.stringify(story, null, 2));

      if (!story || typeof story !== 'object') {
        console.error('Story section is missing or not an object');
        return false;
      }

      // Check for missing fields
      const requiredFields = ['title', 'content', 'image', 'imageAlt'];
      const missingFields = requiredFields.filter(field => 
        !story[field] || typeof story[field] !== 'string' || story[field].trim() === ''
      );

      if (missingFields.length > 0) {
        console.error(`Story section is missing required fields: ${missingFields.join(', ')}`);
        console.error('Current story data:', JSON.stringify(story, null, 2));
        return false;
      }

      // Validate exact values
      const exactValues = {
        title: 'Our Story',
        image: 'https://freesvg.org/img/Placeholder.png',
        imageAlt: 'Our Story'
      };

      for (const [field, expectedValue] of Object.entries(exactValues)) {
        if (story[field] !== expectedValue) {
          console.error(`Story ${field} must be exactly "${expectedValue}", got: "${story[field]}"`);
          return false;
        }
      }

      // Validate content length
      if (story.content.length < 100) {
        console.error('Story content must be a detailed paragraph (at least 100 characters)');
        return false;
      }

      return true;
    };

    // Validate service items
    const validateServiceItems = (services: any[]) => {
      if (!Array.isArray(services)) {
        console.error('Services must be an array');
        return false;
      }

      if (services.length !== 3) {
        console.error('Must have exactly 3 services');
        return false;
      }
      
      for (const service of services) {
        if (!validateSection(service, 
          ['id', 'title', 'shortDescription', 'icon', 'heroImage'], 
          ['features']
        )) {
          console.error('Service missing required fields:', service);
          return false;
        }
        
        if (!validateIcon(service.icon)) {
          console.error(`Invalid icon in service: ${service.icon}`);
          return false;
        }

        // Validate each feature in the service
        if (!Array.isArray(service.features)) {
          console.error('Service features must be an array');
          return false;
        }

        if (service.features.length !== 3) {
          console.error('Service must have exactly 3 features');
          return false;
        }

        for (const feature of service.features) {
          if (!validateSection(feature, 
            ['title', 'description', 'icon', 'image']
          )) {
            console.error('Feature missing required fields:', feature);
            return false;
          }

          if (!validateIcon(feature.icon)) {
            console.error(`Invalid icon in feature: ${feature.icon}`);
            return false;
          }
        }

        // Validate quote
        if (!validateSection(service.quote, 
          ['text', 'author', 'role']
        )) {
          console.error('Quote missing required fields:', service.quote);
          return false;
        }
      }
      return true;
    };

    // Validate feature items
    const validateFeatureItems = (features: any[]) => {
      if (!Array.isArray(features) || features.length !== 3) {
        console.error('Features array must have exactly 3 items');
        return false;
      }
      
      for (const feature of features) {
        if (!validateSection(feature, 
          ['title', 'description', 'icon', 'image', 'link']
        )) return false;

        if (!validateIcon(feature.icon)) {
          console.error(`Invalid icon in feature: ${feature.icon}`);
          return false;
        }
      }
      return true;
    };

    // Validate value items
    const validateValueItems = (values: any[]) => {
      if (!Array.isArray(values) || values.length !== 3) {
        console.error('Values array must have exactly 3 items');
        return false;
      }
      
      for (const value of values) {
        if (!validateSection(value, 
          ['title', 'description', 'icon']
        )) return false;

        if (!validateIcon(value.icon)) {
          console.error(`Invalid icon in value: ${value.icon}`);
          return false;
        }
      }
      return true;
    };

    // Validate stat items
    const validateStatItems = (stats: any[]) => {
      if (!Array.isArray(stats) || stats.length !== 3) {
        console.error('Stats array must have exactly 3 items');
        return false;
      }
      
      for (const stat of stats) {
        if (!validateSection(stat, 
          ['value', 'label']
        )) return false;
      }
      return true;
    };

    // Validate hero section
    if (!validateSection(generatedData.site.hero, ['headline', 'subheadline'])) {
      throw new Error('Generated data is missing required hero fields');
    }

    // Validate features section
    if (!validateSection(generatedData.site.features, ['title', 'subtitle'], ['items']) ||
        !validateFeatureItems(generatedData.site.features.items)) {
      throw new Error('Generated data is missing required features fields or has invalid items');
    }

    // Validate services section
    if (!validateSection(generatedData.site.services, 
      ['title', 'subtitle', 'learnMoreText', 'ctaText', 'ctaLink', 'services'], 
      []
    )) {
      console.error('Services section missing required fields:', JSON.stringify(generatedData.site.services, null, 2));
      throw new Error('Generated data is missing required services section fields');
    }

    // Validate services array
    if (!Array.isArray(generatedData.site.services.services)) {
      console.error('Services array is not an array:', typeof generatedData.site.services.services);
      throw new Error('Services array is not properly structured');
    }

    if (generatedData.site.services.services.length !== 3) {
      console.error('Services array must have exactly 3 items, got:', generatedData.site.services.services.length);
      throw new Error('Services array must have exactly 3 items');
    }

    // Log the services array for debugging
    console.log('Services array:', JSON.stringify(generatedData.site.services.services, null, 2));

    if (!validateServiceItems(generatedData.site.services.services)) {
      console.error('Services validation failed:', JSON.stringify(generatedData.site.services.services, null, 2));
      throw new Error('Generated data has invalid services array');
    }

    // Add additional validation for service IDs
    const serviceIds = new Set();
    for (const service of generatedData.site.services.services) {
      if (!service.id || typeof service.id !== 'string') {
        console.error('Service missing ID or ID is not a string:', service);
        throw new Error('Each service must have a unique string ID');
      }
      if (serviceIds.has(service.id)) {
        console.error('Duplicate service ID found:', service.id);
        throw new Error('Service IDs must be unique');
      }
      serviceIds.add(service.id);
    }

    // Validate about section
    if (!validateSection(generatedData.site.about, ['title', 'subtitle'], ['values', 'stats']) ||
        !validateValueItems(generatedData.site.about.values) ||
        !validateStatItems(generatedData.site.about.stats)) {
      throw new Error('Generated data is missing required about fields or has invalid values/stats');
    }

    // Validate mission section
    if (!validateSection(generatedData.site.about.mission, ['title', 'description'])) {
      throw new Error('Generated data is missing required mission fields');
    }

    // Validate story section
    if (!validateStorySection(generatedData.site.about.story)) {
      console.error('Story validation failed:', JSON.stringify(generatedData.site.about.story, null, 2));
      throw new Error('Generated data is missing required story fields or has invalid values');
    }

    // Validate contact section
    if (!validateSection(generatedData.site.contact, ['title', 'subtitle', 'description'])) {
      throw new Error('Generated data is missing required contact fields');
    }

    // Validate form section
    if (!validateSection(generatedData.site.contact.form, ['title', 'submitText'])) {
      throw new Error('Generated data is missing required form fields');
    }

    // Validate location hours
    if (!generatedData.site.contact.locations?.[0]?.hours) {
      throw new Error('Generated data is missing location hours');
    }

    // Log the generated data for debugging
    console.log('Generated website data:', JSON.stringify(generatedData, null, 2));

    // Add validation specifically for services structure
    const validateServicesStructure = (data: any) => {
      if (!data?.site?.services?.services) {
        console.error('Missing services array at site.services.services');
        return false;
      }

      const services = data.site.services.services;
      if (!Array.isArray(services)) {
        console.error('services is not an array:', typeof services);
        return false;
      }

      if (services.length !== 3) {
        console.error('Must have exactly 3 services, got:', services.length);
        return false;
      }

      return true;
    };

    // Update the validation check
    if (!validateServicesStructure(generatedData)) {
      throw new Error('Generated data does not match required services structure');
    }

    // Add site-level quote validation
    if (!validateSection(generatedData.site.quote, ['text', 'author', 'role'])) {
      console.error('Site-level quote missing required fields:', JSON.stringify(generatedData.site.quote, null, 2));
      throw new Error('Generated data is missing required site-level quote fields');
    }

    return generatedData;
  } catch (error) {
    console.error('Error generating website data:', error);
    throw error;
  }
};

// Helper function to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(Math.min(parseInt(hex.substring(0, 2), 16) + amount, 0));
  const g = Math.max(Math.min(parseInt(hex.substring(2, 4), 16) + amount, 255), 0);
  const b = Math.max(Math.min(parseInt(hex.substring(4, 6), 16) + amount, 255), 0);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const uploadImageHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get workspace root for correct path resolution
    const workspaceRoot = getWorkspaceRoot();
    
    // Copy the uploaded file to Astro template's public directory
    const publicDir = path.join(workspaceRoot, 'packages', 'astro-template-modern', 'public', 'uploads');
    console.log('Creating uploads directory at:', publicDir);
    
    // Create uploads directory if it doesn't exist
    try {
      await fs.ensureDir(publicDir);
      console.log('Uploads directory created/verified');
    } catch (dirError: any) {
      console.error('Error creating uploads directory:', dirError);
      throw new Error(`Failed to create uploads directory: ${dirError.message}`);
    }

    const fileName = req.file.filename;
    const sourcePath = req.file.path;
    const targetPath = path.join(publicDir, fileName);

    console.log('Copying file:', {
      sourcePath,
      targetPath,
      fileName
    });

    // Copy file to public directory
    try {
      await fs.copy(sourcePath, targetPath);
      console.log('File copied successfully');
    } catch (copyError: any) {
      console.error('Error copying file:', copyError);
      throw new Error(`Failed to copy uploaded file: ${copyError.message}`);
    }

    // Return the public URL for the image
    const imageUrl = `/uploads/${fileName}`;
    console.log('Image uploaded successfully:', imageUrl);
    
    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Image upload error:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createWebsiteHandler = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user;
  
  try {
    // Validate request body
    if (!req.body) {
      throw new Error('Request body is empty');
    }

    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    const { businessInfo, contactInfo, logoUrl, colors, socialMediaLinks, seoSettings, template } = req.body;

    // Validate required fields
    if (!businessInfo?.name) {
      throw new Error('Business name is required');
    }

    if (!contactInfo?.email) {
      throw new Error('Contact email is required');
    }

    try {
      // Generate and validate website content first
      console.log('Generating website content...');
      let websiteData;
      try {
        websiteData = await generateWebsiteData(
          businessInfo,
          contactInfo,
          colors,
          socialMediaLinks,
          seoSettings
        );
        console.log('Content generation successful');
      } catch (error) {
        console.error('Content generation failed:', error);
        throw new Error(`Failed to generate website content: ${error}`);
      }

      // Validate the generated content structure
      console.log('Validating generated content...');
      try {
        // Write content to a temporary file to test if it's valid
        const tempDir = path.join(getWorkspaceRoot(), 'temp');
        await fs.ensureDir(tempDir);
        const tempFile = path.join(tempDir, 'websiteData.json');
        await fs.writeJSON(tempFile, websiteData, { spaces: 2 });
        
        // If we get here, the JSON is valid
        console.log('Content validation successful');
        
        // Clean up temp file
        await fs.remove(tempFile);
      } catch (error) {
        console.error('Content validation failed:', error);
        throw new Error(`Generated content is invalid: ${error}`);
      }

      // Only proceed with website creation if content is valid
      console.log('Creating website record...');
      
      // Create a new website record in PostgreSQL
      const website = await createWebsite({
        ownerId: userId,
         
        // Business Information
        businessName: businessInfo.name,
        businessEmail: businessInfo.email,
        businessDescription: businessInfo.description || '',
        
        // Contact Information
        contactEmail: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber || '',
        address: contactInfo.address || '',

        // Design
        logoUrl: logoUrl || '',
        primaryColor: colors?.primary || '#3B82F6',
        secondaryColor: colors?.secondary || '#1E40AF',
        template: template || 'default',

        // Social Media Links
        facebookUrl: socialMediaLinks?.facebook || '',
        twitterUrl: socialMediaLinks?.twitter || '',
        instagramUrl: socialMediaLinks?.instagram || '',
        linkedinUrl: socialMediaLinks?.linkedin || '',

        // SEO Settings
        metaTitle: seoSettings?.metaTitle || businessInfo.name,
        metaDescription: seoSettings?.metaDescription || businessInfo.description || '',
        metaKeywords: seoSettings?.metaKeywords || '',

        // Content - will be populated later
        content: req.body.content || '',
      });

      console.log('Website created in database:', website);

      try {
        // Generate Astro site
        const workspaceRoot = getWorkspaceRoot();
        const astroTemplatePath = path.join(workspaceRoot, 'packages', 'astro-template-modern');
        console.log('Looking for Astro template at:', astroTemplatePath);
        
        if (!fs.existsSync(astroTemplatePath)) {
          throw new Error(`Astro template not found at: ${astroTemplatePath}`);
        }

        const generatedSitesPath = path.join(workspaceRoot, 'packages', 'backend', 'generated-sites');
        await fs.ensureDir(generatedSitesPath);

        const generatedPath = path.join(generatedSitesPath, website.id);
        await fs.ensureDir(generatedPath);

        await fs.copy(astroTemplatePath, generatedPath);
        console.log('Astro template copied to:', generatedPath);

        // Copy logo to public directory if it exists
        if (logoUrl && logoUrl.startsWith('/uploads/')) {
          const srcPath = path.join(astroTemplatePath, 'public', logoUrl);
          const destPath = path.join(generatedPath, 'public', logoUrl);
          await fs.copy(srcPath, destPath);
        }

        // Write the generated data to websiteData.json
        const dataPath = path.join(generatedPath, 'src', 'data', 'websiteData.json');
        await fs.writeJSON(dataPath, websiteData, { spaces: 2 });
        console.log('Website data written to:', dataPath);

        try {
          // Install dependencies
          console.log('Installing dependencies...');
          await new Promise<void>((resolve, reject) => {
            exec('npm install', { cwd: generatedPath }, (error, stdout, stderr) => {
              if (error) {
                console.error('Error installing dependencies:', { error, stderr });
                return reject(new Error(`Failed to install dependencies: ${stderr}`));
              }
              console.log('Dependencies installed:', stdout);
              resolve();
            });
          });

          // Build site
          console.log('Building Astro site...');
          await new Promise<void>((resolve, reject) => {
            exec('npm run build', { cwd: generatedPath }, (error, stdout, stderr) => {
              if (error) {
                console.error('Error building site:', { error, stderr });
                return reject(new Error(`Failed to build site: ${stderr}`));
              }
              console.log('Build completed:', stdout);
              resolve();
            });
          });

          try {
            // Deploy to Netlify
            if (!process.env.NETLIFY_API_TOKEN) {
              throw new Error('NETLIFY_API_TOKEN is not configured');
            }

            console.log('Creating Netlify site...');
            const sanitizedBusinessName = businessInfo.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            const netlifyResponse = await axios.post('https://api.netlify.com/api/v1/sites', {
              name: `${sanitizedBusinessName}-sitelure-${website.id.slice(0, 8)}`,
            }, {
              headers: {
                Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
            });

            const siteId = netlifyResponse.data.id;
            console.log('Netlify site created:', siteId);

            // Zip the dist folder
            const distPath = path.join(generatedPath, 'dist');
            if (!fs.existsSync(distPath)) {
              throw new Error(`Dist folder not found at: ${distPath}`);
            }

            const zipPath = path.join(generatedPath, 'site.zip');
            const zip = new AdmZip();
            zip.addLocalFolder(distPath);
            zip.writeZip(zipPath);
            console.log('Site zipped for deployment');

            // Deploy to Netlify
            console.log('Deploying to Netlify...');
            const deployResponse = await axios.post(
              `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
              fs.readFileSync(zipPath),
              {
                headers: {
                  Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
                  'Content-Type': 'application/zip',
                },
              }
            );

            const deployUrl = deployResponse.data.deploy_url;
            console.log('Site deployed at:', deployUrl);

            // Update website record with deploy URL
            await updateWebsiteDeployUrl(website.id, deployUrl);

            // Cleanup
            await fs.remove(zipPath);
            console.log('Temporary zip file removed');

            return res.status(201).json({ 
              websiteId: website.id, 
              deployUrl: deployUrl 
            });
          } catch (deployError: any) {
            throw new Error(`Deployment failed: ${deployError.message}`);
          }
        } catch (buildError: any) {
          throw new Error(`Build process failed: ${buildError.message}`);
        }
      } catch (fileError: any) {
        throw new Error(`File operations failed: ${fileError.message}`);
      }
    } catch (dbError: any) {
      throw new Error(`Database operation failed: ${dbError.message}`);
    }
  } catch (error: any) {
    console.error('Website Creation Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Send appropriate error response
    res.status(500).json({ 
      message: 'Failed to create website.',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        response: error.response?.data
      } : undefined
    });
  }
};

export const getUserWebsitesHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user;
    const websites = await getUserWebsites(userId);
    res.status(200).json(websites);
  } catch (error: any) {
    console.error('Error fetching user websites:', error);
    res.status(500).json({ 
      message: 'Failed to fetch websites',
      error: error.message 
    });
  }
};

export const getWebsiteDetailsHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user;
    const websiteId = req.params.id;
    
    const website = await getWebsiteById(websiteId, userId);
    
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.status(200).json(website);
  } catch (error: any) {
    console.error('Error fetching website details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch website details',
      error: error.message 
    });
  }
};

export const deleteWebsiteHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user;
    const websiteId = req.params.id;

    // Check if website exists and belongs to user
    const website = await getWebsiteById(websiteId, userId);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // Delete from Netlify if deployUrl exists
    if (website.deployUrl) {
      try {
        // Extract deploy ID from the URL
        // Example URL: http://674df83c7778d40096d13de5--test-gym-yeah-sitelure-407723bb
        const deployUrl = website.deployUrl;
        const deployId = deployUrl.split('//')[1].split('--')[0];
        
        console.log('Fetching Netlify site details for deploy ID:', deployId);
        
        // First, get all sites
        const sitesResponse = await axios.get('https://api.netlify.com/api/v1/sites', {
          headers: {
            'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
          }
        });

        // Find the site with matching deploy ID
        const site = sitesResponse.data.find((s: any) => 
          s.deploy_id === deployId || 
          s.id === deployId || 
          s.site_id === deployId
        );

        if (site) {
          console.log('Found Netlify site:', site.name, 'with ID:', site.id);
          await axios.delete(`https://api.netlify.com/api/v1/sites/${site.id}`, {
            headers: {
              'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
            }
          });
          console.log('Successfully deleted Netlify site');
        } else {
          console.log('No matching Netlify site found for deploy ID:', deployId);
        }
      } catch (error: any) {
        console.error('Error deleting Netlify site:', error.response?.data || error.message);
        // Continue with website deletion even if Netlify deletion fails
      }
    }

    // Delete from database
    await deleteWebsite(websiteId, userId);

    // Delete generated files if they exist
    const workspaceRoot = getWorkspaceRoot();
    const generatedPath = path.join(workspaceRoot, 'packages', 'backend', 'generated-sites', websiteId);
    if (fs.existsSync(generatedPath)) {
      await fs.remove(generatedPath);
      console.log('Deleted generated files at:', generatedPath);
    }

    res.status(200).json({ message: 'Website deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting website:', error);
    res.status(500).json({ 
      message: 'Failed to delete website',
      error: error.message 
    });
  }
};
