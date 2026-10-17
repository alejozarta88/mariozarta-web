import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mariozarta.pages.dev',
  // Sin CSS ni assets en línea: la CSP no admite 'unsafe-inline' ni data: en estilos.
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
});
