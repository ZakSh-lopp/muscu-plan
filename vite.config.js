import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_NUMBER__: JSON.stringify(process.env.GITHUB_RUN_NUMBER || '0'),
  },
  build: {
    outDir: 'dist',
    // Important pour Capacitor : pas de hash dans les noms de fichiers
    rollupOptions: {
      // Capacitor packages are provided at runtime by the native layer — don't bundle them
      external: (id) => id.startsWith('@capacitor/'),
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
