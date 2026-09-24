import {expect, test} from '@playwright/test'

test('web install metadata and branded icons resolve from root paths', async ({
  request,
}) => {
  const root = await request.get('/')
  expect(root.status()).toBe(200)
  const html = await root.text()
  expect(html).toContain('rel="manifest" href="/manifest.webmanifest"')
  expect(html).toContain('href="/pwa/apple-touch-icon.png"')

  const response = await request.get('/manifest.webmanifest')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain(
    'application/manifest+json',
  )
  const manifest = (await response.json()) as {
    icons: {src: string; type: string; sizes: string}[]
  }
  expect(manifest).toMatchObject({
    id: '/',
    name: 'Plumblines',
    short_name: 'Plumblines',
    start_url: '/',
    scope: '/',
    display: 'standalone',
  })
  expect(manifest.icons.length).toBeGreaterThan(0)
  for (const icon of manifest.icons) {
    expect(icon.type).toBe('image/png')
    const image = await request.get(icon.src)
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/png')
    const bytes = await image.body()
    expect(bytes.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    )
    expect(icon.sizes).toBe(
      `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
    )
  }
  const touchIcon = await request.get('/pwa/apple-touch-icon.png')
  expect(touchIcon.status()).toBe(200)
  const touchBytes = await touchIcon.body()
  expect([touchBytes.readUInt32BE(16), touchBytes.readUInt32BE(20)]).toEqual([
    180, 180,
  ])
})
