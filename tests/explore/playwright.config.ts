import path from 'node:path'

import {defineConfig} from '@playwright/test'
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: process.env.PLUMBLINES_TEST_URL || 'http://127.0.0.1:8139',
    viewport: {width: 1586, height: 992},
  },
  reporter: [
    ['list'],
    [
      'json',
      {
        outputFile: path.resolve(
          __dirname,
          '../../docs/zeus/evidence/explorer-results.json',
        ),
      },
    ],
  ],
  outputDir: '../../test-results/explorer',
})
