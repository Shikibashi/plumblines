import {expect, test} from '@playwright/test'

const thread = '/profile/did:plc:3ijrhre2q5e4tt2f4ph2sneo/post/3mtf4xncr6c24'
const blockedUri =
  'at://did:plc:dwilen7uctmqg2dstjjhl5zs/app.bsky.feed.post/3mte7gbhdsk2u'
const publicText = 'Odd thing about Ayn Rand'

test('blocked quote opens its real public record without credentials or write controls', async ({
  page,
}) => {
  const reads: {url: string; authorization: string | undefined}[] = []
  const writes: string[] = []
  page.on('request', request => {
    if (
      request.url().includes('app.bsky.feed.getPosts') &&
      decodeURIComponent(request.url()).includes(blockedUri)
    ) {
      reads.push({
        url: request.url(),
        authorization: request.headers().authorization,
      })
    }
    if (
      /com.atproto.repo.(createRecord|putRecord|deleteRecord)|chat.bsky/.test(
        request.url(),
      )
    )
      writes.push(request.url())
  })
  await page.goto(thread)
  await page
    .getByRole('button', {name: 'View public post', exact: true})
    .first()
    .click()
  const card = page.getByTestId('plumblines-public-post').first()
  await expect(card).toContainText(publicText, {timeout: 30000})
  await expect(card).toContainText('Read only')
  await expect(
    card.getByRole('button', {name: /^(Reply|Like|Repost|Follow|Message)/}),
  ).toHaveCount(0)
  expect(reads).toHaveLength(1)
  expect(new URL(reads[0].url).origin).toBe('https://public.api.bsky.app')
  expect(reads[0].authorization).toBeUndefined()
  expect(writes).toEqual([])
  await expect(page).toHaveURL(new RegExp('3mtf4xncr6c24$'))
  await page.screenshot({path: 'docs/zeus/evidence/public-blocked-post.png'})
})

test('unavailable public record shows an honest result and retry', async ({
  page,
}) => {
  await page.route('**/xrpc/app.bsky.feed.getPosts?*', async route => {
    if (decodeURIComponent(route.request().url()).includes(blockedUri))
      await route.fulfill({json: {posts: []}})
    else await route.continue()
  })
  await page.goto(thread)
  await page
    .getByRole('button', {name: 'View public post', exact: true})
    .first()
    .click()
  await expect(
    page.getByText(
      'The public service did not return this post. It may be unavailable or restricted.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('button', {name: 'View public post', exact: true}).first(),
  ).toBeEnabled()
})

test('public recovery preserves the author logged-out visibility label', async ({
  page,
}) => {
  await page.route('**/xrpc/app.bsky.feed.getPosts?*', async route => {
    if (!decodeURIComponent(route.request().url()).includes(blockedUri))
      return route.continue()
    const response = await route.fetch()
    const body = (await response.json()) as {
      posts: {
        author: {
          did: string
          labels: {src: string; uri: string; val: string; cts: string}[]
        }
      }[]
    }
    body.posts[0].author.labels = [
      {
        src: body.posts[0].author.did,
        uri: body.posts[0].author.did,
        val: '!no-unauthenticated',
        cts: '2026-09-23T00:00:00.000Z',
      },
    ]
    await route.fulfill({response, json: body})
  })
  await page.goto(thread)
  await page
    .getByRole('button', {name: 'View public post', exact: true})
    .first()
    .click()
  const card = page.getByTestId('plumblines-public-post').first()
  await expect(card).toBeVisible()
  await expect(card).not.toContainText(publicText)
  await expect(
    card.getByText(/logged.out|sign.in|signed.in/i).first(),
  ).toBeVisible()
})

test('missing quotes are not described as nonexistent and public view stays read-only', async ({
  page,
}) => {
  await page.goto(thread + '/quotes')
  await expect(
    page.getByText('No quotes available', {exact: true}),
  ).toBeVisible()
  await expect(page.getByText('No quotes yet', {exact: true})).toHaveCount(0)
  await page
    .getByRole('button', {name: 'View public quotes', exact: true})
    .click()
  await expect(page.getByText(/No public quotes were returned/)).toBeVisible()
  await page
    .getByRole('button', {name: 'Back to account view', exact: true})
    .click()
  await expect(
    page.getByText('No quotes available', {exact: true}),
  ).toBeVisible()
})
