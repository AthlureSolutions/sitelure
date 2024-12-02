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

export const uploadImageHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Copy the uploaded file to Astro template's public directory
    const publicDir = path.join(__dirname, '../../../astro-template/public/uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const fileName = req.file.filename;
    const sourcePath = req.file.path;
    const targetPath = path.join(publicDir, fileName);

    // Copy file to public directory
    fs.copyFileSync(sourcePath, targetPath);

    // Return the public URL for the image
    const imageUrl = `/uploads/${fileName}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
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
        const astroTemplatePath = path.join(workspaceRoot, 'packages', 'astro-template');
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

        // Inject user data into Astro site
        const dataPath = path.join(generatedPath, 'src', 'data', 'websiteData.json');
        const websiteData = {
          businessName: businessInfo.name,
          description: businessInfo.description || '',
          contactEmail: contactInfo.email,
          phoneNumber: contactInfo.phoneNumber || '',
          address: contactInfo.address || '',
          primaryColor: colors?.primary || '#3B82F6',
          secondaryColor: colors?.secondary || '#1E40AF',
          logoUrl: logoUrl || '',
          facebook: socialMediaLinks?.facebook || '',
          twitter: socialMediaLinks?.twitter || '',
          instagram: socialMediaLinks?.instagram || '',
          linkedin: socialMediaLinks?.linkedin || '',
          metaTitle: seoSettings?.metaTitle || businessInfo.name,
          metaDescription: seoSettings?.metaDescription || businessInfo.description || '',
          metaKeywords: seoSettings?.metaKeywords || ''
        };

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
