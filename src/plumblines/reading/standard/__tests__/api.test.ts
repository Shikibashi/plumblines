import {
  documentUrl,
  fetchDocument,
  fetchLatestFeed,
  latestFeedUrl,
  parseDocument,
  parseLatestFeed,
  safeExternalUrl,
} from '../api'

const uri = 'at://did:plc:abc123/site.standard.document/rkey'
const did = 'did:plc:abc123'

function response(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 503,
    json: () => Promise.resolve(body),
  } as Response
}

function feedItem(overrides: Record<string, unknown> = {}) {
  return {
    uri,
    did,
    title: 'Source title',
    canonicalUrl: 'https://example.org/story',
    publishedAt: '2026-09-23T12:00:00.000Z',
    hasRenderableBody: true,
    ...overrides,
  }
}

test('latest feed uses the public latest endpoint and validates returned records', async () => {
  expect(new URL(latestFeedUrl('next')).searchParams.toString()).toBe(
    'filter=all&limit=20&cursor=next',
  )
  const fetcher = jest.fn().mockResolvedValue(
    response({
      cursor: 'next',
      items: [
        feedItem({labels: [{name: 'Sensitive', source: 'labeler.example'}]}),
        feedItem({uri: 'https://example.org'}),
        {title: '<img src=x>', did, uri, hasRenderableBody: true},
      ],
    }),
  )

  const page = await fetchLatestFeed(undefined, undefined, fetcher)

  expect(fetcher).toHaveBeenCalledWith(
    'https://standard-reader.app/xrpc/app.standard-reader.getLatestFeed?filter=all&limit=20',
    expect.objectContaining({
      credentials: 'omit',
      headers: {Accept: 'application/json'},
    }),
  )
  expect(page).toMatchObject({
    cursor: 'next',
    items: [
      {
        uri,
        title: 'Source title',
        labels: [{name: 'Sensitive', source: 'labeler.example'}],
      },
      {uri, title: '<img src=x>'},
    ],
  })
})

test('document lookup validates and encodes its AT URI and preserves an unknown body format as data', async () => {
  expect(new URL(documentUrl(uri)).searchParams.get('document')).toBe(uri)
  expect(() => documentUrl('https://example.org')).toThrow(
    'Invalid Standard.site document URI.',
  )
  const fetcher = jest.fn().mockResolvedValue(
    response({
      ...feedItem(),
      content: {
        $type: 'site.unknown.article',
        html: '<script>alert(1)</script>',
      },
      contentFormat: 'site.unknown.article',
      textContent: 'Source supplied plain text',
    }),
  )

  const document = await fetchDocument(uri, undefined, fetcher)

  expect(fetcher).toHaveBeenCalledWith(
    expect.stringContaining('.getDocument?document='),
    expect.objectContaining({credentials: 'omit'}),
  )
  expect(document.contentFormat).toBe('site.unknown.article')
  expect(document.content).toEqual({
    $type: 'site.unknown.article',
    html: '<script>alert(1)</script>',
  })
  expect(document.textContent).toBe('Source supplied plain text')
})

test('article API errors and malformed responses fail closed', async () => {
  await expect(
    fetchLatestFeed(
      undefined,
      undefined,
      jest.fn().mockResolvedValue(response({items: null})),
    ),
  ).rejects.toThrow('invalid response')
  await expect(
    fetchDocument(
      uri,
      undefined,
      jest.fn().mockResolvedValue(response({}, false)),
    ),
  ).rejects.toThrow('503')
  expect(() => parseDocument({...feedItem(), content: null})).toThrow(
    'readable document',
  )
  expect(() => parseLatestFeed(null)).toThrow('invalid response')
})

test('external article links reject active, credentialed, local and IP literal URLs', () => {
  expect(safeExternalUrl('https://publication.example/article')).toBe(
    'https://publication.example/article',
  )
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,hello',
    'https://user:pass@publication.example/story',
    'http://localhost/story',
    'http://127.0.0.1/story',
    'https://[::1]/story',
  ]) {
    expect(safeExternalUrl(value)).toBeUndefined()
  }
})
