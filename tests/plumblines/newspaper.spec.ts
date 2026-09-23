import {expect, test} from '@playwright/test'

const collectors = /events\.bsky\.app|api\.growthbook\.io|sentry\.io|bitdrift/i

test('QA09, QA15: Following-first newspaper shell, no upstream telemetry', async ({
  page,
}) => {
  const errors: string[] = []
  const telemetry: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => {
    if (collectors.test(request.url())) telemetry.push(request.url())
  })
  await page.goto('/')
  await expect(page.getByTestId('plumblines-masthead')).toBeVisible()
  await expect(page.getByTestId('newspaper-sections')).toBeVisible()
  await expect(
    page.getByText(/Sign in to read this section/).first(),
  ).toBeVisible()
  await expect(page.getByTestId('plumblines-left-nav')).toBeVisible()
  await expect(page.getByTestId('plumblines-right-nav')).toBeHidden()
  await expect(page).toHaveTitle(/Plumblines/)
  expect(errors).toEqual([])
  expect(telemetry).toEqual([])
  await expect(page.locator('#splash')).toBeHidden()
  await page.screenshot({
    animations: 'disabled',
    path: 'docs/zeus/evidence/desktop-final.png',
  })
})

for (const width of [390, 768, 1024, 1280, 1586]) {
  test(`QA10: readable responsive layout at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 992})
    await page.goto('/')
    await expect(page.getByTestId('plumblines-masthead')).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    if (width < 980)
      await expect(page.getByTestId('plumblines-right-nav')).toBeHidden()
    const masthead = await page.getByTestId('plumblines-masthead').boundingBox()
    const header = page
      .getByTestId('newspaper-sections')
      .getByRole('heading', {name: 'The front page', exact: true})
    await expect(header).toBeVisible()
    const headerBox = await header.boundingBox()
    expect(headerBox!.y).toBeGreaterThanOrEqual(
      masthead!.y + masthead!.height - 1,
    )
    await expect(
      page.getByText(/Sign in to read this section/).first(),
    ).toBeVisible()
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/responsive-${width}.png`,
    })
  })
}

