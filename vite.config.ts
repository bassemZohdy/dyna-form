import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // The root directory of the project
  build: {
    outDir: 'dist', // Output directory for the production build
    sourcemap: true, // Optional: Useful for debugging production builds
  },
  server: {
    port: 5173, // Development server port
    open: true, // Automatically open the app in the browser
  },
});
