import {type FeedTunerFn} from '#/lib/api/feed-manip'
import {type SectionFilters} from './model'

/** Shape filters remove selected stories without changing moderation decisions. */
export function sectionFeedFilter(filters: SectionFilters): FeedTunerFn {
  return (_tuner, slices) =>
    slices.filter(
      slice =>
        (filters.replies || !slice.isReply) &&
        (filters.reposts || !slice.isRepost) &&
        (filters.quotes || !slice.isQuotePost),
    )
}
