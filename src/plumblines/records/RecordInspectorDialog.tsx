import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {atoms as a, useTheme} from '#/alf'
import * as Dialog from '#/components/Dialog'
import {Text} from '#/components/Typography'
import {formatRecordJson, getRecordInfo} from './registry'

export function InformationField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const t = useTheme()
  return (
    <View style={[a.gap_xs, a.pb_sm]}>
      <Text style={[a.font_bold, a.text_sm]}>{label}</Text>
      <Text selectable style={[a.text_sm, a.leading_snug, t.atoms.text]}>
        {value}
      </Text>
    </View>
  )
}

export function RecordInspectorDialog({
  control,
  supplied,
}: {
  control: Dialog.DialogOuterProps['control']
  supplied: unknown
}) {
  const {t: l} = useLingui()
  const info = getRecordInfo(supplied)
  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={l`AT Protocol record`}>
        <Text style={[a.text_2xl, a.font_bold, a.pb_md]}>
          <Trans>AT Protocol record</Trans>
        </Text>
        <Text style={[a.text_sm, a.pb_md]}>
          <Trans>
            Supplied by the current service. This is a bounded inspection of the
            returned data; it does not fetch another record.
          </Trans>
        </Text>
        <InformationField
          label={l`Type`}
          value={info.type ?? l`Not supplied`}
        />
        {info.did && (
          <InformationField label={l`Author DID`} value={info.did} />
        )}
        {info.uri && (
          <InformationField label={l`Record URI`} value={info.uri} />
        )}
        {info.cid && <InformationField label={l`CID`} value={info.cid} />}
        <Text selectable style={[a.text_sm, a.leading_snug]}>
          {formatRecordJson(supplied)}
        </Text>
        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}
