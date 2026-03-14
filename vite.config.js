import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Note: proxying /api locally requires a local backend server running on port 3000
    // If you are using Vercel CLI (`vercel dev`), it handles the /api routes automatically
    // and you don't strictly need this proxy unless you are running `vite` and a separate custom backend.
    // For Vercel Serverless functions testing locally, use `vercel dev`.
  },
})
