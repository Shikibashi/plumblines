import {expect, type Page, test} from '@playwright/test'

const did = 'did:plc:3ijrhre2q5e4tt2f4ph2sneo'
const cid = 'bafyreie5cvwql4s3if4ygpm75jud36sdh74ulg3r22mjko3depnkcku3eq'
const feedUri = `at://${did}/app.bsky.feed.generator/plumblines-fixture`
const date = '2026-09-23T12:00:00.000Z'
const author = {
  did,
  handle: 'reading-fixture.test',
  displayName: 'Reading Fixture',
  labels: [],
}
const literal = '<script>window.__plumblinesInjection = true</script>'

function post(text: string, key: string) {
  return {
    uri: `at://${did}/app.bsky.feed.post/${key}`,
    cid,
    author,
    record: {$type: 'app.bsky.feed.post', text, createdAt: date, langs: ['en']},
    indexedAt: date,
    likeCount: 17,
    repostCount: 3,
    replyCount: 1,
    quoteCount: 1,
    labels: [],
    viewer: {},
  }
}
const lead = post(
  `Orchard dispatch. Literal record content: ${literal}`,
  '3mtf4xncr6c24',
)
const second = post(
  'Weather dispatch. Ordinary independent story.',
  '3mtf4xncr6c25',
)
const reposted = post('Reposted dispatch fixture.', '3mtf4xncr6c26')
const quoted = {
  ...post('Quoted dispatch fixture.', '3mtf4xncr6c27'),
  embed: {
    $type: 'app.bsky.embed.record#view',
    record: {
      $type: 'app.bsky.embed.record#viewNotFound',
      uri: second.uri,
      notFound: true,
    },
  },
}
const reply = {
  ...post('Reply dispatch fixture.', '3mtf4xncr6c28'),
  record: {
    ...post('', '').record,
    text: 'Reply dispatch fixture.',
    reply: {
      root: {uri: lead.uri, cid},
      parent: {uri: lead.uri, cid},
    },
  },
}

async function installFixtures(page: Page, muted = false) {
  const anchorPost = {...lead, author: {...author, viewer: {muted}}}
  const mutations: string[] = []
  page.on('request', request => {
    if (
      /\/xrpc\/(?:com\.atproto\.repo\.(?:createRecord|putRecord|deleteRecord|applyWrites)|app\.bsky\.graph\.(?:muteActor|unmuteActor)|chat\.bsky\.)/.test(
        request.url(),
      )
    ) {
      mutations.push(request.url())
    }
  })
  await page.route('**/xrpc/app.bsky.feed.getFeed?*', route =>
    route.fulfill({
      json: {
        feed: [
          {post: anchorPost},
          {post: second},
          {
            post: reposted,
            reason: {
              $type: 'app.bsky.feed.defs#reasonRepost',
              by: author,
              indexedAt: date,
            },
          },
          {post: quoted},
        ],
      },
    }),
  )
  await page.route('**/xrpc/app.bsky.feed.getFeedGenerator?*', route =>
    route.fulfill({
      json: {
        view: {
          uri: feedUri,
          cid,
          did: 'did:web:fixture.example',
          creator: author,
          displayName: 'Fixture wire',
          description: 'Deterministic public feed fixture.',
          indexedAt: date,
        },
        isOnline: true,
        isValid: true,
      },
    }),
  )
  await page.route('**/xrpc/app.bsky.actor.getProfile?*', route =>
    route.fulfill({
      json: {
        ...author,
        description: 'Reading feature fixture',
        postsCount: 5,
        followersCount: 0,
        followsCount: 0,
      },
    }),
  )
  await page.route('**/xrpc/app.bsky.feed.getPosts?*', route =>
    route.fulfill({json: {posts: [anchorPost]}}),
  )
  await page.route('**/xrpc/app.bsky.unspecced.getPostThreadV2?*', route =>
    route.fulfill({
      json: {
        hasOtherReplies: false,
        thread: [anchorPost, reply].map((item, depth) => ({
          $type: 'app.bsky.unspecced.getPostThreadV2#threadItem',
          uri: item.uri,
          depth,
          value: {
            $type: 'app.bsky.unspecced.defs#threadItemPost',
            post: item,
            opThread: true,
            moreParents: false,
            moreReplies: 0,
            hiddenByThreadgate: false,
            mutedByViewer: false,
          },
        })),
      },
    }),
  )
  await page.route(`https://plc.directory/${did}`, route =>
    route.fulfill({
      json: {
        id: did,
        service: [
          {
            id: '#atproto_pds',
            type: 'AtprotoPersonalDataServer',
            serviceEndpoint: 'https://pds.fixture.example',
          },
        ],
      },
    }),
  )
  return mutations
}

