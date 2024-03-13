import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

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
    port: 4040,
    https: {
      key: './ssl-certs/private.key',
      cert: './ssl-certs/certificate.crt'
    }
  }

});