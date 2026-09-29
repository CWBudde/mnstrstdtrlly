import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './output/playwright/test-results',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173/mnstrstdtrlly/',
    ...devices['Pixel 7'],
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/mnstrstdtrlly/',
    reuseExistingServer: !process.env.CI,
  },
});
