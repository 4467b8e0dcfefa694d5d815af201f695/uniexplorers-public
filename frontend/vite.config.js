import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions : [".vue", ".js", ".json", ".png", ".jpg", ".jpeg"],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
