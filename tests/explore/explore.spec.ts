import fs from 'node:fs'

import {expect, test} from '@playwright/test'

// Guest routes taken from src/routes.ts and the newspaper navigation.
for (const route of ['/', '/search', '/feeds']) {
  test(`guest route ${route}`, async ({page}) => {
    const pageErrors: string[] = []
    const consoleErrors: string[] = []
    const httpFailures: {url: string; status: number}[] = []
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('response', response => {
      if (response.status() >= 400)
        httpFailures.push({url: response.url(), status: response.status()})
    })
    await page.goto(route)
    await expect(page.getByTestId('plumblines-masthead')).toBeVisible()
    if (route === '/')
      await expect(
        page.locator('[data-testid^="feedItem-by-"]').first(),
      ).toBeVisible({timeout: 45000})
    if (route === '/search') {
      const search = page.getByRole('combobox', {name: 'Search'})
      await expect(search).toBeVisible()
      await search.fill('atproto')
      await search.press('Enter')
      await expect(page).toHaveURL(/q=atproto/)
    }
    const output = `docs/zeus/evidence/explore-${route.replaceAll('/', '') || 'home'}`
    await page.screenshot({path: `${output}.png`})
    fs.writeFileSync(
      `${output}.json`,
      JSON.stringify(
        {
          route,
          pageErrors,
          consoleErrors,
          httpFailures,
          font: await page
            .getByTestId('plumblines-masthead')
            .evaluate(el => getComputedStyle(el).fontFamily),
        },
        null,
        2,
      ),
    )
    expect(pageErrors).toEqual([])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  })
}
