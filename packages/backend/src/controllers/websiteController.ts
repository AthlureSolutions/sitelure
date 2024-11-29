// packages/backend/src/controllers/websiteController.ts
import { Request, Response } from 'express';
import { createWebsite, updateWebsiteDeployUrl } from '../models/websiteModel';
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

export const createWebsiteHandler = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user;
  const { businessInfo, logoUrl, colors, content, template } = req.body;

  try {
    // Create a new website record in PostgreSQL
    const website = await createWebsite({
      ownerId: userId,
      businessName: businessInfo.name,
      industry: businessInfo.industry,
      description: businessInfo.description,
      logoUrl: logoUrl,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      content: content,
      template: template,
    });

    // Generate Astro site
    const astroTemplatePath = path.join(__dirname, '../../astro-site-template');
    const generatedPath = path.join(__dirname, '../../generated-sites', website.id);

    await fs.copy(astroTemplatePath, generatedPath);
    console.log('Astro template copied.');

    // Inject user data into Astro site
    const dataPath = path.join(generatedPath, 'src', 'data', 'websiteData.json');
    await fs.writeJSON(dataPath, {
      businessName: businessInfo.name,
      description: businessInfo.description,
      aboutDescription: businessInfo.description,
      logoUrl: logoUrl,
      colors: colors,
      template: template,
    }, { spaces: 2 });
    console.log('User data injected into Astro site.');

    // Install dependencies and build Astro site
    await new Promise<void>((resolve, reject) => {
      exec('npm install', { cwd: generatedPath }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error installing Astro dependencies:', stderr);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      exec('npm run build', { cwd: generatedPath }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error building Astro site:', stderr);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });

    // Deploy to Netlify
    const netlifyResponse = await axios.post('https://api.netlify.com/api/v1/sites', {
      name: `site-${website.id}`, // Ensure site name is unique
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const siteId = netlifyResponse.data.id;

    // Zip the dist folder
    const distPath = path.join(generatedPath, 'dist');
    const zipPath = path.join(generatedPath, 'site.zip');
    const zip = new AdmZip();
    zip.addLocalFolder(distPath);
    zip.writeZip(zipPath);
    console.log('Astro site zipped.');

    // Deploy the zip to Netlify
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
    console.log(`Site deployed at ${deployUrl}`);

    // Update website record with deploy URL
    await updateWebsiteDeployUrl(website.id, deployUrl);

    // Cleanup
    await fs.remove(zipPath);
    console.log('Temporary zip file removed.');

    res.status(201).json({ websiteId: website.id, deployUrl: deployUrl });
  } catch (error: any) {
    console.error('Website Creation Error:', error);
    res.status(500).json({ message: 'Failed to create website.' });
  }
};
