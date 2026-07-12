import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to the backend in dev so the client uses relative URLs.
    proxy: { '/api': 'http://localhost:4000' },
  },
});
