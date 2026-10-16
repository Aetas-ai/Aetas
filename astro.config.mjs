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

  // Keep prerendered public files at dist/ for the existing Hostinger
  // frontend deployment and keep the future Node bundle outside that public root.
  build: {
    client: '.',
    server: '../dist-server'
  },

  env: {
    schema: {
      FORM_DELIVERY_ENABLED: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false
      }),
      FORM_CSRF_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      FORM_DELIVERY_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      FORM_DELIVERY_BEARER_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      FORM_SENDER_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      CONTACT_RECIPIENT_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      // Obsolete provider settings, declared only so dev/preview reject them
      // the same way npm start does. Never used for delivery.
      BREVO_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
      BREVO_SENDER_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
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
