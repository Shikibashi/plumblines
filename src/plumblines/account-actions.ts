import {type Shadow} from '#/state/cache/types'
import {
  useProfileMuteMutationQueue,
  useProfileMuteRepostsMutationQueue,
  useProfileUnblockMutationQueue,
} from '#/state/queries/profile'
import type * as bsky from '#/types/bsky'

/** The account moderation capabilities that Plumblines actually supports. */
export function useAccountActions(
  profile: Shadow<bsky.profile.AnyProfileView>,
) {
  const [mute, unmute] = useProfileMuteMutationQueue(profile)
  const [muteReposts, unmuteReposts] =
    useProfileMuteRepostsMutationQueue(profile)
  const unblock = useProfileUnblockMutationQueue(profile)
  return {
    mute,
    unmute,
    muteReposts,
    unmuteReposts,
    ...(profile.viewer?.blocking ? {unblock} : {}),
  }
}
