// packages/backend/src/models/websiteModel.ts
import { PrismaClient, Website } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateWebsiteData {
  ownerId: string;
  // Business Information
  businessName: string;
  businessEmail: string;
  businessDescription: string;
  
  // Contact Information
  contactEmail: string;
  phoneNumber: string;
  address: string;

  // Design
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  template: string;

  // Social Media Links
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;

  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Content
  content: string;
}

export const createWebsite = async (data: CreateWebsiteData): Promise<Website> => {
  return await prisma.website.create({
    data: {
      ownerId: data.ownerId,
      
      // Business Information
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessDescription: data.businessDescription,
      
      // Contact Information
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      address: data.address,

      // Design
      logoUrl: data.logoUrl,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      template: data.template,

      // Social Media Links
      facebookUrl: data.facebookUrl || '',
      twitterUrl: data.twitterUrl || '',
      instagramUrl: data.instagramUrl || '',
      linkedinUrl: data.linkedinUrl || '',

      // SEO Settings
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,

      // Content
      content: data.content,
    },
  });
};

export const updateWebsiteDeployUrl = async (id: string, deployUrl: string): Promise<Website> => {
  return await prisma.website.update({
    where: { id },
    data: { deployUrl },
  });
};

export const getUserWebsites = async (userId: string): Promise<Website[]> => {
  return await prisma.website.findMany({
    where: {
      ownerId: userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getWebsiteById = async (id: string, userId: string): Promise<Website | null> => {
  return await prisma.website.findFirst({
    where: {
      id,
      ownerId: userId
    }
  });
};

export const deleteWebsite = async (id: string, userId: string): Promise<Website> => {
  return await prisma.website.delete({
    where: {
      id,
      ownerId: userId
    }
  });
};
