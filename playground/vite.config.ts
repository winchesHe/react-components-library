import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import './app.init'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: '../../../src/components/',
    },
  },
})