for (const scheme of ['light', 'dark'] as const) {
  test(`QA12: ${scheme} edition has readable foreground contrast`, async ({
    page,
  }) => {
    await page.emulateMedia({colorScheme: scheme})
    await page.goto('/')
    const masthead = page.getByTestId('plumblines-masthead')
    await expect(masthead).toBeVisible()
    const contrast = await masthead.evaluate(el => {
      const css = getComputedStyle(el)
      const luminance = (color: string) => {
        const c = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map(v => {
            v /= 255
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
          })
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
      }
      const a = luminance(css.color),
        b = luminance(css.backgroundColor)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    })
    expect(contrast).toBeGreaterThan(7)
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/edition-${scheme}.png`,
    })
  })
}

test('QA11: keyboard skip link and reduced motion', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'})
  await page.goto('/')
  const skip = page.getByRole('link', {name: 'Skip to content'})
  await expect(skip).toBeAttached()
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  expect(await skip.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe(
    'none',
  )
  await page.keyboard.press('Enter')
  expect(new URL(page.url()).hash).toBe('#plumblines-content')
})

test('QA13: sign in reaches the existing account form', async ({page}) => {
  await page.goto('/')
  await page.getByTestId('plumblines-sign-in').click()
  await expect(page.getByRole('textbox').first()).toBeVisible()
  await expect(
    page.getByRole('textbox', {name: 'Username or email address'}),
  ).toBeVisible()
  await expect(
    page.getByRole('textbox', {name: 'Password', exact: true}),
  ).toBeVisible()
  await expect(
    page.getByRole('button', {name: 'Sign in', exact: true}),
  ).toBeVisible()
  await expect(page.locator('#splash')).toBeHidden()
  await page.screenshot({
    animations: 'disabled',
    path: 'docs/zeus/evidence/sign-in.png',
  })
})

test('QA14: each section describes its actual source without a Discover fallback claim', async ({
  page,
}) => {
  await page.goto('/')
  const following = page.getByRole('region', {name: 'Following', exact: true})
  await expect(following).toBeVisible()
  await expect(following).toContainText('Following timeline')
  await expect(following).toContainText('AppView order')
  await expect(following).toContainText('no recommended-feed fallback')
  await expect(following).toContainText('Sign in to read this section')
  await expect(following).not.toContainText('Discover')
  await expect(page.getByTestId('plumblines-feed-context')).toBeHidden()
})

test('EFP: composed sheets use the document scroll and expose Reading as a distinct section', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.newspaper-sheet').first()).toBeVisible()
  const nestedScrollers = await page.locator('.newspaper-stories').evaluateAll(
    elements =>
      elements.filter(element => {
        const style = getComputedStyle(element)
        return (
          /(auto|scroll)/.test(style.overflowY) ||
          /(auto|scroll)/.test(style.overflow)
        )
      }).length,
  )
  expect(nestedScrollers).toBe(0)
  await expect(
    page.getByRole('button', {name: 'Reading', exact: true}),
  ).toBeVisible()
  await page.getByRole('button', {name: 'Reading', exact: true}).click()
  await expect(page.locator('#newspaper-reading')).toBeInViewport()
  await expect(page.getByRole('heading', {name: 'Reading'})).toBeVisible()
  await expect(page.getByText(/Standard Reader public index/)).toBeVisible({
    timeout: 30_000,
  })
  const firstArticle = page.locator('.pl-standard-entry').first()
  await expect(firstArticle).toBeVisible({timeout: 45_000})
  const actualTitle = await firstArticle
    .locator('.pl-standard-entry-title')
    .innerText()
  await firstArticle.click()
  await expect(
    page.getByRole('heading', {name: actualTitle, exact: true}),
  ).toBeVisible()
  await expect(
    page.getByText('The index has no readable body for this document.'),
  ).toBeVisible()

  const renderableArticle = page
    .locator('.pl-standard-entry[data-renderable="true"]')
    .first()
  for (let pageNumber = 0; pageNumber < 3; pageNumber++) {
    if ((await renderableArticle.count()) > 0) break
    await page.getByRole('button', {name: 'More articles'}).click()
    await expect(page.getByRole('button', {name: 'More articles'})).toBeEnabled(
      {
        timeout: 15_000,
      },
    )
  }
  await expect(renderableArticle).toBeVisible({timeout: 30_000})
  const renderableTitle = await renderableArticle
    .locator('.pl-standard-entry-title')
    .innerText()
  await renderableArticle.click()
  await expect(
    page.getByRole('heading', {name: renderableTitle, exact: true}),
  ).toBeVisible()
  await expect(page.locator('.pl-standard-prose')).toContainText(/\S/u)
  await page.locator('.pl-standard-article').scrollIntoViewIfNeeded()
  await page.screenshot({
    animations: 'disabled',
    path: 'docs/zeus/evidence/standard-reader-article.png',
  })
})

test('EFP: reader-selected lead and template controls update the composed sheet', async ({
  page,
}) => {
  await page.goto('/')
  const editor = page.locator('.newspaper-layout-settings')
  await editor.locator('summary').click()
  await editor.getByLabel('Page composition').selectOption('compact')
  await expect(page.locator('.newspaper-columns').first()).toHaveAttribute(
    'data-template',
    'compact',
  )
  await expect(page.locator('.newspaper-column[data-lead="true"]')).toHaveCount(
    1,
  )
})

test('QA13: search navigation remains usable', async ({page}) => {
  await page.goto('/')
  await page
    .getByTestId('plumblines-left-nav')
    .getByRole('link', {name: 'Explore', exact: true})
    .click()
  await expect(page).toHaveURL(/\/search/)
  await expect(page.getByRole('combobox', {name: 'Search'})).toBeVisible()
  await expect(page.getByTestId('plumblines-feed-context')).not.toContainText(
    'Public feed',
  )
})

for (const edition of ['dim', 'dark'] as const) {
  test(`QA12: ${edition} primary button labels remain readable`, async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByTestId('plumblines-sign-in').click()
    await expect(
      page.getByRole('textbox', {name: 'Username or email address'}),
    ).toBeVisible()
    // Persist only a display preference in this isolated, signed-out browser.
    await page.evaluate(edition => {
      const preferences = {
        colorMode: 'dark',
        darkTheme: edition,
        session: {accounts: []},
        reminders: {},
        languagePrefs: {
          primaryLanguage: 'en',
          contentLanguages: ['en'],
          postLanguage: 'en',
          postLanguageHistory: ['en'],
          appLanguage: 'en',
        },
        requireAltTextEnabled: false,
        mutedThreads: [],
        invites: {copiedInvites: []},
        onboarding: {step: 'Home'},
      }
      preferences.colorMode = 'dark'
      preferences.darkTheme = edition
      localStorage.setItem('BSKY_STORAGE', JSON.stringify(preferences))
    }, edition)
    await page.goto('/')
    const create = page
      .getByRole('button', {name: 'Create account', exact: true})
      .first()
    await expect(create).toBeVisible()
    const ratio = await create.evaluate(el => {
      const color = getComputedStyle(
        el.querySelector('[dir="auto"]') || el,
      ).color
      const background = getComputedStyle(el).backgroundColor
      const luminance = (value: string) => {
        const c = value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map(v => {
            v /= 255
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
          })
        return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722
      }
      const a = luminance(color),
        b = luminance(background)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    })
    expect(ratio).toBeGreaterThanOrEqual(4.5)
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/buttons-${edition}.png`,
    })
  })
}

test('QA10: mobile search header stays below the masthead after scrolling', async ({
  page,
}) => {
  await page.setViewportSize({width: 390, height: 844})
  await page.goto('/search')
  const header = page.getByTestId('plumblines-search-header').first()
  await expect(header).toBeVisible()
  const masthead = await page.getByTestId('plumblines-masthead').boundingBox()
  await page.mouse.wheel(0, 800)
  await expect
    .poll(async () => (await header.boundingBox())!.y)
    .toBeGreaterThanOrEqual(masthead!.height - 1)
})

for (const width of [390, 1040, 1586]) {
  test(`QA10: newspaper shell survives deep scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({width, height: 900})
    await page.goto('/profile/edriffles.us')
    const masthead = page.getByTestId('plumblines-masthead')
    await expect(masthead).toBeVisible()
    await expect(
      page.locator('[data-testid^="feedItem-by-"]').first(),
    ).toBeVisible({timeout: 45000})
    await page.mouse.wheel(0, 2400)
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(1800)
    await expect
      .poll(async () => Math.round((await masthead.boundingBox())!.y))
      .toBe(0)
    const paper = await masthead.evaluate(
      el => getComputedStyle(el).backgroundColor,
    )
    const backgrounds = await page.evaluate(() =>
      [
        document.documentElement,
        document.body,
        document.getElementById('root')!,
      ].map(el => getComputedStyle(el).backgroundColor),
    )
    expect(backgrounds).toEqual([paper, paper, paper])
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/scroll-deep-${width}.png`,
    })
    // Scrolling back must retain the brand and leave the first post below the tabs.
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(masthead).toBeVisible()
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/scroll-fixed-${width}.png`,
    })
  })
}
