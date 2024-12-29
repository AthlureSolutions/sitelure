// packages/backend/src/controllers/websiteController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createWebsite, updateWebsiteDeployUrl } from '../models/websiteModel';
import path from 'path';
import fs from 'fs-extra';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import OpenAI from 'openai';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// Helper function to get workspace root
const getWorkspaceRoot = () => {
  return path.join(__dirname, '..', '..', '..', '..');
};

// Helper function to generate website data using OpenAI
const generateWebsiteData = async (businessInfo: any, contactInfo: any, colors: any, socialMediaLinks: any, seoSettings: any) => {
  const prompt = `Create a modern, professional website content for ${businessInfo.name}. You MUST return a JSON object that EXACTLY matches this structure, including ALL fields:

{
  "site": {
    "name": "${businessInfo.name}",
    "description": "${businessInfo.description || ''}",
    "defaultImage": "https://freesvg.org/img/Placeholder.png",
    "logo": { 
      "src": "${businessInfo.logoUrl}",
      "alt": "${businessInfo.name} Logo"
    },
    "branding": {
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
            "default": "#10B981",
            "light": "#34D399",
            "dark": "#059669"
          },
          "action": {
            "default": "#3B82F6",
            "light": "#60A5FA",
            "dark": "#2563EB"
          }
        },
        "typography": {
          "heading": "Poppins",
          "body": "Montserrat"
        }
      }
    },
    "navigation": {
      "links": [
        { "text": "Home", "href": "/" },
        { "text": "About", "href": "/about" },
        { "text": "Services", "href": "/services" },
        { "text": "Contact", "href": "/contact" }
      ]
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
  },
  "pages": {
    "home": {
      "hero": {
        "headline": "",
        "subheadline": "",
        "backgroundImage": "https://freesvg.org/img/Placeholder.png",
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
      "quote": {
        "text": "",
        "author": "",
        "role": ""
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
        "items": []
      },
      "testimonials": {
        "title": "What Our Clients Say",
        "subtitle": "Hear from our satisfied clients",
        "items": []
      }
    },
    "about": {
      "hero": {
        "headline": "About Us",
        "subheadline": "",
        "backgroundImage": "https://freesvg.org/img/Placeholder.png"
      },
      "mission": {
        "title": "Our Mission",
        "description": ""
      },
      "story": {
        "title": "Our Story",
        "content": "",
        "image": "https://freesvg.org/img/Placeholder.png",
        "imageAlt": "Our Story"
      },
      "values": {
        "title": "Our Values",
        "subtitle": "What drives us forward",
        "items": []
      },
      "stats": {
        "title": "Our Impact",
        "subtitle": "Numbers that speak for themselves",
        "items": []
      }
    },
    "services": {
      "hero": {
        "headline": "Our Services",
        "subheadline": "",
        "backgroundImage": "https://freesvg.org/img/Placeholder.png"
      },
      "services": {
        "title": "What We Offer",
        "subtitle": "Comprehensive solutions for your needs",
        "items": []
      }
    },
    "servicePages": {},
    "contact": {
      "hero": {
        "headline": "Contact Us",
        "subheadline": "Get in touch with our team",
        "backgroundImage": "https://freesvg.org/img/Placeholder.png"
      },
      "form": {
        "title": "Send us a Message",
        "submitText": "Send Message",
        "fields": [
          {
            "name": "name",
            "label": "Your Name",
            "type": "text",
            "required": true
          },
          {
            "name": "email",
            "label": "Email Address",
            "type": "email",
            "required": true
          },
          {
            "name": "message",
            "label": "Your Message",
            "type": "textarea",
            "required": true
          }
        ]
      },
      "locations": [
        {
          "name": "${businessInfo.name}",
          "address": "${contactInfo.address || ''}",
          "phone": "${contactInfo.phoneNumber || ''}",
          "email": "${contactInfo.email || ''}",
          "hours": "Monday - Friday: 9:00 AM - 5:00 PM"
        }
      ]
    }
  }
}

Important notes for content generation:
1. For all images (except logo), use "https://freesvg.org/img/Placeholder.png"
2. For icons in values array, use one of these values: star, heart, shield, target, users, chart
3. For icons in features and services, use one of these values: star, heart, shield, target, users, chart
4. Each service must have exactly 3 features
5. Each feature must have an icon from the list above
6. Values array must have exactly 3 items, each with a title, description, and icon
7. Stats array must have exactly 3 items, each with a value and label
8. Each service must have a unique ID (service-1, service-2, service-3)
9. Each service must have a quote with text, author, and role
10. The story content must be at least 100 characters long

Keep the content professional and aligned with the business description. Do not modify any pre-filled values or structure.`;

  const systemPrompt = `You are a professional web content creator. Your task is to generate website content that aligns with ${businessInfo.description}


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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    const generatedData = JSON.parse(content);

    // Validate the entire data structure
    if (!validateWebsiteData(generatedData)) {
      throw new Error('Generated data does not match required structure');
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
  const r = Math.max(Math.min(parseInt(hex.substring(0, 2), 16) + amount, 255), 0);
  const g = Math.max(Math.min(parseInt(hex.substring(2, 4), 16) + amount, 255), 0);
  const b = Math.max(Math.min(parseInt(hex.substring(4, 6), 16) + amount, 255), 0);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Validation helper functions
const validateSection = (section: any, requiredFields: string[], arrayFields: string[] = []) => {
  if (!section) {
    console.error('Section is undefined');
    return false;
  }
  
  for (const field of requiredFields) {
    if (section[field] === undefined || section[field] === '') {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  for (const field of arrayFields) {
    if (!Array.isArray(section[field]) || section[field].length === 0) {
      console.error(`Missing or empty array field: ${field}`);
      return false;
    }
  }
  
  return true;
};

const validateWebsiteData = (data: any): boolean => {
  try {
    // Validate site configuration
    if (!validateSection(data.site, ['name', 'description', 'branding', 'navigation', 'footer'])) {
      return false;
    }

    // Validate pages structure
    if (!data.pages) {
      console.error('Missing pages structure');
      return false;
    }

    // Validate home page
    const home = data.pages.home;
    if (!validateSection(home, ['hero', 'quote', 'features', 'services', 'testimonials'])) {
      return false;
    }

    // Validate about page
    const about = data.pages.about;
    if (!validateSection(about, ['hero', 'mission', 'story', 'values', 'stats'])) {
      return false;
    }

    // Validate services page
    const services = data.pages.services;
    if (!validateSection(services, ['hero', 'services'])) {
      return false;
    }

    // Validate contact page
    const contact = data.pages.contact;
    if (!validateSection(contact, ['hero', 'form', 'locations'])) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};

// Add the upload image handler
export const uploadImageHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { image } = req.body;
    
    if (!image) {
      res.status(400).json({ error: 'No image data provided' });
      return;
    }

    // Generate a temporary ID for the upload
    const tempId = `temp_${Date.now()}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: `sitelure/${tempId}`,
      resource_type: 'auto',
      quality: 'auto:best',
      fetch_format: 'auto',
      format: 'webp',
      transformation: [
        { width: 'auto', crop: 'scale', dpr: 'auto' },
        { quality: 'auto' }
      ]
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Add new helper for cached npm install
const installDependenciesWithCache = async (generatedPath: string) => {
  const workspaceRoot = getWorkspaceRoot();
  const cacheDir = path.join(workspaceRoot, 'packages', 'backend', '.npm-cache');
  
  try {
    // Create cache directory if it doesn't exist
    await fs.ensureDir(cacheDir);
    
    // Copy cached node_modules if they exist
    const cachedModules = path.join(cacheDir, 'node_modules');
    if (await fs.pathExists(cachedModules)) {
      console.log('Using cached node_modules...');
      await fs.copy(cachedModules, path.join(generatedPath, 'node_modules'));
      return;
    }

    // Install dependencies
    console.log('Installing dependencies...');
    await new Promise<void>((resolve, reject) => {
      exec('npm install', { cwd: generatedPath }, async (error, stdout, stderr) => {
        if (error) {
          console.error('Error installing dependencies:', { error, stderr });
          return reject(new Error(`Failed to install dependencies: ${stderr}`));
        }
        
        // Cache the node_modules for future use
        try {
          await fs.copy(
            path.join(generatedPath, 'node_modules'),
            cachedModules
          );
          console.log('Dependencies cached successfully');
        } catch (cacheError) {
          console.warn('Failed to cache dependencies:', cacheError);
          // Don't reject - caching failure shouldn't stop the process
        }
        
        console.log('Dependencies installed:', stdout);
        resolve();
      });
    });
  } catch (error) {
    throw new Error(`Failed to handle dependencies: ${error}`);
  }
};

// Add new helper for template setup
const setupSiteFromTemplate = async (templatePath: string, targetPath: string) => {
  try {
    // Create target directory if it doesn't exist
    await fs.promises.mkdir(targetPath, { recursive: true });

    // Define patterns for files/directories to exclude
    const excludePatterns = [
      'node_modules',
      'dist',
      '.git',
      '.astro',
      '.env',
      '.env.*',
      '*.log',
      'coverage',
      'test',
      'tests',
      '*.test.*',
      '*.spec.*'
    ];

    // Copy all files from template to target
    await copyFiles(templatePath, targetPath, excludePatterns);

    // Create uploads directory
    await fs.promises.mkdir(path.join(targetPath, 'public', 'uploads'), { recursive: true });

    console.log('Template setup completed successfully');
  } catch (error) {
    console.error('Error setting up site from template:', error);
    throw new Error('Failed to setup site from template');
  }
};

const copyFiles = async (src: string, dest: string, excludePatterns: string[]) => {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded patterns
    if (excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(entry.name);
      }
      return entry.name === pattern;
    })) {
      continue;
    }

    if (entry.isDirectory()) {
      await fs.promises.mkdir(destPath, { recursive: true });
      await copyFiles(srcPath, destPath, excludePatterns);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

// Write website content helper
const writeWebsiteContent = async (targetPath: string, content: any) => {
  const dataPath = path.join(targetPath, 'src', 'data', 'websiteData.json');
  await fs.writeJSON(dataPath, content, { spaces: 2 });
};

// Build site helper
const buildSite = async (targetPath: string) => {
  return new Promise<void>((resolve, reject) => {
    exec('npm run build', { cwd: targetPath }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error building site:', { error, stderr });
        return reject(new Error(`Failed to build site: ${stderr}`));
      }
      console.log('Build completed:', stdout);
      resolve();
    });
  });
};

