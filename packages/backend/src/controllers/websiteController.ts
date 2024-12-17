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
  "site": {
    "name": "${businessInfo.name}",
    "description": "${businessInfo.description || ''}",
    "defaultImage": "https://freesvg.org/img/Placeholder.png",
    "logo": { 
      "src": "${businessInfo.logoUrl || 'https://freesvg.org/img/Placeholder.png'}",
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
  const r = Math.max(Math.min(parseInt(hex.substring(0, 2), 16) + amount, 0));
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

    // Create website record first to get ID
    const website = await createWebsite({
      ownerId: userId,
      businessName: businessInfo.name,
      businessEmail: businessInfo.email,
      businessDescription: businessInfo.description || '',
      contactEmail: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber || '',
      address: contactInfo.address || '',
      logoUrl: logoUrl || '',
      primaryColor: colors?.primary || '#3B82F6',
      secondaryColor: colors?.secondary || '#1E40AF',
      template: template || 'default',
      facebookUrl: socialMediaLinks?.facebook || '',
      twitterUrl: socialMediaLinks?.twitter || '',
      instagramUrl: socialMediaLinks?.instagram || '',
      linkedinUrl: socialMediaLinks?.linkedin || '',
      metaTitle: seoSettings?.metaTitle || businessInfo.name,
      metaDescription: seoSettings?.metaDescription || businessInfo.description || '',
      metaKeywords: seoSettings?.metaKeywords || '',
      content: req.body.content || '',
    });

    console.log('Website created in database:', website);

    // Generate website content in parallel with file operations
    const contentPromise = generateWebsiteData(
      businessInfo,
      contactInfo,
      colors,
      socialMediaLinks,
      seoSettings
    );

    // Setup file structure
    const workspaceRoot = getWorkspaceRoot();
    const astroTemplatePath = path.join(workspaceRoot, 'packages', 'astro-template-modern');
    const generatedSitesPath = path.join(workspaceRoot, 'packages', 'backend', 'generated-sites');
    const generatedPath = path.join(generatedSitesPath, website.id);

    // Prepare directories in parallel
    await Promise.all([
      fs.ensureDir(generatedSitesPath),
      fs.ensureDir(generatedPath)
    ]);

    // Copy template
    await fs.copy(astroTemplatePath, generatedPath);
    console.log('Astro template copied to:', generatedPath);

    // Handle logo if exists
    if (logoUrl && logoUrl.startsWith('/uploads/')) {
      const srcPath = path.join(astroTemplatePath, 'public', logoUrl);
      const destPath = path.join(generatedPath, 'public', logoUrl);
      await fs.copy(srcPath, destPath);
    }

    // Wait for content generation
    const websiteData = await contentPromise;
    
    // Write website data
    const dataPath = path.join(generatedPath, 'src', 'data', 'websiteData.json');
    await fs.writeJSON(dataPath, websiteData, { spaces: 2 });

    // Install dependencies using cache
    await installDependenciesWithCache(generatedPath);

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

    // Deploy to Netlify
    try {
      if (!process.env.NETLIFY_API_TOKEN) {
        throw new Error('NETLIFY_API_TOKEN is not configured');
      }

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

      // Create zip in memory instead of writing to disk
      const zip = new AdmZip();
      const distPath = path.join(generatedPath, 'dist');
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

      const deployUrl = deployResponse.data.deploy_url;
      console.log('Site deployed at:', deployUrl);

      // Update website record with deploy URL
      await updateWebsiteDeployUrl(website.id, deployUrl);

      return res.status(201).json({ 
        websiteId: website.id, 
        deployUrl: deployUrl 
      });
    } catch (deployError: any) {
      throw new Error(`Deployment failed: ${deployError.message}`);
    }
  } catch (error: any) {
    console.error('Website Creation Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

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
