import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
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

/**
 * Runs /api/*.ts (Web Request/Response handlers) inside `npm run dev`,
 * so the forms work locally without the Netlify CLI or an account.
 */
function devApi(): Plugin {
  return {
    name: 'bt-dev-api',
    apply: 'serve',
    configureServer(server) {
      // Server-only secrets (TURNSTILE_SECRET_KEY, DATABASE_URL) from .env / .env.local.
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      // Lets server/db.ts log submissions instead of failing when there's no database.
      process.env.BT_LOCAL_API = '1'
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url?.split('?')[0].replace(/^\//, '') ?? ''
        if (!/^[a-z-]+$/.test(name)) return next()
        let mod: Record<string, unknown>
        try {
          mod = await server.ssrLoadModule(`/api/${name}.ts`)
        } catch {
          return next()
        }
        const handler = mod[req.method ?? 'GET']
        if (typeof handler !== 'function') {
          res.statusCode = 405
          return res.end()
        }
        const chunks: Buffer[] = []
        for await (const c of req) chunks.push(c as Buffer)
        const headers = new Headers()
        for (const [k, v] of Object.entries(req.headers))
          if (typeof v === 'string') headers.set(k, v)
        const response: Response = await handler(
          new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          }),
        )
        res.statusCode = response.status
        response.headers.forEach((v, k) => res.setHeader(k, v))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    devApi(),
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
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/api/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
})
