// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import securityHeaders from './scripts/security-headers-integration.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://aetas.ai',

  security: {
    checkOrigin: true,
    allowedDomains: [
      {
        protocol: 'https',
        hostname: 'aetas.ai'
      }
    ]
  },

  adapter: node({
    mode: 'standalone',
    staticHeaders: true,
    bodySizeLimit: 64 * 1024
  }),

  env: {
    schema: {
      FORM_CSRF_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        min: 32
      }),
      FORM_DELIVERY_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        url: true,
        startsWith: 'https://'
      }),
      FORM_DELIVERY_BEARER_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        min: 20
      })
    }
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/contact/thanks') &&
        !page.includes('/operations-readiness-brief/thanks') &&
        !page.includes('/global')
    }),
    securityHeaders()
  ],

  vite: {
    build: {
      sourcemap: false
    },
    plugins: [tailwindcss()]
  }
});
