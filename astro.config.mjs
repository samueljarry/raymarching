import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [glsl()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '/src/styles/global.scss';`
        }
      }
    }
  },
});
