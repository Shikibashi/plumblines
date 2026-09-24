import {createElement} from 'react'
import {ModerationDecision} from '@bsky/sdk/moderation'
import {act, create, type ReactTestRenderer} from 'react-test-renderer'

import {type FeedPostSlice} from '#/state/queries/post-feed'
import {PostFeedItem} from '#/view/com/posts/PostFeedItem'
import {ViewFullThread} from '#/view/com/posts/ViewFullThread'
import {SectionFeedSlice} from './index'

jest.mock('#/state/cache/profile-shadow', () => ({}))
jest.mock('#/state/feed-feedback', () => ({}))
jest.mock('#/state/preferences/hidden-posts', () => ({}))
jest.mock('#/state/queries/post-feed', () => ({}))
jest.mock('#/state/queries/resolve-uri', () => ({}))
jest.mock('#/state/queries/search-posts-v2', () => ({}))
jest.mock('#/state/session', () => ({}))
jest.mock('#/state/shell/logged-out', () => ({}))
jest.mock('#/view/com/post/Post', () => ({}))
jest.mock('#/view/com/posts/PostFeedItem', () => ({
  PostFeedItem: jest.fn(() => null),
}))
jest.mock('#/view/com/posts/ViewFullThread', () => ({
  ViewFullThread: jest.fn(() => null),
}))
jest.mock('#/alf', () => ({}))
jest.mock('#/plumblines/local-attention', () => ({}))
jest.mock('#/plumblines/local-preferences', () => ({}))
jest.mock('./keyboard', () => ({}))

function slice(incomplete: boolean, count: number): FeedPostSlice {
  return {
    _isFeedPostSlice: true,
    _reactKey: 'test-thread',
    isIncompleteThread: incomplete,
    isFallbackMarker: false,
    feedContext: undefined,
    reqId: undefined,
    feedPostUri: 'at://did:plc:author/app.bsky.feed.post/story-0',
    items: Array.from({length: count}, (_, index) => {
      const uri =
        `at://did:plc:author/app.bsky.feed.post/story-${index}` as const
      const record = {
        $type: 'app.bsky.feed.post' as const,
        text: `Story ${index}`,
        createdAt: '2026-09-23T00:00:00.000Z' as const,
      }
      return {
        _reactKey: `story-${index}`,
        uri,
        record,
        post: {
          uri,
          cid: 'bafyreidybmzxgmelpdhq43a4t3zdyeydg37khx55nusdernot7ojuvsuve',
          author: {
            did: `did:plc:author-${index}` as const,
            handle: 'author.test',
          },
          record,
          indexedAt: record.createdAt,
        },
        moderation: new ModerationDecision(),
        parentAuthor: {
          did: 'did:plc:other-author',
          handle: 'other-author.test',
        },
      }
    }),
  }
}

let rendered: ReactTestRenderer
function renderSlice(value: FeedPostSlice) {
  act(() => {
    rendered = create(createElement(SectionFeedSlice, {slice: value}))
  })
  return rendered.root
}
afterEach(() => {
  act(() => rendered.unmount())
})

it('shows the upstream gap link between a root and distant parent, linking to the root', () => {
  const value = slice(true, 4)
  const root = renderSlice(value)
  const presentation = root.findAll(
    node => node.type === PostFeedItem || node.type === ViewFullThread,
  )
  expect(presentation.map(node => node.type)).toEqual([
    PostFeedItem,
    ViewFullThread,
    PostFeedItem,
    PostFeedItem,
  ])
  expect(presentation[1].props.uri).toBe(value.items[0].uri)
  expect(
    presentation
      .filter(node => node.type === PostFeedItem)
      .map(node => node.props.post),
  ).toEqual([value.items[0].post, value.items[2].post, value.items[3].post])
  expect(presentation[2].props.showReplyTo).toBe(true)
  expect(presentation[3].props.showReplyTo).toBe(false)
})

it('keeps a complete thread consecutive without a false gap', () => {
  const root = renderSlice(slice(false, 3))
  expect(root.findAllByType(ViewFullThread)).toHaveLength(0)
  expect(root.findAllByType(PostFeedItem)).toHaveLength(3)
})
