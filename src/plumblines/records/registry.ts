/** Static, local renderer dispatch. Records never select executable code. */
const renderers: Readonly<Record<string, 'post'>> = {
  'app.bsky.feed.post': 'post',
}

export function getRecordRenderer(value: unknown): 'post' | 'generic' {
  const type = asRecord(value)?.$type
  return typeof type === 'string' && Object.hasOwn(renderers, type)
    ? renderers[type]
    : 'generic'
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined
}

/** Metadata describes only fields actually supplied by the service. */
export function getRecordInfo(supplied: unknown) {
  const wrapper = asRecord(supplied)
  const record =
    wrapper?.$type === 'app.bsky.embed.record#viewRecord'
      ? asRecord(wrapper.value)
      : wrapper
  const author = asRecord(wrapper?.author)
  const string = (value: unknown) =>
    typeof value === 'string' ? value : undefined
  return {
    type: string(record?.$type),
    uri: string(wrapper?.uri),
    cid: string(wrapper?.cid),
    did: string(author?.did),
    handle: string(author?.handle),
    createdAt: string(record?.createdAt),
    record: record ?? supplied,
  }
}

/** Bounded inspection: no HTML, links, media loading or recursive renderers. */
export function formatRecordJson(value: unknown): string {
  let remaining = 400
  const seen = new WeakSet<object>()
  function bound(input: unknown, depth: number): unknown {
    if (--remaining < 0) return '[Additional fields omitted]'
    if (typeof input === 'string') {
      return input.length > 4000
        ? input.slice(0, 4000) + '… [truncated]'
        : input
    }
    if (!input || typeof input !== 'object') return input
    if (seen.has(input)) return '[Circular reference]'
    if (depth >= 6) return '[Nested content omitted]'
    seen.add(input)
    if (Array.isArray(input)) {
      const items = input.slice(0, 50).map(item => bound(item, depth + 1))
      if (input.length > 50) items.push('[Additional items omitted]')
      return items
    }
    const output: Record<string, unknown> = Object.create(null)
    let count = 0
    for (const key of Object.keys(input)) {
      if (++count > 50 || remaining < 0) {
        output['…'] = '[Additional fields omitted]'
        break
      }
      output[key] = bound((input as Record<string, unknown>)[key], depth + 1)
    }
    return output
  }
  try {
    const text =
      JSON.stringify(bound(value, 0), null, 2) ?? 'No record supplied'
    return text.length > 24000 ? text.slice(0, 24000) + '\n… [truncated]' : text
  } catch {
    return 'This supplied value cannot be displayed as JSON.'
  }
}
