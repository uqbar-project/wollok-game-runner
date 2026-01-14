import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  base: './',
  build: {
    outDir: 'build/client',
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore sourcemap errors that break Vercel
        if (
          warning.message?.includes("Can't resolve original location of error")
        )
          return
        warn(warning)
      },
    },
  },
  plugins: [commonjs(), tailwindcss(), reactRouter(), tsconfigPaths()],
})
