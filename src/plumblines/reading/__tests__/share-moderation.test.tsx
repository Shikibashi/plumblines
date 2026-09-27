import {type PropsWithChildren} from 'react'
import {Text} from 'react-native'
import {type ModerationUI} from '@bsky/sdk/moderation'
import {setupI18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {act, render} from '@testing-library/react-native'

import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {ContentHider} from '#/components/moderation/ContentHider'
import {type app} from '#/lexicons'
import {SharePostImageDialog} from '../SharePostImageDialog.web'

jest.mock('#/state/preferences/moderation-opts', () => ({
  useModerationOpts: jest.fn(),
}))
jest.mock('#/alf', () => ({atoms: {}}))
jest.mock('#/components/Typography', () => {
  const native: typeof import('react-native') = require('react-native')
  return {Text: native.Text}
})
jest.mock('#/components/Button', () => {
  const native: typeof import('react-native') = require('react-native')
  return {Button: native.View, ButtonText: native.Text}
})
jest.mock('#/components/Dialog', () => {
  const native: typeof import('react-native') = require('react-native')
  return {
    Outer: native.View,
    ScrollableInner: native.View,
    Handle: () => null,
    Close: () => null,
  }
})
// Assert the dialog hands the real SDK decision to the existing reveal boundary
// and does not mount its canvas-producing child while that boundary is closed.
jest.mock('#/components/moderation/ContentHider', () => ({
  ContentHider: jest.fn(
    ({modui, children}: PropsWithChildren<{modui?: ModerationUI}>) =>
      modui?.blurs.length ? null : children,
  ),
}))

const i18n = setupI18n({locale: 'en', messages: {en: {}}})
const did = 'did:plc:author'
const record: app.bsky.feed.post.Main = {
  $type: 'app.bsky.feed.post',
  text: 'Hidden story',
  createdAt: '2026-09-23T00:00:00.000Z',
}
const basePost: app.bsky.feed.defs.PostView = {
  uri: `at://${did}/app.bsky.feed.post/123`,
  cid: 'bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
  author: {did, handle: 'author.test'},
  record,
  indexedAt: record.createdAt,
}
const options = {
  userDid: undefined,
  prefs: {
    adultContentEnabled: true,
    labels: {},
    labelers: [],
    mutedWords: [],
    hiddenPosts: [],
  },
}
const control = {id: 'share', ref: {current: null}, open() {}, close() {}}
function wrapper({children}: PropsWithChildren) {
  return (
    <I18nProvider i18n={i18n} defaultComponent={Text}>
      {children}
    </I18nProvider>
  )
}
async function show(post: app.bsky.feed.defs.PostView) {
  render(
    <SharePostImageDialog control={control} post={post} record={record} />,
    {wrapper},
  )
  await act(async () => {
    await Promise.resolve()
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useModerationOpts).mockReturnValue(options)
})

it('keeps a muted author behind the content hider without generating an image', async () => {
  await show({...basePost, author: {...basePost.author, viewer: {muted: true}}})
  const decision = jest.mocked(ContentHider).mock.calls[0][0].modui!
  expect(decision.blurs.some(cause => cause.type === 'muted')).toBe(true)
})

it('passes no-unauthenticated as a non-overridable block and never mounts the canvas', async () => {
  await show({
    ...basePost,
    author: {
      ...basePost.author,
      labels: [
        {src: did, uri: did, val: '!no-unauthenticated', cts: record.createdAt},
      ],
    },
  })
  const decision = jest.mocked(ContentHider).mock.calls[0][0].modui!
  expect(decision.blurs.length).toBeGreaterThan(0)
  expect(decision.noOverride).toBe(true)
})

it('does not mount generation before moderation preferences are ready', async () => {
  jest.mocked(useModerationOpts).mockReturnValue(undefined)
  await show(basePost)
  expect(ContentHider).not.toHaveBeenCalled()
})
