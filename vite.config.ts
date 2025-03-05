import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import requireTransform from 'vite-plugin-require-transform';
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    requireTransform({}),],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
