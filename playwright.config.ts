import { defineConfig } from '@playwright/test'

// Viewport projects + axe come in Phase 8.
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: [
    { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
    // Production build: the service worker (offline.spec.ts) only exists in builds.
    {
      command: 'npm run build && npm run preview -- --port 4173 --strictPort',
      url: 'http://localhost:4173',
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
})
