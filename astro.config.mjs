// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aetas.ai',

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/contact/thanks') &&
        !page.includes('/operations-readiness-brief/thanks') &&
        !page.includes('/global')
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
