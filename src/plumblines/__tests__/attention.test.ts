import {type app} from '#/lexicons'
import {
  addAttentionRule,
  EMPTY_ATTENTION,
  isLocallyHidden,
  validateAttention,
} from '#/plumblines/attention'

const post = {
  author: {did: 'did:plc:alice', handle: 'alice.test'},
  cid: 'bafytest',
  uri: 'at://did:plc:alice/app.bsky.feed.post/one',
  indexedAt: '2026-09-23T00:00:00Z',
  record: {text: 'A quiet garden and CAT videos'},
} as app.bsky.feed.defs.PostView
const account = {
  kind: 'account' as const,
  subject: 'did:plc:alice',
  label: 'alice',
  expiresAt: 200,
}

test('account snoozes expire at their boundary and do not hide other authors', () => {
  expect(isLocallyHidden(post, [account], 199)).toBe(true)
  expect(isLocallyHidden(post, [account], 200)).toBe(false)
  expect(
    isLocallyHidden(
      {...post, author: {...post.author, did: 'did:plc:bob'}},
      [account],
      100,
    ),
  ).toBe(false)
})
test('topic rules match literal case-insensitive text, not regex syntax', () => {
  const topic = {...account, kind: 'topic' as const, subject: 'cat'}
  expect(isLocallyHidden(post, [topic], 100)).toBe(true)
  expect(isLocallyHidden(post, [{...topic, subject: '.*'}], 100)).toBe(false)
})
test('validation discards corrupt entries and unknown versions', () => {
  expect(validateAttention({version: 2, rules: [account]})).toEqual(
    EMPTY_ATTENTION,
  )
  expect(
    validateAttention({
      version: 1,
      rules: [
        null,
        {...account, expiresAt: Infinity},
        {...account, expiresAt: 1e100},
        {...account, subject: ''},
        account,
      ],
    }).rules,
  ).toEqual([account])
})
test('resnoozing replaces one rule and reclaims expired slots', () => {
  expect(
    addAttentionRule(
      {
        version: 1,
        rules: [account, {...account, subject: 'did:plc:old', expiresAt: 50}],
      },
      {...account, expiresAt: 300},
      100,
    ).rules,
  ).toEqual([{...account, expiresAt: 300}])
  const full = {
    version: 1 as const,
    rules: Array.from({length: 100}, (_, i) => ({
      ...account,
      subject: `did:plc:${i}`,
    })),
  }
  expect(() => addAttentionRule(full, account, 100)).toThrow()
  expect(addAttentionRule(full, account, 201).rules).toHaveLength(1)
})
