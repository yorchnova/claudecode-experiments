import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Rutas de assets relativas: la app funciona igual servida en la raíz
  // (dev / localhost) o en un subpath (GitHub Pages /claudecode-experiments/).
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5180,
  },
});
