// packages/backend/src/models/websiteModel.ts
import { PrismaClient, Website } from '@prisma/client';

const prisma = new PrismaClient();

export const createWebsite = async (data: {
  ownerId: string;
  businessName: string;
  industry: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  content: string;
  template: string;
}): Promise<Website> => {
  return await prisma.website.create({
    data: {
      ownerId: data.ownerId,
      businessName: data.businessName,
      industry: data.industry,
      description: data.description,
      logoUrl: data.logoUrl,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      content: data.content,
      template: data.template,
    },
  });
};

export const updateWebsiteDeployUrl = async (id: string, deployUrl: string): Promise<Website> => {
  return await prisma.website.update({
    where: { id },
    data: { deployUrl },
  });
};
