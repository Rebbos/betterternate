import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
  plugins: [markdown(), react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
})
