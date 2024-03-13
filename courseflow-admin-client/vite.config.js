import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  server: {
    host: 'courseflow.local',
    port: 4080,
    https: {
      key: './ssl-certs/private.key',
      cert: './ssl-certs/certificate.crt'
    }
  }
});