async function addFeed(page: Page) {
  await page.getByRole('button', {name: 'Manage sections', exact: true}).click()
  await page.getByLabel('New section name', {exact: true}).fill('Fixture wire')
  await page
    .getByRole('combobox', {name: 'Source', exact: true})
    .selectOption('feedgen')
  await page
    .getByLabel('Feed or list link / AT URI', {exact: true})
    .fill(feedUri)
  await page.getByRole('button', {name: 'Add section', exact: true}).click()
  const section = page.getByRole('region', {name: 'Fixture wire', exact: true})
  await expect(
    section.getByText('Weather dispatch. Ordinary independent story.', {
      exact: true,
    }),
  ).toBeVisible()
  return section
}

for (const width of [390, 1040, 1586]) {
  test(`v1 sections add, filter, reorder, persist and remove at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({width, height: 992})
    const mutations = await installFixtures(page)
    await page.goto('/')
    await expect(page.getByTestId('newspaper-sections')).toBeVisible()
    await expect(
      page.getByText(/Sign in to read this section/).first(),
    ).toBeVisible()
    const section = await addFeed(page)
    await expect(
      section.getByText('Reposted dispatch fixture.', {exact: true}),
    ).toBeVisible()
    await expect(
      section.getByText('Quoted dispatch fixture.', {exact: true}),
    ).toBeVisible()
    await section.getByLabel('Settings for Fixture wire').click()
    await section
      .getByRole('checkbox', {name: 'Reposts', exact: true})
      .uncheck()
    await section.getByRole('checkbox', {name: 'Quotes', exact: true}).uncheck()
    await expect(
      section.getByText('Reposted dispatch fixture.', {exact: true}),
    ).toHaveCount(0)
    await expect(
      section.getByText('Quoted dispatch fixture.', {exact: true}),
    ).toHaveCount(0)
    await page
      .getByRole('button', {name: 'Move Fixture wire earlier', exact: true})
      .click()
    await expect(
      page
        .getByRole('navigation', {name: 'Newspaper sections'})
        .getByRole('button')
        .nth(1),
    ).toHaveText('Fixture wire')
    await page.reload()
    await section.getByLabel('Settings for Fixture wire').click()
    await expect(
      section.getByRole('checkbox', {name: 'Reposts', exact: true}),
    ).not.toBeChecked()
    await expect(
      section.getByRole('checkbox', {name: 'Quotes', exact: true}),
    ).not.toBeChecked()
    await expect(
      page
        .getByRole('navigation', {name: 'Newspaper sections'})
        .getByRole('button')
        .nth(1),
    ).toHaveText('Fixture wire')
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(section.locator('[data-treatment="lead"]')).toHaveCount(1)
    await expect(page.locator('#splash')).toBeHidden()
    await page.screenshot({
      animations: 'disabled',
      path: `docs/zeus/evidence/v1-sections-${width}.png`,
    })
    await page
      .getByRole('button', {name: 'Manage sections', exact: true})
      .click()
    await page
      .getByRole('button', {name: 'Remove Fixture wire', exact: true})
      .click()
    await expect(section).toHaveCount(0)
    await page.reload()
    await expect(section).toHaveCount(0)
    expect(mutations).toEqual([])
  })
}

test('v1 saved search persists as a section without pretending guest access exists', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto('/')
  await page.getByRole('button', {name: 'Manage sections', exact: true}).click()
  await page.getByLabel('New section name', {exact: true}).fill('Town desk')
  await page
    .getByRole('combobox', {name: 'Source', exact: true})
    .selectOption('search')
  await page
    .getByLabel('Search query', {exact: true})
    .fill('from:reading-fixture.test orchard')
  await page.getByRole('button', {name: 'Add section', exact: true}).click()
  await page.reload()
  const section = page.getByRole('region', {name: 'Town desk', exact: true})
  await expect(section).toContainText('from:reading-fixture.test orchard')
  await expect(section).toContainText('Sign in to read this section')
  await section.getByLabel('Settings for Town desk').click()
  await expect(
    section.getByRole('checkbox', {name: 'Reposts', exact: true}),
  ).toBeDisabled()
})

test('v1 reader and article retain post content, actions and reply order', async ({
  page,
}) => {
  const mutations = await installFixtures(page)
  await page.goto(`/profile/${did}/post/3mtf4xncr6c24`)
  const anchor = page
    .getByTestId('postThreadItem-by-reading-fixture.test')
    .first()
  await expect(anchor).toContainText('Orchard dispatch.')
  await page.getByTestId('plumblines-reader-toggle').click()
  await expect(page.locator('html')).toHaveClass(/plumblines-reader/)
  await expect(anchor.getByTestId('likeCount')).toBeHidden()
  await expect(anchor.getByTestId('likeBtn')).toBeVisible()
  await expect(anchor.getByTestId('replyBtn')).toBeVisible()
  await expect(anchor.getByTestId('userAvatarFallback').first()).toBeHidden()
  await page.getByTestId('plumblines-article-toggle').click()
  await expect(page.locator('[data-plumblines-article="true"]')).toBeVisible()
  await expect(
    page.getByText('Reply dispatch fixture.', {exact: true}),
  ).toBeVisible()
  const text = page.getByTestId('postText')
  expect((await text.allTextContents())[0]).toContain('Orchard dispatch.')
  expect((await text.allTextContents())[1]).toContain('Reply dispatch fixture.')
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/plumblines-reader/)
  await expect(page.locator('[data-plumblines-article="true"]')).toBeVisible()
  await expect(anchor).toContainText('Orchard dispatch.')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator('#splash')).toBeHidden()
  await page.screenshot({
    animations: 'disabled',
    path: 'docs/zeus/evidence/v1-article.png',
  })
  await page.getByTestId('plumblines-reader-toggle').click()
  await expect(anchor.getByTestId('likeCount')).toBeVisible()
  expect(mutations).toEqual([])
})

test('v1 information shows supplied literal JSON and image sharing downloads a previewed PNG', async ({
  page,
}) => {
  const mutations = await installFixtures(page)
  await page.goto(`/profile/${did}/post/3mtf4xncr6c24`)
  await page.getByTestId('postDropdownBtn').first().click()
  await page.getByTestId('postInformationBtn').click()
  const info = page.getByRole('dialog', {name: 'Post information', exact: true})
  await expect(info).toContainText(lead.uri)
  await expect(info).toContainText('https://pds.fixture.example')
  await expect(info).toContainText(
    'internal ranking and complete filtering history are not available',
  )
  await page.getByRole('button', {name: 'Inspect record', exact: true}).click()
  await expect(info).toContainText('"$type": "app.bsky.feed.post"')
  await expect(info).toContainText(literal)
  expect(await page.evaluate(() => '__plumblinesInjection' in window)).toBe(
    false,
  )
  await page
    .getByRole('button', {name: 'Close active dialog', exact: true})
    .last()
    .click()
  await page.getByTestId('postDropdownBtn').first().click()
  await page.getByTestId('sharePostImageBtn').click()
  await expect(page.getByText(/Text-only card/)).toBeVisible()
  const preview = page.getByRole('img', {
    name: 'Post text card preview, page 1',
  })
  await expect(preview).toBeVisible()
  expect(
    await preview.evaluate(
      (image: HTMLImageElement) =>
        image.complete && image.naturalWidth === 1000,
    ),
  ).toBe(true)
  const downloading = page.waitForEvent('download')
  await page
    .getByRole('button', {name: 'Download image 1', exact: true})
    .click()
  const download = await downloading
  expect(download.suggestedFilename()).toBe('plumblines-post-1.png')
  await download.saveAs('docs/zeus/evidence/v1-shared-post.png')
  await expect(page.locator('#splash')).toBeHidden()
  await page.screenshot({
    animations: 'disabled',
    path: 'docs/zeus/evidence/v1-image-preview.png',
  })
  expect(mutations).toEqual([])
})

test('v1 front page keeps local attention controls in Settings', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto('/')
  await expect(
    page.getByRole('button', {name: 'Local attention', exact: true}),
  ).toHaveCount(0)
})

test('v1 section fronts fetch the next cursor page as the reader scrolls', async ({
  page,
}) => {
  await installFixtures(page)
  const nextPage = post('Next-page dispatch fixture.', '3mtf4xncr6c29')
  await page.route('**/xrpc/app.bsky.feed.getFeed?*', async route => {
    const cursor = new URL(route.request().url()).searchParams.get('cursor')
    await route.fulfill({
      json: cursor
        ? {feed: [{post: nextPage}]}
        : {
            feed: [
              {post: lead},
              {post: second},
              {post: reposted},
              {post: quoted},
            ],
            cursor: 'fixture-page-2',
          },
    })
  })
  await page.goto('/')
  const section = await addFeed(page)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(
    section.getByText('Next-page dispatch fixture.', {exact: true}),
  ).toBeVisible({timeout: 20_000})
})

test('v1 composed front page continues the lead source after its opening package', async ({
  page,
}) => {
  await installFixtures(page)
  const nextPage = post('Front-page continuation fixture.', '3mtf4xncr6c30')
  await page.route('**/xrpc/app.bsky.feed.getFeed?*', async route => {
    const cursor = new URL(route.request().url()).searchParams.get('cursor')
    await route.fulfill({
      json: cursor
        ? {feed: [{post: nextPage}]}
        : {
            feed: [
              {post: lead},
              {post: second},
              {post: reposted},
              {post: quoted},
            ],
            cursor: 'fixture-page-2',
          },
    })
  })
  await page.goto('/')
  await addFeed(page)
  await page.getByRole('button', {name: 'Front page', exact: true}).click()
  await page.locator('.newspaper-layout-settings summary').click()
  await page
    .locator('.newspaper-layout-controls select')
    .first()
    .selectOption({label: 'Fixture wire'})
  await page.reload()
  const continuation = page.getByRole('region', {
    name: 'More from Fixture wire',
    exact: true,
  })
  await expect(
    continuation.getByText('Front-page continuation fixture.', {exact: true}),
  ).toHaveCount(0)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(
    continuation.getByText('Front-page continuation fixture.', {exact: true}),
  ).toBeVisible({timeout: 20_000})
})

test('v1 image preview keeps muted content behind its reveal control', async ({
  page,
}) => {
  await installFixtures(page, true)
  await page.goto(`/profile/${did}/post/3mtf4xncr6c24`)
  await page.getByTestId('postDropdownBtn').first().click()
  await page.getByTestId('sharePostImageBtn').click()
  const dialog = page.getByRole('dialog', {
    name: 'Share post as image',
    exact: true,
  })
  await expect(dialog).toContainText(/muted/i)
  await expect(
    dialog.getByRole('img', {name: /Post text card preview/}),
  ).toHaveCount(0)
  await expect(
    dialog.getByRole('button', {name: /Download image/}),
  ).toHaveCount(0)
  await dialog.getByRole('button', {name: 'Account Muted', exact: true}).click()
  await expect(
    dialog.getByRole('img', {name: 'Post text card preview, page 1'}),
  ).toBeVisible()
})

test('v1 keyboard moves between stories and sections while respecting inputs and dialogs', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto('/')
  const section = await addFeed(page)
  const tabs = page.getByRole('navigation', {name: 'Newspaper sections'})
  await page.keyboard.press('1')
  await expect(
    tabs.getByRole('button', {name: 'Following', exact: true}),
  ).toHaveAttribute('aria-current', 'page')
  await page.keyboard.press('2')
  await expect(
    tabs.getByRole('button', {name: 'Fixture wire', exact: true}),
  ).toHaveAttribute('aria-current', 'page')
  const stories = section.locator('[data-section-story]')
  await page.keyboard.press('j')
  await expect(stories.nth(0)).toBeFocused()
  await page.keyboard.press('j')
  await expect(stories.nth(1)).toBeFocused()
  await page.keyboard.press('k')
  await expect(stories.nth(0)).toBeFocused()
  const input = page.getByLabel('New section name', {exact: true})
  await input.fill('')
  await input.press('j')
  await expect(input).toHaveValue('j')
  await expect(input).toBeFocused()
  await tabs.getByRole('button', {name: 'Fixture wire', exact: true}).focus()
  await page.keyboard.press('j')
  await expect(stories.nth(0)).toBeFocused()
  await page.keyboard.press('o')
  await expect(page).toHaveURL(
    new RegExp(`/profile/${did}/post/3mtf4xncr6c24$`),
  )
  await expect(
    page.getByText('Reply dispatch fixture.', {exact: true}),
  ).toBeVisible()
})
