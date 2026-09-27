import {type FeedDescriptor} from '#/state/queries/post-feed'
import {type UsePreferencesQueryResponse} from '#/state/queries/preferences'

type FeedContext =
  | {kind: 'page' | 'unknown' | 'public'}
  | {kind: 'custom' | 'list'; uri: string}
  | {
      kind: 'following'
      merged: boolean | undefined
      discoverFallback: boolean
    }

/** Selected-feed state belongs to Home and can survive navigation or sign-out. */
export function getFeedContext({
  routeName,
  hasSession,
  selectedFeed,
  preferences,
}: {
  routeName: string
  hasSession: boolean
  selectedFeed: FeedDescriptor | null
  preferences?: {
    feedViewPrefs: Pick<
      UsePreferencesQueryResponse['feedViewPrefs'],
      'lab_mergeFeedEnabled'
    >
    savedFeeds: UsePreferencesQueryResponse['savedFeeds']
  }
}): FeedContext {
  if (routeName !== 'Home' && routeName !== 'Start') return {kind: 'page'}
  if (!hasSession) return {kind: 'public'}
  if (selectedFeed === 'following') {
    const merged = preferences
      ? Boolean(preferences.feedViewPrefs.lab_mergeFeedEnabled)
      : undefined
    return {
      kind: 'following',
      merged,
      // This mirrors the HomeFeedAPI selection in post-feed.ts.
      discoverFallback:
        merged === false &&
        preferences?.savedFeeds.findIndex(
          feed => feed.pinned && feed.value === 'following',
        ) === 0,
    }
  }
  if (selectedFeed?.startsWith('feedgen|') && selectedFeed.length > 8) {
    return {kind: 'custom', uri: selectedFeed.slice(8)}
  }
  if (selectedFeed?.startsWith('list|') && selectedFeed.length > 5) {
    return {kind: 'list', uri: selectedFeed.slice(5)}
  }
  return {kind: 'unknown'}
}
