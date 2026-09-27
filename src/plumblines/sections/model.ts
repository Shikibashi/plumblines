import {AtUri} from '@atproto/syntax'

export type SectionFilters = {
  replies: boolean
  reposts: boolean
  quotes: boolean
}
export type SectionSource =
  | {kind: 'following'}
  | {kind: 'feedgen' | 'list'; uri: string}
  | {kind: 'search'; query: string}
export type NewspaperSection = {
  id: string
  title: string
  source: SectionSource
  filters: SectionFilters
}
export type SectionsConfig = {
  version: 1
  sections: NewspaperSection[]
  activeId: string
}
export const DEFAULT_FILTERS: SectionFilters = {
  replies: true,
  reposts: true,
  quotes: true,
}
export const DEFAULT_SECTIONS: SectionsConfig = {
  version: 1,
  sections: [
    {
      id: 'following',
      title: 'Following',
      source: {kind: 'following'},
      filters: DEFAULT_FILTERS,
    },
  ],
  activeId: 'following',
}
// minimal: eight live sections per local account — revisit with column virtualization.
export const MAX_SECTIONS = 8

export function parseSectionSource(
  kind: SectionSource['kind'],
  value: string,
): SectionSource {
  if (kind === 'following') return {kind}
  if (kind === 'search') {
    const query = value.trim()
    if (!query || query.length > 1000)
      throw new Error('Enter a search of 1 to 1,000 characters.')
    return {kind, query}
  }
  let uri = value.trim()
  if (uri.startsWith('https://')) {
    const url = new URL(uri)
    const match = url.pathname.match(
      /^\/profile\/([^/]+)\/(feed|lists)\/([^/]+)\/?$/,
    )
    if (!['bsky.app', 'plumblines.uk'].includes(url.hostname) || !match)
      throw new Error(
        'Use a Bluesky or Plumblines feed/list link, or an AT URI.',
      )
    if (
      (kind === 'feedgen' && match[2] !== 'feed') ||
      (kind === 'list' && match[2] !== 'lists')
    )
      throw new Error('The link does not match the selected source type.')
    uri = `at://${decodeURIComponent(match[1])}/${kind === 'feedgen' ? 'app.bsky.feed.generator' : 'app.bsky.graph.list'}/${decodeURIComponent(match[3])}`
  }
  const parsed = new AtUri(uri)
  const collection =
    kind === 'feedgen' ? 'app.bsky.feed.generator' : 'app.bsky.graph.list'
  if (
    !uri.startsWith('at://') ||
    !parsed.host ||
    parsed.collection !== collection ||
    !parsed.rkey ||
    parsed.search ||
    parsed.hash
  )
    throw new Error('Enter a valid AT URI for the selected source type.')
  return {kind, uri: parsed.toString()}
}

export function validateSections(value: unknown): SectionsConfig {
  if (!value || typeof value !== 'object') return DEFAULT_SECTIONS
  const raw = value as Record<string, unknown>
  if (raw.version !== 1 || !Array.isArray(raw.sections)) return DEFAULT_SECTIONS
  const ids = new Set<string>()
  const sections: NewspaperSection[] = []
  for (const item of raw.sections.slice(0, MAX_SECTIONS)) {
    if (!item || typeof item !== 'object') continue
    const candidate = item as Record<string, unknown>
    if (
      typeof candidate.id !== 'string' ||
      !candidate.id ||
      candidate.id.length > 100 ||
      ids.has(candidate.id) ||
      typeof candidate.title !== 'string' ||
      !candidate.title.trim() ||
      !candidate.source ||
      typeof candidate.source !== 'object'
    )
      continue
    const source = candidate.source as Record<string, unknown>
    if (
      typeof source.kind !== 'string' ||
      !['following', 'feedgen', 'list', 'search'].includes(source.kind)
    )
      continue
    try {
      const sourceValue = source.kind === 'search' ? source.query : source.uri
      const parsed = parseSectionSource(
        source.kind as SectionSource['kind'],
        typeof sourceValue === 'string' ? sourceValue : '',
      )
      const filters = candidate.filters as Partial<SectionFilters> | undefined
      sections.push({
        id: candidate.id.slice(0, 100),
        title: candidate.title.trim().slice(0, 80),
        source: parsed,
        filters: {
          replies: filters?.replies !== false,
          reposts: filters?.reposts !== false,
          quotes: filters?.quotes !== false,
        },
      })
      ids.add(candidate.id)
    } catch {}
  }
  if (!sections.length) return DEFAULT_SECTIONS
  return {
    version: 1,
    sections,
    activeId: sections.some(s => s.id === raw.activeId)
      ? String(raw.activeId)
      : sections[0].id,
  }
}

export function moveSection(
  config: SectionsConfig,
  id: string,
  direction: -1 | 1,
): SectionsConfig {
  const sections = [...config.sections]
  const from = sections.findIndex(s => s.id === id)
  const to = from + direction
  if (from < 0 || to < 0 || to >= sections.length) return config
  ;[sections[from], sections[to]] = [sections[to], sections[from]]
  return {...config, sections}
}

export function matchesSectionFilters(
  post: {record: unknown; embed?: unknown},
  filters: SectionFilters,
): boolean {
  const record = post.record as
    {reply?: unknown; embed?: {$type?: string}} | undefined
  const embed = post.embed as {$type?: string} | undefined
  const quote = (embed?.$type ?? record?.embed?.$type)?.startsWith(
    'app.bsky.embed.record',
  )
  return (filters.replies || !record?.reply) && (filters.quotes || !quote)
}
