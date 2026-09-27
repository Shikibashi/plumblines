import {expect, type Page, test} from '@playwright/test'

const did = 'did:plc:3ijrhre2q5e4tt2f4ph2sneo'
const cid = 'bafyreie5cvwql4s3if4ygpm75jud36sdh74ulg3r22mjko3depnkcku3eq'
const profile = {
  did,
  handle: 'public-reader.example.test',
  displayName: 'Public Reader Fixture',
  description: 'A deterministic public profile for reader tests.',
  postsCount: 2,
  followersCount: 0,
  followsCount: 0,
  labels: [],
}
const relationships = {
  blockedBy: {blockedBy: true},
  blocking: {blocking: `at://${did}/app.bsky.graph.block/test`},
  blockingByList: {
    blockingByList: {
      uri: `at://${did}/app.bsky.graph.list/test`,
      cid,
      name: 'Fixture list',
      purpose: 'app.bsky.graph.defs#modlist',
    },
  },
}

function post(text: string, rkey: string) {
  return {
    post: {
      uri: `at://${did}/app.bsky.feed.post/${rkey}`,
      cid,
      author: {did, handle: profile.handle, displayName: profile.displayName},
      record: {
        $type: 'app.bsky.feed.post',
        text,
        createdAt: '2026-09-23T12:00:00.000Z',
      },
      indexedAt: '2026-09-23T12:00:00.000Z',
      labels: [],
    },
  }
}

async function installProfileFixtures(
  page: Page,
  relationship: keyof typeof relationships,
  options: {
    unavailable?: boolean
    noUnauthenticated?: boolean
    muted?: boolean
  } = {},
) {
  let publicMode = false
  const publicRequests: {method: string; authorization?: string}[] = []
  await page.route('**/xrpc/app.bsky.actor.getProfile?*', async route => {
    if (publicMode) {
      publicRequests.push({
        method: route.request().method(),
        authorization: route.request().headers().authorization,
      })
      if (options.unavailable) {
        await route.fulfill({
          status: 404,
          json: {error: 'ProfileNotFound', message: 'Fixture unavailable'},
        })
        return
      }
    }
    await route.fulfill({
      json: {
        ...profile,
        viewer: publicMode
          ? {}
          : {...relationships[relationship], muted: !!options.muted},
        labels:
          publicMode && options.noUnauthenticated
            ? [
                {
                  src: did,
                  uri: did,
                  val: '!no-unauthenticated',
                  cts: '2026-09-23T12:00:00.000Z',
                },
              ]
            : [],
      },
    })
  })
  await page.route('**/xrpc/app.bsky.feed.getAuthorFeed?*', async route => {
    if (publicMode) {
      publicRequests.push({
        method: route.request().method(),
        authorization: route.request().headers().authorization,
      })
    }
    const cursor = new URL(route.request().url()).searchParams.get('cursor')
    await route.fulfill({
      json: publicMode
        ? cursor
          ? {feed: [post('Second public page fixture.', '3mtf4xncr6c25')]}
          : {
              feed: [post('Visible public post fixture.', '3mtf4xncr6c24')],
              cursor: 'fixture-page-2',
            }
        : {feed: []},
    })
  })
  await page.goto(`/profile/${did}`)
  await expect(page.getByTestId('viewPublicProfile')).toBeVisible()
  publicMode = true
  await page.getByTestId('viewPublicProfile').click()
  return {publicRequests}
}

for (const relationship of Object.keys(
  relationships,
) as (keyof typeof relationships)[]) {
  test(`Public profile: ${relationship} offers an isolated read-only public view`, async ({
    page,
  }) => {
    const {publicRequests} = await installProfileFixtures(page, relationship)
    const reader = page.getByTestId('publicProfileReader')
    await expect(reader).toBeVisible()
    await expect(
      reader.getByText(profile.description, {exact: true}),
    ).toBeVisible()
    await expect(
      reader.getByText('Visible public post fixture.', {exact: true}),
    ).toBeVisible()
    await expect(
      reader.getByRole('button', {
        name: /^(Like|Reply|Follow|Repost|Block|Unblock)(\s|$)/i,
      }),
    ).toHaveCount(0)
    await reader
      .getByRole('button', {name: 'Load more public posts', exact: true})
      .click()
    await expect(
      reader.getByText('Second public page fixture.', {exact: true}),
    ).toBeVisible()
    expect(publicRequests.length).toBeGreaterThanOrEqual(3)
    expect(
      publicRequests.every(
        request => request.method === 'GET' && !request.authorization,
      ),
    ).toBe(true)
    await reader
      .getByRole('button', {name: 'Back to account view', exact: true})
      .click()
    await expect(reader).toHaveCount(0)
    await expect(page.getByTestId('viewPublicProfile')).toBeVisible()
  })
}

test('Public profile: service refusal is an unavailable state with retry', async ({
  page,
}) => {
  await installProfileFixtures(page, 'blockedBy', {unavailable: true})
  const reader = page.getByTestId('publicProfileReader')
  await expect(
    reader.getByText('This profile is not available in the public view.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    reader.getByRole('button', {name: 'Retry public profile', exact: true}),
  ).toBeVisible()
  await expect(
    reader.getByText(profile.description, {exact: true}),
  ).toHaveCount(0)
  await expect(reader.getByTestId('plumblines-public-post')).toHaveCount(0)
})

test('Public profile: no-unauthenticated label still prevents public display', async ({
  page,
}) => {
  await installProfileFixtures(page, 'blocking', {noUnauthenticated: true})
  const reader = page.getByTestId('publicProfileReader')
  await expect(
    reader.getByText('Sign-in Required', {exact: true}),
  ).toBeVisible()
  await expect(
    reader.getByText(profile.description, {exact: true}),
  ).toHaveCount(0)
  await expect(reader.getByTestId('plumblines-public-post')).toHaveCount(0)
  await expect(
    reader.getByRole('button', {name: 'Show anyway', exact: true}),
  ).toHaveCount(0)
  await expect(
    reader.getByRole('button', {name: 'Back to account view', exact: true}),
  ).toBeVisible()
})

test('Public profile: reading through a block preserves the account mute', async ({
  page,
}) => {
  await installProfileFixtures(page, 'blockedBy', {muted: true})
  const card = page
    .getByTestId('publicProfileReader')
    .getByTestId('plumblines-public-post')
    .first()
  await expect(card).toBeVisible()
  await expect(
    card.getByText('Visible public post fixture.', {exact: true}),
  ).toBeHidden()
  await expect(card.getByText('Show', {exact: true})).toBeVisible()
  await card.getByText('Show', {exact: true}).click()
  await expect(
    card.getByText('Visible public post fixture.', {exact: true}),
  ).toBeVisible()
  await card.getByText('Hide', {exact: true}).click()
  await expect(
    card.getByText('Visible public post fixture.', {exact: true}),
  ).toBeHidden()
})
