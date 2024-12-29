import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image with optimization
export const uploadImage = async (
  file: Express.Multer.File,
  websiteId: string
): Promise<string> => {
  try {
    if (!file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Convert buffer to base64
    const b64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary with optimization settings
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `sitelure/${websiteId}`,
      resource_type: 'auto',
      quality: 'auto:best',
      fetch_format: 'auto',
      format: 'webp',
      transformation: [
        { width: 'auto', crop: 'scale', dpr: 'auto' },
        { quality: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Helper function to delete folder
export const deleteFolder = async (websiteId: string): Promise<void> => {
  try {
    await cloudinary.api.delete_folder(`sitelure/${websiteId}`);
  } catch (error) {
    console.error('Error deleting Cloudinary folder:', error);
    // Don't throw - we want to continue with website deletion even if cleanup fails
  }
}; 