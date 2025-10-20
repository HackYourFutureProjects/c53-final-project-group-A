import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const backendProxyTarget = env.VITE_BACKEND_URL ?? 'http://localhost:3000';
  return {
    plugins: [react()],
    server: {
      // Specify server port. Note if the port is already being used, 
      // Vite will automatically try the next available port so this may not be the actual port 
      // the server ends up listening on.
      port: 5173,

      // Automatically open the app in the browser on server start.
      open: '/',

      // Proxy /api requests to the API server. This will avoid any CORS issues.
      proxy: {
        '/api': backendProxyTarget,
      },
    },
  };
});

