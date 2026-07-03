import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Basis-Pfad für GitHub Pages: https://cwbudde.github.io/mnstrstdtrlly/
export default defineConfig({
  base: '/mnstrstdtrlly/',
  plugins: [react()],
});
