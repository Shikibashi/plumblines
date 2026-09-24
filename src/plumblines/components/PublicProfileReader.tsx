import {View} from 'react-native'
import {moderateProfile} from '@bsky/sdk/moderation'
import {Trans, useLingui} from '@lingui/react/macro'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'

import {sanitizeDisplayName} from '#/lib/strings/display-names'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {usePublicAppviewClient} from '#/state/session'
import {UserAvatar} from '#/view/com/util/UserAvatar'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Layout from '#/components/Layout'
import {ContentHider} from '#/components/moderation/ContentHider'
import {ScreenHider} from '#/components/moderation/ScreenHider'
import {Text} from '#/components/Typography'
import {app} from '#/lexicons'
import {PublicPostCard} from '#/plumblines/components/PublicPostReader'

/** Public profile reads stay separate from authenticated profile/feed caches. */
export function PublicProfileReader({
  accountProfile,
  onClose,
}: {
  accountProfile: app.bsky.actor.defs.ProfileViewDetailed
  onClose: () => void
}) {
  const t = useTheme()
  const {t: l} = useLingui()
  const client = usePublicAppviewClient()
  const moderationOpts = useModerationOpts()
  const profileQuery = useQuery({
    queryKey: ['plumblines-public-profile', accountProfile.did],
    queryFn: () =>
      client.call(app.bsky.actor.getProfile, {actor: accountProfile.did}),
  })
  const feedQuery = useInfiniteQuery({
    queryKey: ['plumblines-public-author-feed', accountProfile.did],
    queryFn: ({pageParam}: {pageParam: string | undefined}) =>
      client.call(app.bsky.feed.getAuthorFeed, {
        actor: accountProfile.did,
        cursor: pageParam,
        limit: 30,
        filter: 'posts_and_author_threads',
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: page => page.cursor,
    enabled: !!profileQuery.data,
  })
  // Preserve known attention choices, but do not import interaction permissions.
  const publicViewer = {
    muted: accountProfile.viewer?.muted,
    mutedByList: accountProfile.viewer?.mutedByList,
  }
  const profile = profileQuery.data
    ? {...profileQuery.data, viewer: publicViewer}
    : undefined
  const moderation =
    profile && moderationOpts
      ? moderateProfile(profile, {...moderationOpts, userDid: undefined})
      : undefined
  // This view is about this author's own posts, not third-party reposts.
  const posts = feedQuery.data?.pages.flatMap(page =>
    page.feed
      .filter(item => item.post.author.did === accountProfile.did)
      .map(item => ({
        ...item.post,
        author: {...item.post.author, viewer: publicViewer},
      })),
  )

  return (
    <>
      <Layout.Header.Outer>
        <Layout.Header.BackButton onPress={onClose} />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Public profile</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content testID="publicProfileReader">
        <View
          style={[a.p_md, a.gap_sm, a.border_b, t.atoms.border_contrast_low]}>
          <Text>
            <Trans>
              Public view · Read-only. Your block relationships are unchanged.
              Only publicly available posts by this account are shown.
            </Trans>
          </Text>
          <Button
            label={l`Back to account view`}
            size="small"
            color="secondary"
            onPress={onClose}>
            <ButtonText>
              <Trans>Back to account view</Trans>
            </ButtonText>
          </Button>
        </View>
        {profileQuery.isPending && (
          <Text style={a.p_md}>
            <Trans>Loading public profile…</Trans>
          </Text>
        )}
        {profileQuery.isError && (
          <View style={[a.p_md, a.gap_sm]}>
            <Text>
              <Trans>This profile is not available in the public view.</Trans>
            </Text>
            <Button
              label={l`Retry public profile`}
              size="small"
              color="secondary"
              onPress={() => void profileQuery.refetch()}>
              <ButtonText>
                <Trans>Retry public profile</Trans>
              </ButtonText>
            </Button>
          </View>
        )}
        {profile && moderation && (
          <ScreenHider
            screenDescription={l`public profile`}
            modui={moderation.ui('profileView')}>
            <View style={[a.p_md, a.gap_sm]}>
              <UserAvatar
                type="user"
                size={64}
                avatar={profile.avatar}
                moderation={moderation.ui('avatar')}
              />
              <ContentHider modui={moderation.ui('profileView')}>
                <Text emoji style={[a.text_2xl, a.font_bold]}>
                  {sanitizeDisplayName(profile.displayName || profile.handle)}
                </Text>
                <Text>@{profile.handle}</Text>
                {!!profile.description && (
                  <Text emoji style={a.mt_sm}>
                    {profile.description}
                  </Text>
                )}
              </ContentHider>
            </View>
            {posts?.map(post => (
              <PublicPostCard key={post.uri} post={post} />
            ))}
            {feedQuery.isPending && (
              <Text style={a.p_md}>
                <Trans>Loading public posts…</Trans>
              </Text>
            )}
            {feedQuery.isError && (
              <View style={[a.p_md, a.gap_sm]}>
                <Text>
                  <Trans>Public posts could not be loaded.</Trans>
                </Text>
                <Button
                  label={l`Retry public posts`}
                  size="small"
                  color="secondary"
                  onPress={() => void feedQuery.refetch()}>
                  <ButtonText>
                    <Trans>Retry public posts</Trans>
                  </ButtonText>
                </Button>
              </View>
            )}
            {feedQuery.isSuccess && posts?.length === 0 && (
              <Text style={a.p_md}>
                <Trans>No public posts were returned on this page.</Trans>
              </Text>
            )}
            {feedQuery.hasNextPage && (
              <View style={a.p_md}>
                <Button
                  label={l`Load more public posts`}
                  size="small"
                  color="secondary"
                  disabled={feedQuery.isFetchingNextPage}
                  onPress={() => void feedQuery.fetchNextPage()}>
                  <ButtonText>
                    <Trans>Load more public posts</Trans>
                  </ButtonText>
                </Button>
              </View>
            )}
          </ScreenHider>
        )}
      </Layout.Content>
    </>
  )
}
