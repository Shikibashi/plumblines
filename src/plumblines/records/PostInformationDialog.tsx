import {useState} from 'react'
import {View} from 'react-native'
import {moderatePost} from '@bsky/sdk/moderation'
import {Trans, useLingui} from '@lingui/react/macro'
import {useQuery} from '@tanstack/react-query'

import {useLabelInfo} from '#/lib/moderation/useLabelInfo'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {ContentHider} from '#/components/moderation/ContentHider'
import {Text} from '#/components/Typography'
import {type app, type com} from '#/lexicons'
import {resolveDeclaredPublicPds} from './public-pds'
import {InformationField} from './RecordInspectorDialog'
import {asRecord, formatRecordJson} from './registry'

export type PostInformationDialogProps = {
  control: Dialog.DialogOuterProps['control']
  post: app.bsky.feed.defs.PostView
  record: app.bsky.feed.post.Main
  threadgateRecord?: app.bsky.feed.threadgate.Main
  feedDescriptor?: string
}

export function PostInformationDialog(props: PostInformationDialogProps) {
  return (
    <Dialog.Outer control={props.control}>
      <Dialog.Handle />
      <PostInformation {...props} />
    </Dialog.Outer>
  )
}

function PostInformation({
  post,
  record,
  threadgateRecord,
  feedDescriptor,
}: PostInformationDialogProps) {
  const {t: l} = useLingui()
  const [inspect, setInspect] = useState(false)
  const moderationOpts = useModerationOpts()
  const moderation = moderationOpts
    ? moderatePost(post, moderationOpts)
    : undefined
  // Dialog.Outer mounts this content only when opened.
  const pds = useQuery({
    queryKey: ['plumblines-declared-public-pds', post.author.did],
    queryFn: () => resolveDeclaredPublicPds(post.author.did),
    staleTime: 300000,
    retry: false,
  })
  const suppliedThreadgate = threadgateRecord ?? post.threadgate?.record
  const threadgate = asRecord(suppliedThreadgate)
  let replies: string
  if (post.viewer?.replyDisabled) {
    replies = l`Replies unavailable to this account`
  } else if (suppliedThreadgate === undefined) {
    replies = l`No reply restriction supplied by this service`
  } else if (threadgate?.$type !== 'app.bsky.feed.threadgate') {
    replies = l`Unknown reply restriction`
  } else if (threadgate.allow === undefined) {
    replies = l`Everybody, according to the supplied threadgate`
  } else if (Array.isArray(threadgate.allow) && threadgate.allow.length === 0) {
    replies = l`Nobody`
  } else if (Array.isArray(threadgate.allow)) {
    replies = threadgate.allow
      .map((rule: unknown) => {
        const value = asRecord(rule)
        switch (value?.$type) {
          case 'app.bsky.feed.threadgate#mentionRule':
            return l`Mentioned people`
          case 'app.bsky.feed.threadgate#followingRule':
            return l`People the author follows`
          case 'app.bsky.feed.threadgate#followerRule':
            return l`People following the author`
          case 'app.bsky.feed.threadgate#listRule':
            return typeof value.list === 'string'
              ? l`Members of list: ${value.list}`
              : l`Unknown list rule`
          default:
            return l`Unknown reply restriction`
        }
      })
      .join('\n')
  } else {
    replies = l`Unknown reply restriction`
  }
  const source =
    feedDescriptor === 'following'
      ? l`Following`
      : feedDescriptor?.startsWith('feedgen|')
        ? l`Custom feed: ${feedDescriptor.slice(8)}`
        : feedDescriptor?.startsWith('list|')
          ? l`List: ${feedDescriptor.slice(5)}`
          : feedDescriptor
            ? feedDescriptor
            : l`Not supplied in this view`
  const labels = [...(post.labels ?? []), ...(post.author.labels ?? [])].filter(
    (label, index, all) =>
      all.findIndex(
        other =>
          other.src === label.src &&
          other.uri === label.uri &&
          other.val === label.val,
      ) === index,
  )

  return (
    <Dialog.ScrollableInner label={l`Post information`}>
      <Text style={[a.text_2xl, a.font_bold, a.pb_md]}>
        <Trans>Post information</Trans>
      </Text>
      <InformationField label={l`Author`} value={`@${post.author.handle}`} />
      <InformationField label={l`DID`} value={post.author.did} />
      <InformationField
        label={l`Declared PDS`}
        value={
          pds.isPending
            ? l`Looking up public identity…`
            : pds.isError
              ? l`Public identity unavailable`
              : (pds.data ?? l`No provider declared`)
        }
      />
      <InformationField label={l`Record URI`} value={post.uri} />
      <InformationField label={l`CID`} value={post.cid} />
      <InformationField
        label={l`Published (record time)`}
        value={record.createdAt}
      />
      <InformationField label={l`Indexed by service`} value={post.indexedAt} />
      <InformationField label={l`Seen through`} value={source} />
      <Text style={[a.text_sm, a.pb_md]}>
        <Trans>
          The source returned this post. Its internal ranking and complete
          filtering history are not available here.
        </Trans>
      </Text>
      <InformationField label={l`Replies`} value={replies} />
      <InformationField
        label={l`Quotes`}
        value={
          post.viewer?.embeddingDisabled === true
            ? l`Not permitted for this account`
            : post.viewer?.embeddingDisabled === false
              ? l`No restriction reported for this account`
              : l`Permission not supplied by this service`
        }
      />
      <Text style={[a.font_bold, a.pb_sm]}>
        <Trans>Labels and sources</Trans>
      </Text>
      {labels.length ? (
        labels.map(label => (
          <LabelInformation
            key={`${label.src}:${label.uri}:${label.val}`}
            label={label}
          />
        ))
      ) : (
        <Text style={[a.text_sm, a.pb_md]}>
          <Trans>No labels supplied by this service.</Trans>
        </Text>
      )}
      <Button
        label={inspect ? l`Hide record JSON` : l`Inspect record`}
        onPress={() => setInspect(!inspect)}
        size="small"
        variant="solid"
        color="secondary">
        <ButtonText>
          {inspect ? (
            <Trans>Hide record JSON</Trans>
          ) : (
            <Trans>Inspect record</Trans>
          )}
        </ButtonText>
      </Button>
      {inspect && moderation && (
        <ContentHider modui={moderation.ui('contentList')}>
          <View style={[a.pt_md]}>
            <Text selectable style={[a.text_sm, a.leading_snug]}>
              {formatRecordJson(record)}
            </Text>
          </View>
        </ContentHider>
      )}
      <Dialog.Close />
    </Dialog.ScrollableInner>
  )
}

function LabelInformation({label}: {label: com.atproto.label.defs.Label}) {
  const {t: l} = useLingui()
  const {strings} = useLabelInfo(label)
  return (
    <View style={[a.pb_md]}>
      <InformationField label={strings.name} value={label.val} />
      <InformationField label={l`Source DID`} value={label.src} />
      <InformationField label={l`Applies to`} value={label.uri} />
    </View>
  )
}
