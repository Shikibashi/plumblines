import path from 'node:path'

import {defineConfig} from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  timeout: 60_000,
  expect: {timeout: 15_000},
  workers: 1,
  reporter: [
    ['list'],
    [
      'json',
      {
        outputFile: path.resolve(
          __dirname,
          '../../docs/zeus/evidence/browser-results.json',
        ),
      },
    ],
  ],
  use: {
    baseURL: process.env.PLUMBLINES_TEST_URL || 'http://127.0.0.1:8137',
    viewport: {width: 1586, height: 992},
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: '../../test-results/plumblines',
})
