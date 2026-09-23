import {useMemo} from 'react'

import {FeedTuner} from '#/lib/api/feed-manip'
import {sectionFeedFilter} from '#/plumblines/sections/filters'
import {type SectionFilters} from '#/plumblines/sections/model'
import {type FeedDescriptor} from '../queries/post-feed'
import {usePreferencesQuery} from '../queries/preferences'
import {useSession} from '../session'
import {useLanguagePrefs} from './languages'

export function useFeedTuners(
  feedDesc: FeedDescriptor,
  sectionFilters?: SectionFilters,
) {
  const langPrefs = useLanguagePrefs()
  const {data: preferences} = usePreferencesQuery()
  const {currentAccount} = useSession()

  return useMemo(() => {
    // plumblines: section filters replace global feed-shape preferences, never moderation.
    if (sectionFilters) {
      return [
        sectionFeedFilter(sectionFilters),
        ...(feedDesc.startsWith('feedgen')
          ? [FeedTuner.preferredLangOnly(langPrefs.contentLanguages)]
          : []),
        FeedTuner.removeMutedThreads,
      ]
    }
    if (feedDesc.startsWith('author')) {
      if (feedDesc.endsWith('|posts_with_replies')) {
        // TODO: Do this on the server instead.
        return [FeedTuner.removeReposts]
      }
    }
    if (feedDesc.startsWith('feedgen')) {
      return [
        FeedTuner.preferredLangOnly(langPrefs.contentLanguages),
        FeedTuner.removeMutedThreads,
      ]
    }
    if (feedDesc === 'following' || feedDesc.startsWith('list')) {
      const feedTuners = [FeedTuner.removeOrphans]

      if (preferences?.feedViewPrefs.hideReposts) {
        feedTuners.push(FeedTuner.removeReposts)
      }
      if (preferences?.feedViewPrefs.hideReplies) {
        feedTuners.push(FeedTuner.removeReplies)
      } else {
        feedTuners.push(
          FeedTuner.followedRepliesOnly({
            userDid: currentAccount?.did || '',
          }),
        )
      }
      if (preferences?.feedViewPrefs.hideQuotePosts) {
        feedTuners.push(FeedTuner.removeQuotePosts)
      }
      feedTuners.push(FeedTuner.dedupThreads)
      feedTuners.push(FeedTuner.removeMutedThreads)

      return feedTuners
    }
    return []
  }, [feedDesc, currentAccount, preferences, langPrefs, sectionFilters])
}
