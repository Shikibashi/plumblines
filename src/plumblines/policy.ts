const BLOCK_COLLECTIONS = new Set([
  'app.bsky.graph.block',
  'app.bsky.graph.listblock',
])

function isBlockRecord(value: Record<string, unknown>): boolean {
  return (
    BLOCK_COLLECTIONS.has(String(value.collection)) ||
    (typeof value.record === 'object' &&
      value.record !== null &&
      BLOCK_COLLECTIONS.has(
        String((value.record as Record<string, unknown>).$type),
      )) ||
    (typeof value.value === 'object' &&
      value.value !== null &&
      BLOCK_COLLECTIONS.has(
        String((value.value as Record<string, unknown>).$type),
      ))
  )
}

/**
 * Inspect the SDK's serialized JSON before the session adds credentials or
 * sends a request. Deletes remain available for pre-existing block records.
 */
export function assertPdsWriteAllowed(path: string, init: RequestInit): void {
  const method = path.split('?')[0]
  const singleWrite =
    method === '/xrpc/com.atproto.repo.createRecord' ||
    method === '/xrpc/com.atproto.repo.putRecord'
  const batchWrite = method === '/xrpc/com.atproto.repo.applyWrites'
  if (!singleWrite && !batchWrite) return

  if (typeof init.body !== 'string') {
    throw new Error('Cannot inspect repository write payload')
  }
  const body: unknown = JSON.parse(init.body)
  if (!body || typeof body !== 'object') {
    throw new Error('Cannot inspect repository write payload')
  }
  const input = body as Record<string, unknown>
  const denied = singleWrite
    ? isBlockRecord(input)
    : Array.isArray(input.writes) &&
      input.writes.some(
        (write: unknown) =>
          write !== null &&
          typeof write === 'object' &&
          (write as Record<string, unknown>).$type !==
            'com.atproto.repo.applyWrites#delete' &&
          isBlockRecord(write as Record<string, unknown>),
      )
  if (denied) {
    throw new Error(
      'Plumblines does not create account blocks or blocking-list subscriptions',
    )
  }
}
