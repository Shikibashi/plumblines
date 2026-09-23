import {bskyTitle} from '#/lib/strings/headings'
import {APP_CONFIG} from '../config'

describe('fork identity', () => {
  it('uses the fork name in browser titles while retaining unread counts', () => {
    expect(bskyTitle('Following', '3')).toBe('(3) Following — Plumblines')
    expect(bskyTitle('Search')).toBe('Search — Plumblines')
  })

  it('uses a separate application identity and fork support', () => {
    expect(APP_CONFIG.applicationId).toBe('uk.plumblines.app')
    expect(APP_CONFIG.supportUrl).toBe(
      'https://github.com/Shikibashi/plumblines/issues',
    )
  })
})