// Deploy to Netlify helper
const deployToNetlify = async (targetPath: string, websiteId: string) => {
  if (!process.env.NETLIFY_API_TOKEN) {
    throw new Error('NETLIFY_API_TOKEN is not configured');
  }

  // Create site on Netlify
  const netlifyResponse = await axios.post('https://api.netlify.com/api/v1/sites', {
    name: `sitelure-${websiteId}`,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const siteId = netlifyResponse.data.id;
  console.log('Netlify site created:', siteId);

  // Create zip in memory
  const zip = new AdmZip();
  const distPath = path.join(targetPath, 'dist');
  zip.addLocalFolder(distPath);
  const zipBuffer = zip.toBuffer();

  // Deploy using buffer
  const deployResponse = await axios.post(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
    zipBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/zip',
      },
    }
  );

  // Get the production URL instead of the deploy URL
  const siteUrl = netlifyResponse.data.ssl_url || netlifyResponse.data.url;
  return siteUrl;
};

export const createWebsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteData = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Ensure required objects exist with defaults
    const businessInfo = {
      ...websiteData.businessInfo,
      logoUrl: websiteData.logoUrl // Make sure logo URL is available in businessInfo
    };
    const contactInfo = websiteData.contactInfo || {};
    const designSettings = websiteData.designSettings || { colors: {}, template: 'modern' };
    const socialMediaLinks = websiteData.socialMediaLinks || {};
    const seoSettings = websiteData.seoSettings || {};

    // Generate a unique website ID
    const websiteId = `site-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Get paths
    const workspaceRoot = path.resolve(__dirname, '../../../..');
    const templatePath = path.join(workspaceRoot, 'packages', 'astro-template-modern');
    const targetPath = path.join(workspaceRoot, 'websites', websiteId);

    console.log('Template path:', templatePath);
    console.log('Target path:', targetPath);

    // Setup site from template
    await setupSiteFromTemplate(templatePath, targetPath);

    // Generate website content using OpenAI
    const content = await generateWebsiteData(
      businessInfo,
      contactInfo,
      designSettings.colors,
      socialMediaLinks,
      seoSettings
    );

    // Write website data to JSON file
    const dataPath = path.join(targetPath, 'src', 'data');
    await fs.promises.mkdir(dataPath, { recursive: true });
    await fs.promises.writeFile(
      path.join(dataPath, 'websiteData.json'),
      JSON.stringify(content, null, 2)
    );

    // Create website record in database
    const website = await createWebsite({
      ownerId: userId,
      businessName: businessInfo.name || '',
      businessEmail: businessInfo.email || '',
      businessDescription: businessInfo.description || '',
      contactEmail: contactInfo.email || '',
      phoneNumber: contactInfo.phoneNumber || '',
      address: contactInfo.address || '',
      logoUrl: businessInfo.logoUrl || '',
      primaryColor: designSettings.colors?.primary || '#3B82F6',
      secondaryColor: designSettings.colors?.secondary || '#1E40AF',
      template: designSettings.template || 'modern',
      facebookUrl: socialMediaLinks.facebook || '',
      twitterUrl: socialMediaLinks.twitter || '',
      instagramUrl: socialMediaLinks.instagram || '',
      linkedinUrl: socialMediaLinks.linkedin || '',
      metaTitle: seoSettings.metaTitle || businessInfo.name || '',
      metaDescription: seoSettings.metaDescription || businessInfo.description || '',
      metaKeywords: seoSettings.metaKeywords || '',
      content: JSON.stringify(content)
    });

    // Install dependencies
    await installDependenciesWithCache(targetPath);

    // Build the site
    await buildSite(targetPath);

    // Deploy to Netlify
    const deploymentUrl = await deployToNetlify(targetPath, websiteId);

    // Update website with deployment URL
    await updateWebsiteDeployUrl(website.id, deploymentUrl);

    res.status(200).json({
      message: 'Website created successfully',
      websiteId: website.id,
      deploymentUrl
    });
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ error: 'Failed to create website' });
  }
};

// Add other handlers that the routes are expecting
export const getUserWebsitesHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const websites = await prisma.website.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(websites);
  } catch (error) {
    console.error('Error fetching user websites:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
};

export const getWebsiteDetailsHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const websiteId = req.params.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const website = await prisma.website.findFirst({
      where: { id: websiteId, ownerId: userId }
    });
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.status(200).json(website);
  } catch (error) {
    console.error('Error fetching website details:', error);
    res.status(500).json({ error: 'Failed to fetch website details' });
  }
};

export const deleteWebsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const websiteId = req.params.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if website exists and belongs to user
    const website = await prisma.website.findFirst({
      where: { id: websiteId, ownerId: userId }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Delete from Netlify if deployUrl exists
    if (website.deployUrl) {
      try {
        // Extract site name from the URL
        const siteUrl = new URL(website.deployUrl);
        const siteName = siteUrl.hostname.split('.')[0];
        
        console.log('Fetching Netlify site details for site name:', siteName);
        
        // First, get all sites
        const sitesResponse = await axios.get('https://api.netlify.com/api/v1/sites', {
          headers: {
            'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
          }
        });

        // Find the site with matching name
        const site = sitesResponse.data.find((s: any) => s.name === siteName);

        if (site) {
          console.log('Found Netlify site:', site.name, 'with ID:', site.id);
          await axios.delete(`https://api.netlify.com/api/v1/sites/${site.id}`, {
            headers: {
              'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
            }
          });
          console.log('Successfully deleted Netlify site');
        } else {
          console.log('No matching Netlify site found for name:', siteName);
        }
      } catch (error: any) {
        console.error('Error deleting Netlify site:', error.response?.data || error.message);
        // Continue with website deletion even if Netlify deletion fails
      }
    }

    // Delete from database
    await prisma.website.delete({
      where: { id: websiteId }
    });

    // Delete generated files if they exist
    const workspaceRoot = path.resolve(__dirname, '../../../..');
    const generatedPath = path.join(workspaceRoot, 'websites', websiteId);
    if (fs.existsSync(generatedPath)) {
      await fs.remove(generatedPath);
      console.log('Deleted generated files at:', generatedPath);
    }

    res.status(200).json({ message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
};
