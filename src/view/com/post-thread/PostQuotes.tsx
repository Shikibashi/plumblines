import {useCallback, useState} from 'react'
import {View} from 'react-native'
import {moderatePost, type ModerationDecision} from '@bsky/sdk/moderation'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'
import {useInfiniteQuery} from '@tanstack/react-query'

import {useInitialNumToRender} from '#/lib/hooks/useInitialNumToRender'
import {usePostViewTracking} from '#/lib/hooks/usePostViewTracking'
import {cleanError} from '#/lib/strings/errors'
import {logger} from '#/logger'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {usePostQuotesQuery} from '#/state/queries/post-quotes'
import {useResolveUriQuery} from '#/state/queries/resolve-uri'
import {usePublicAppviewClient} from '#/state/session'
import {Post} from '#/view/com/post/Post'
import {atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Layout from '#/components/Layout'
import {ListFooter, ListMaybePlaceholder} from '#/components/Lists'
import {Text} from '#/components/Typography'
import {app} from '#/lexicons'
import {PublicPostCard} from '#/plumblines/components/PublicPostReader'
import * as bsky from '#/types/bsky'
import {List} from '../util/List'

function renderItem({
  item,
  index,
}: {
  item: {
    post: app.bsky.feed.defs.PostView
    moderation: ModerationDecision
    record: app.bsky.feed.post.Main
  }
  index: number
}) {
  return <Post post={item.post} hideTopBorder={index === 0} />
}

function keyExtractor(item: {
  post: app.bsky.feed.defs.PostView
  moderation: ModerationDecision
  record: app.bsky.feed.post.Main
}) {
  return item.post.uri
}

export function PostQuotes({uri}: {uri: string}) {
  const {_} = useLingui()
  const [publicView, setPublicView] = useState(false)
  return (
    <>
      <Layout.Center>
        <View style={[a.p_md, a.gap_sm]}>
          <Text>
            <Trans>
              Quote counts can include posts the service does not return in this
              view.
            </Trans>
          </Text>
          <Button
            label={
              publicView
                ? _(msg`Back to account view`)
                : _(msg`View public quotes`)
            }
            color="secondary"
            size="small"
            onPress={() => setPublicView(value => !value)}>
            <ButtonText>
              {publicView ? (
                <Trans>Back to account view</Trans>
              ) : (
                <Trans>View public quotes</Trans>
              )}
            </ButtonText>
          </Button>
        </View>
      </Layout.Center>
      {publicView ? <PublicQuotes uri={uri} /> : <AccountQuotes uri={uri} />}
    </>
  )
}

function PublicQuotes({uri}: {uri: string}) {
  const {_} = useLingui()
  const client = usePublicAppviewClient()
  const {
    data: resolvedUri,
    error: resolveError,
    refetch: refetchUri,
  } = useResolveUriQuery(uri)
  const query = useInfiniteQuery({
    queryKey: ['plumblines-public-quotes', resolvedUri?.uri],
    enabled: !!resolvedUri,
    initialPageParam: undefined as string | undefined,
    queryFn: ({pageParam}) =>
      client.call(app.bsky.feed.getQuotes, {
        uri: resolvedUri!.uri,
        limit: 30,
        cursor: pageParam,
      }),
    getNextPageParam: page => page.cursor,
  })
  const posts = query.data?.pages.flatMap(page => page.posts) ?? []
  return (
    <Layout.Content>
      <View style={[a.p_md, a.gap_md]}>
        <Text>
          <Trans>Public view · Read only</Trans>
        </Text>
        {!resolveError && query.isPending && (
          <Text>
            <Trans>Loading public quotes…</Trans>
          </Text>
        )}
        {(resolveError || query.isError) && (
          <Text>
            <Trans>Could not load public quotes. Please try again.</Trans>
          </Text>
        )}
        {!resolveError &&
          !query.isPending &&
          !query.isError &&
          posts.length === 0 && (
            <Text>
              <Trans>
                No public quotes were returned. The service can omit blocked,
                deleted or restricted quotes even when the count is greater than
                zero.
              </Trans>
            </Text>
          )}
        {posts.map(post => (
          <PublicPostCard key={post.uri} post={post} />
        ))}
        {(resolveError || query.isError) && (
          <Button
            label={_(msg`Retry`)}
            color="secondary"
            size="small"
            onPress={() => {
              if (resolveError) void refetchUri()
              else void query.refetch()
            }}>
            <ButtonText>
              <Trans>Retry</Trans>
            </ButtonText>
          </Button>
        )}
        {query.hasNextPage && (
          <Button
            label={_(msg`Load more`)}
            color="secondary"
            size="small"
            disabled={query.isFetchingNextPage}
            onPress={() => {
              void query.fetchNextPage()
            }}>
            <ButtonText>
              <Trans>Load more</Trans>
            </ButtonText>
          </Button>
        )}
      </View>
    </Layout.Content>
  )
}

function AccountQuotes({uri}: {uri: string}) {
  const {_} = useLingui()
  const initialNumToRender = useInitialNumToRender()
  const [isPTRing, setIsPTRing] = useState(false)
  const trackPostView = usePostViewTracking('PostQuotes')

  const {
    data: resolvedUri,
    error: resolveError,
    isLoading: isLoadingUri,
  } = useResolveUriQuery(uri)
  const {
    data,
    isLoading: isLoadingQuotes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = usePostQuotesQuery(resolvedUri?.uri)

  const moderationOpts = useModerationOpts()

  const isError = Boolean(resolveError || error)

  const quotes =
    data?.pages
      .flatMap(page =>
        page.posts.map(post => {
          if (
            !bsky.isType(app.bsky.feed.post, post.record) ||
            !moderationOpts
          ) {
            return null
          }
          const moderation = moderatePost(post, moderationOpts)
          return {post, record: post.record, moderation}
        }),
      )
      .filter(item => item !== null) ?? []

  const onRefresh = useCallback(async () => {
    setIsPTRing(true)
    try {
      await refetch()
    } catch (err) {
      logger.error('Failed to refresh quotes', {message: err})
    }
    setIsPTRing(false)
  }, [refetch, setIsPTRing])

  const onEndReached = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || isError) return
    try {
      await fetchNextPage()
    } catch (err) {
      logger.error('Failed to load more quotes', {message: err})
    }
  }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage])

  if (quotes.length < 1) {
    return (
      <ListMaybePlaceholder
        isLoading={isLoadingUri || isLoadingQuotes}
        isError={isError}
        emptyType="results"
        emptyTitle={_(msg`No quotes available`)}
        emptyMessage={_(
          msg`The service returned no visible quotes. Try the public view to check for posts omitted from your account view.`,
        )}
        errorMessage={cleanError(resolveError || error)}
        sideBorders={false}
      />
    )
  }

  // loaded
  // =
  return (
    <List
      data={quotes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshing={isPTRing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={4}
      onItemSeen={item => trackPostView(item.post)}
      ListFooterComponent={
        <ListFooter
          isFetchingNextPage={isFetchingNextPage}
          error={cleanError(error)}
          onRetry={fetchNextPage}
          showEndMessage
          endMessageText={_(msg`That's all, folks!`)}
        />
      }
      desktopFixedHeight
      initialNumToRender={initialNumToRender}
      windowSize={11}
      sideBorders={false}
    />
  )
}
