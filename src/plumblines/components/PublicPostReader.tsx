import {useState} from 'react'
import {View} from 'react-native'
import {AtUri, type AtUriString} from '@atproto/syntax'
import {moderatePost} from '@bsky/sdk/moderation'
import {RichText as RichTextAPI} from '@bsky/sdk/richtext'
import {Trans, useLingui} from '@lingui/react/macro'
import {useQuery} from '@tanstack/react-query'

import {makeProfileLink} from '#/lib/routes/links'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {usePublicAppviewClient} from '#/state/session'
import {Link} from '#/view/com/util/Link'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {ContentHider} from '#/components/moderation/ContentHider'
import {ExternalEmbed} from '#/components/Post/Embed/ExternalEmbed'
import {ImageEmbed} from '#/components/Post/Embed/ImageEmbed'
import {PostEmbedViewContext} from '#/components/Post/Embed/types'
import {VideoEmbed} from '#/components/Post/Embed/VideoEmbed'
import {RichText} from '#/components/RichText'
import {Text} from '#/components/Typography'
import {app} from '#/lexicons'
import * as bsky from '#/types/bsky'
import {parseEmbed} from '#/types/bsky/post'

/** Public results stay outside authenticated caches and expose no write controls. */
export function PublicPostCard({post}: {post: app.bsky.feed.defs.PostView}) {
  const t = useTheme()
  const {i18n} = useLingui()
  const opts = useModerationOpts()
  if (!opts || !bsky.matches(app.bsky.feed.post, post.record)) return null
  const record = post.record
  // Evaluate logged-out visibility even while the surrounding app is signed in.
  const moderation = moderatePost(post, {...opts, userDid: undefined})
  const richText = new RichTextAPI({text: record.text, facets: record.facets})
  const embed = parseEmbed(post.embed)
  const media = embed.type === 'post_with_media' ? embed.media : embed
  const quote = embed.type === 'post_with_media' ? embed.view : embed
  const uri = new AtUri(post.uri)
  const mediaProps = {post, moderation, viewContext: PostEmbedViewContext.Feed}

  return (
    <View
      testID="plumblines-public-post"
      style={[a.p_md, a.gap_sm, a.border, t.atoms.border_contrast_low]}>
      <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
        <Trans>Public view · Read only</Trans>
      </Text>
      <ContentHider modui={moderation.ui('contentList')}>
        <Link href={makeProfileLink(post.author)}>
          <Text emoji style={[a.font_bold]}>
            {post.author.displayName || post.author.handle} @
            {post.author.handle}
          </Text>
        </Link>
        <ContentHider modui={moderation.ui('contentView')}>
          <RichText
            value={richText}
            enableTags
            style={[a.text_md, t.atoms.text]}
            authorHandle={post.author.handle}
          />
        </ContentHider>
        <ContentHider modui={moderation.ui('contentMedia')}>
          {(media.type === 'images' || media.type === 'gallery') && (
            <ImageEmbed embed={media} {...mediaProps} />
          )}
          {media.type === 'video' && (
            <VideoEmbed embed={media.view} post={post} />
          )}
          {media.type === 'link' && (
            <ExternalEmbed link={media.view.external} post={post} />
          )}
        </ContentHider>
        {(quote.type === 'post' || quote.type === 'post_blocked') && (
          <Link
            href={`/profile/${new AtUri(quote.view.uri).hostname}/post/${new AtUri(quote.view.uri).rkey}`}>
            <Text style={t.atoms.text_link}>
              <Trans>Open quoted post</Trans>
            </Text>
          </Link>
        )}
        <Link href={makeProfileLink(post.author, 'post', uri.rkey)}>
          <Text style={[a.text_sm, t.atoms.text_link]}>
            {i18n.date(new Date(record.createdAt), {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Text>
        </Link>
      </ContentHider>
    </View>
  )
}

/** Explicit recovery of a public post identified by a blocked placeholder. */
export function PublicPostReader({uri}: {uri: string}) {
  const {t: l} = useLingui()
  const [requested, setRequested] = useState(false)
  const client = usePublicAppviewClient()
  const query = useQuery({
    queryKey: ['plumblines-public-post', uri],
    enabled: requested,
    retry: false,
    queryFn: async () => {
      const parsed = new AtUri(uri)
      if (parsed.collection !== 'app.bsky.feed.post')
        throw new Error('Not a public post URI')
      const response = await client.call(app.bsky.feed.getPosts, {
        uris: [uri as AtUriString],
      })
      return response.posts.find(post => post.uri === uri) ?? null
    },
  })
  if (requested && query.data) return <PublicPostCard post={query.data} />
  return (
    <View testID="plumblines-public-post-prompt" style={[a.p_md, a.gap_sm]}>
      <Text>
        <Trans>
          This post is blocked in this conversation. You can check its public
          version.
        </Trans>
      </Text>
      {requested && !query.isFetching && (
        <Text>
          <Trans>
            The public service did not return this post. It may be unavailable
            or restricted.
          </Trans>
        </Text>
      )}
      <Button
        label={l`View public post`}
        color="secondary"
        size="small"
        disabled={query.isFetching}
        onPress={event => {
          event.stopPropagation()
          if (requested) void query.refetch()
          else setRequested(true)
        }}>
        <ButtonText>
          {query.isFetching ? (
            <Trans>Loading public post…</Trans>
          ) : (
            <Trans>View public post</Trans>
          )}
        </ButtonText>
      </Button>
    </View>
  )
}
