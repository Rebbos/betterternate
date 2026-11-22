import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { parseMarkdownFile } from './scripts/markdown.ts'

/** Turns content/**.md into `{ data, html }` at build time, so no parser ships to the browser. */
function markdown(): Plugin {
  return {
    name: 'bt-markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return
      return { code: `export default ${JSON.stringify(parseMarkdownFile(code))}`, map: null }
    },
  }
}

export default defineConfig({
  plugins: [
    markdown(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // we ship our own public/manifest.webmanifest
      workbox: {
        // App shell + all route chunks + content (hotlines live in the JS) + search index,
        // so every page we've built, including /hotlines, works offline after the first visit.
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}', 'search-index.json'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
})
