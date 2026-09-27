import {View} from 'react-native'
import {moderatePost, type ModerationDecision} from '@bsky/sdk/moderation'
import {Trans, useLingui} from '@lingui/react/macro'

import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {ContentHider} from '#/components/moderation/ContentHider'
import {Text} from '#/components/Typography'
import {app} from '#/lexicons'
import * as bsky from '#/types/bsky'
import {RecordInspectorDialog} from './RecordInspectorDialog'
import {getRecordInfo} from './registry'

/** Fallback for supplied custom records; never resolves or publishes records. */
export function GenericRecordEmbed({
  supplied,
  moderation,
}: {
  supplied: unknown
  moderation?: ModerationDecision
}) {
  const {t: l} = useLingui()
  const t = useTheme()
  const opts = useModerationOpts()
  const control = Dialog.useDialogControl()
  const info = getRecordInfo(supplied)
  if (supplied === null || supplied === undefined || !opts) return null
  // A custom record in a known wrapper still carries author/content labels.
  const ownModeration =
    opts && bsky.matches(app.bsky.embed.record.viewRecord, supplied)
      ? moderatePost(
          {
            ...supplied,
            $type: 'app.bsky.feed.defs#postView',
            record: supplied.value,
          },
          opts,
        )
      : undefined
  return (
    <ContentHider modui={moderation?.ui('contentList')}>
      <ContentHider modui={ownModeration?.ui('contentList')}>
        <View
          style={[
            a.mt_sm,
            a.border,
            t.atoms.border_contrast_low,
            a.p_md,
            a.gap_sm,
          ]}>
          <Text style={[a.font_bold, a.text_sm]}>
            <Trans>AT Protocol record</Trans>
          </Text>
          <Text selectable style={[a.text_sm]}>
            {info.type ?? l`Unknown record type`}
          </Text>
          {info.did && (
            <Text selectable style={[a.text_sm]}>
              {info.did}
            </Text>
          )}
          <Button
            label={l`Inspect record`}
            size="small"
            variant="solid"
            color="secondary"
            onPress={event => {
              event.stopPropagation()
              control.open()
            }}>
            <ButtonText>
              <Trans>Inspect record</Trans>
            </ButtonText>
          </Button>
          <RecordInspectorDialog control={control} supplied={supplied} />
        </View>
      </ContentHider>
    </ContentHider>
  )
}
