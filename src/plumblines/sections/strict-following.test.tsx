import {useInfiniteQuery} from '@tanstack/react-query'
import {renderHook} from '@testing-library/react-native'

import {FollowingFeedAPI} from '#/lib/api/feed/following'
import {HomeFeedAPI} from '#/lib/api/feed/home'
import {MergeFeedAPI} from '#/lib/api/feed/merge'
import {
  type FeedPage,
  type FeedPageUnselected,
  usePostFeedQuery,
} from '#/state/queries/post-feed'
import {useAppviewClient} from '#/state/session'
import {app} from '#/lexicons'
import {useLocalAttention} from '#/plumblines/local-attention'

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(() => ({})),
}))
jest.mock('#/lib/api/feed/author', () => ({AuthorFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/custom', () => ({CustomFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/demo', () => ({DemoFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/likes', () => ({LikesFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/list', () => ({ListFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/posts', () => ({PostListFeedAPI: jest.fn()}))
jest.mock('#/lib/api/feed/home', () => ({
  HomeFeedAPI: jest.fn(() => ({fetch: () => Promise.resolve({feed: []})})),
  FALLBACK_MARKER_POST: {post: {uri: 'fallback-marker'}},
}))
jest.mock('#/lib/api/feed/merge', () => ({
  MergeFeedAPI: jest.fn(() => ({fetch: () => Promise.resolve({feed: []})})),
}))
jest.mock('#/state/preferences/feed-tuners', () => ({useFeedTuners: () => []}))
jest.mock('#/state/preferences/moderation-opts', () => ({
  useModerationOpts: () => ({}),
}))
jest.mock('#/state/queries/preferences', () => ({
  usePreferencesQuery: () => ({
    data: {
      savedFeeds: [{type: 'timeline', value: 'following', pinned: true}],
      interests: {tags: []},
    },
  }),
}))
jest.mock('#/state/queries/preferences/const', () => ({
  DEFAULT_LOGGED_OUT_PREFERENCES: {},
}))
jest.mock('#/state/session', () => ({
  useAppviewClient: jest.fn(),
  useSession: () => ({hasSession: true}),
}))
jest.mock('#/state/userActionHistory', () => ({seen: jest.fn()}))
jest.mock('#/view/com/posts/PostFeedErrorMessage', () => ({
  KnownError: class KnownError extends Error {},
}))
jest.mock('#/state/queries/util', () => ({useAutoPagination: jest.fn()}))
jest.mock('#/plumblines/local-attention', () => ({
  useLocalAttention: jest.fn(),
}))
jest.mock('@bsky/sdk/moderation', () => ({
  moderatePost: () => ({causes: [], ui: () => ({filter: false})}),
}))

type PageData<T> = {pages: T[]; pageParams: unknown[]}
type QueryOptions = {
  queryFn: (context: {
    pageParam: undefined | {api: FollowingFeedAPI; cursor: string}
  }) => Promise<FeedPageUnselected>
  select: (data: PageData<FeedPageUnselected>) => PageData<FeedPage>
}
function options() {
  return jest
    .mocked(useInfiniteQuery)
    .mock.calls.at(-1)![0] as unknown as QueryOptions
}

beforeEach(() => {
  jest.clearAllMocks()
  jest
    .mocked(useLocalAttention)
    .mockReturnValue({isPostHidden: () => false} as never)
})

it.each([true, false])(
  'strict Following uses getTimeline with merge=%s and Following first pinned',
  async mergeFeedEnabled => {
    const client = {
      call: jest
        .fn()
        .mockResolvedValueOnce({feed: [], cursor: 'next-page'})
        .mockResolvedValueOnce({feed: []}),
    }
    jest.mocked(useAppviewClient).mockReturnValue(client as never)
    renderHook(() =>
      usePostFeedQuery('following', {
        strictFollowing: true,
        mergeFeedEnabled,
        mergeFeedSources: [
          'at://did:plc:example/app.bsky.feed.generator/recommendations',
        ],
      }),
    )
    const first = await options().queryFn({pageParam: undefined})
    expect(first.api).toBeInstanceOf(FollowingFeedAPI)
    expect(HomeFeedAPI).not.toHaveBeenCalled()
    expect(MergeFeedAPI).not.toHaveBeenCalled()
    expect(client.call).toHaveBeenNthCalledWith(1, app.bsky.feed.getTimeline, {
      cursor: undefined,
      limit: 30,
    })
    await options().queryFn({
      pageParam: {api: first.api as FollowingFeedAPI, cursor: first.cursor!},
    })
    expect(client.call).toHaveBeenNthCalledWith(2, app.bsky.feed.getTimeline, {
      cursor: 'next-page',
      limit: 30,
    })
    expect(client.call).toHaveBeenCalledTimes(2)
  },
)

it('exercises the legacy fallback when strict Following is absent', async () => {
  jest.mocked(useAppviewClient).mockReturnValue({call: jest.fn()} as never)
  renderHook(() => usePostFeedQuery('following'))
  await options().queryFn({pageParam: undefined})
  expect(HomeFeedAPI).toHaveBeenCalledTimes(1)
})

it('snoozes a home-feed story while allowing an explicitly opened author profile', () => {
  const did = 'did:plc:subject'
  const post = {
    uri: `at://${did}/app.bsky.feed.post/story`,
    cid: 'story',
    author: {did, handle: 'subject.test'},
    record: {
      $type: 'app.bsky.feed.post',
      text: 'story',
      createdAt: '2026-09-23T00:00:00.000Z',
    },
    indexedAt: '2026-09-23T00:00:00.000Z',
  } as app.bsky.feed.defs.PostView
  const data: PageData<FeedPageUnselected> = {
    pageParams: [undefined],
    pages: [
      {
        api: {} as FollowingFeedAPI,
        cursor: undefined,
        feed: [{post}],
        fetchedAt: 1,
      },
    ],
  }
  jest
    .mocked(useLocalAttention)
    .mockReturnValue({isPostHidden: () => true} as never)
  renderHook(() => usePostFeedQuery('following', {strictFollowing: true}))
  expect(options().select(data).pages[0].slices).toHaveLength(0)
  renderHook(() =>
    usePostFeedQuery(`author|${did}|posts_with_replies`, undefined, {
      ignoreFilterFor: did,
    }),
  )
  expect(options().select(data).pages[0].slices).toHaveLength(1)
})
