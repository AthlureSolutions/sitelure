// packages/astro-site-template/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://yourdomain.com', // Placeholder, will be dynamic
  base: '/', // Adjust if deploying to a subdirectory
});
