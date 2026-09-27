import {getFeedContext} from './feed-context'

const feed =
  'feedgen|at://did:plc:provider/app.bsky.feed.generator/news' as const
const preferences = {
  feedViewPrefs: {lab_mergeFeedEnabled: false},
  savedFeeds: [
    {
      id: 'following',
      value: 'following',
      type: 'timeline' as const,
      pinned: true,
    },
  ],
}

it.each([
  'Profile',
  'Settings',
  'Search',
  'ProfileFeed',
  'ProfileList',
  'PostThread',
])('does not reuse home-feed identity on %s', routeName => {
  expect(
    getFeedContext({
      routeName,
      hasSession: true,
      selectedFeed: feed,
      preferences,
    }),
  ).toEqual({kind: 'page'})
})

it('does not reuse a saved feed after sign-out', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: false,
      selectedFeed: feed,
      preferences,
    }),
  ).toEqual({kind: 'public'})
})

it('keeps unresolved feed selection unknown', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: null,
      preferences,
    }),
  ).toEqual({kind: 'unknown'})
})

it('preserves the active custom feed URI only on Home', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: feed,
      preferences,
    }),
  ).toEqual({kind: 'custom', uri: feed.slice(8)})
})

it('distinguishes list feeds from external generators', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: 'list|at://did:plc:owner/app.bsky.graph.list/news',
      preferences,
    }),
  ).toEqual({kind: 'list', uri: 'at://did:plc:owner/app.bsky.graph.list/news'})
})

it('does not assume unmerged Following while preferences load', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: 'following',
    }),
  ).toEqual({kind: 'following', merged: undefined, discoverFallback: false})
})

it('identifies mixed Following without claiming chronological order', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: 'following',
      preferences: {
        ...preferences,
        feedViewPrefs: {lab_mergeFeedEnabled: true},
      },
    }),
  ).toEqual({kind: 'following', merged: true, discoverFallback: false})
})

it('discloses configured Discover fallback without claiming it has started', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: 'following',
      preferences,
    }),
  ).toEqual({kind: 'following', merged: false, discoverFallback: true})
})

it('does not attribute Discover fallback to other Following configurations', () => {
  expect(
    getFeedContext({
      routeName: 'Home',
      hasSession: true,
      selectedFeed: 'following',
      preferences: {...preferences, savedFeeds: []},
    }),
  ).toEqual({kind: 'following', merged: false, discoverFallback: false})
})
