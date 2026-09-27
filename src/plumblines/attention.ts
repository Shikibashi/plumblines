import {type app} from '#/lexicons'

export type AttentionRule = {
  kind: 'account' | 'topic'
  subject: string
  label: string
  expiresAt: number
}
export type AttentionPreferences = {version: 1; rules: AttentionRule[]}
export const EMPTY_ATTENTION: AttentionPreferences = {version: 1, rules: []}

export function validateAttention(value: unknown): AttentionPreferences {
  if (!value || typeof value !== 'object') return EMPTY_ATTENTION
  const input = value as Record<string, unknown>
  if (input.version !== 1 || !Array.isArray(input.rules)) return EMPTY_ATTENTION
  const rules: AttentionRule[] = []
  for (const item of input.rules.slice(0, 100) as unknown[]) {
    if (!item || typeof item !== 'object') continue
    const rule = item as Record<string, unknown>
    if (
      (rule.kind !== 'account' && rule.kind !== 'topic') ||
      typeof rule.subject !== 'string' ||
      !rule.subject.trim() ||
      rule.subject.length > 256 ||
      typeof rule.label !== 'string' ||
      rule.label.length > 256 ||
      typeof rule.expiresAt !== 'number' ||
      !Number.isSafeInteger(rule.expiresAt) ||
      rule.expiresAt > 8_640_000_000_000_000 ||
      rule.expiresAt <= 0
    )
      continue
    if (rule.kind === 'account' && !rule.subject.startsWith('did:')) continue
    rules.push({
      kind: rule.kind,
      subject: rule.subject,
      label: rule.label,
      expiresAt: rule.expiresAt,
    })
  }
  return {version: 1, rules}
}

/** Only local presentation is filtered. Fetched records and network preferences are unchanged. */
export function isLocallyHidden(
  post: app.bsky.feed.defs.PostView,
  rules: AttentionRule[],
  now: number,
): boolean {
  const record = post.record as Record<string, unknown>
  const text =
    typeof record?.text === 'string' ? record.text.toLocaleLowerCase() : ''
  return rules.some(
    rule =>
      rule.expiresAt > now &&
      (rule.kind === 'account'
        ? rule.subject === post.author.did
        : text.includes(rule.subject.toLocaleLowerCase())),
  )
}

export function addAttentionRule(
  prefs: AttentionPreferences,
  rule: AttentionRule,
  now: number,
): AttentionPreferences {
  const remaining = prefs.rules.filter(
    existing =>
      existing.expiresAt > now &&
      !(existing.kind === rule.kind && existing.subject === rule.subject),
  )
  if (remaining.length >= 100)
    throw new Error('Remove an existing local rule before adding another.')
  return validateAttention({version: 1, rules: [...remaining, rule]})
}
