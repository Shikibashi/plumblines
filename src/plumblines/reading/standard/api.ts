const API_ROOT = 'https://standard-reader.app/xrpc/app.standard-reader'
const DOCUMENT_COLLECTION = 'site.standard.document'

export type StandardLabel = {
  name: string
  source?: string
}

export type StandardFeedItem = {
  uri: string
  did: string
  title: string
  description?: string
  canonicalUrl?: string
  coverImageUrl?: string
  publishedAt?: string
  publicationName?: string
  publicationOwnerHandle?: string
  hasRenderableBody: boolean
  labels: StandardLabel[]
  readingTimeMinutes?: number
}

export type StandardFeedPage = {
  items: StandardFeedItem[]
  cursor?: string
}

export type StandardDocument = StandardFeedItem & {
  content: Record<string, unknown>
  contentFormat?: string
  textContent?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDid(value: unknown): value is string {
  return (
    typeof value === 'string' && /^did:[a-z0-9]+:[a-zA-Z0-9._:%-]+$/.test(value)
  )
}

function isDocumentUri(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const match =
    /^at:\/\/(did:[a-z0-9]+:[a-zA-Z0-9._:%-]+)\/([^/]+)\/([^/]+)$/.exec(value)
  return Boolean(match && match[2] === DOCUMENT_COLLECTION)
}

/**
 * Accepts only public HTTP(S) URLs with a routable domain. Reader links and
 * document images are untrusted API content, so local hosts and IP literals
 * are intentionally excluded.
 */
export function safeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    if (
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      url.username ||
      url.password ||
      !url.hostname.includes('.') ||
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.local') ||
      /^[\d.:]+$/.test(url.hostname) ||
      url.hostname.startsWith('[')
    ) {
      return undefined
    }
    return url.href
  } catch {
    return undefined
  }
}

function labelsFrom(value: unknown): StandardLabel[] {
  if (!Array.isArray(value)) return []
  return value.flatMap(label => {
    if (typeof label === 'string' && label.trim()) return [{name: label.trim()}]
    if (!isRecord(label)) return []
    const name =
      typeof label.name === 'string'
        ? label.name
        : typeof label.value === 'string'
          ? label.value
          : undefined
    if (!name?.trim()) return []
    return [
      {
        name: name.trim(),
        source:
          typeof label.source === 'string' && label.source.trim()
            ? label.source.trim()
            : undefined,
      },
    ]
  })
}

function feedItemFrom(value: unknown): StandardFeedItem | undefined {
  if (
    !isRecord(value) ||
    !isDocumentUri(value.uri) ||
    !isDid(value.did) ||
    !value.uri.startsWith(`at://${value.did}/`) ||
    typeof value.title !== 'string' ||
    !value.title.trim() ||
    typeof value.hasRenderableBody !== 'boolean'
  ) {
    return undefined
  }

  const readingTimeMinutes = value.readingTimeMinutes
  return {
    uri: value.uri,
    did: value.did,
    title: value.title,
    description:
      typeof value.description === 'string' ? value.description : undefined,
    canonicalUrl: safeExternalUrl(value.canonicalUrl),
    coverImageUrl: safeExternalUrl(value.coverImageUrl),
    publishedAt:
      typeof value.publishedAt === 'string' &&
      Number.isFinite(Date.parse(value.publishedAt))
        ? value.publishedAt
        : undefined,
    publicationName:
      typeof value.publicationName === 'string'
        ? value.publicationName
        : undefined,
    publicationOwnerHandle:
      typeof value.publicationOwnerHandle === 'string'
        ? value.publicationOwnerHandle
        : undefined,
    hasRenderableBody: value.hasRenderableBody,
    labels: labelsFrom(value.labels),
    readingTimeMinutes:
      typeof readingTimeMinutes === 'number' &&
      Number.isInteger(readingTimeMinutes) &&
      readingTimeMinutes > 0 &&
      readingTimeMinutes < 1440
        ? readingTimeMinutes
        : undefined,
  }
}

export function parseLatestFeed(value: unknown): StandardFeedPage {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('The public Reading index returned an invalid response.')
  }
  return {
    items: value.items.flatMap(item => {
      const parsed = feedItemFrom(item)
      return parsed ? [parsed] : []
    }),
    cursor:
      typeof value.cursor === 'string' && value.cursor
        ? value.cursor
        : undefined,
  }
}

export function parseDocument(value: unknown): StandardDocument {
  if (!isRecord(value)) throw new Error('The article response is invalid.')
  const item = feedItemFrom({...value, hasRenderableBody: true})
  if (!item || !isRecord(value.content)) {
    throw new Error('This article does not contain a readable document.')
  }
  return {
    ...item,
    content: value.content,
    contentFormat:
      typeof value.contentFormat === 'string' ? value.contentFormat : undefined,
    textContent:
      typeof value.textContent === 'string' ? value.textContent : undefined,
  }
}

export function latestFeedUrl(cursor?: string): string {
  const params = new URLSearchParams({filter: 'all', limit: '20'})
  if (cursor) params.set('cursor', cursor)
  return `${API_ROOT}.getLatestFeed?${params.toString()}`
}

export function documentUrl(uri: string): string {
  if (!isDocumentUri(uri))
    throw new Error('Invalid Standard.site document URI.')
  const params = new URLSearchParams({document: uri})
  return `${API_ROOT}.getDocument?${params.toString()}`
}

async function getJson(
  url: string,
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
) {
  const response = await fetcher(url, {
    signal,
    credentials: 'omit',
    headers: {Accept: 'application/json'},
  })
  if (!response.ok)
    throw new Error(`Reading service returned ${response.status}.`)
  return response.json() as Promise<unknown>
}

export async function fetchLatestFeed(
  cursor?: string,
  signal?: AbortSignal,
  fetcher?: typeof fetch,
): Promise<StandardFeedPage> {
  return parseLatestFeed(await getJson(latestFeedUrl(cursor), signal, fetcher))
}

export async function fetchDocument(
  uri: string,
  signal?: AbortSignal,
  fetcher?: typeof fetch,
): Promise<StandardDocument> {
  return parseDocument(await getJson(documentUrl(uri), signal, fetcher))
}
