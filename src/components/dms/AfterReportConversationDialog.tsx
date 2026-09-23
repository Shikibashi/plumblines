import {memo, useState} from 'react'
import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'
import {StackActions, useNavigation} from '@react-navigation/native'

import {type NavigationProp} from '#/lib/routes/types'
import {useLeaveConvo} from '#/state/queries/messages/leave-conversation'
import {atoms as a, useBreakpoints, useTheme, web} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as Toggle from '#/components/forms/Toggle'
import * as Toast from '#/components/Toast'
import {Text} from '#/components/Typography'
import {IS_NATIVE} from '#/env'

type ReportDialogParams = {
  convoId: string
  did: string
}

/**
 * Dialog shown after a report is submitted, allowing the user to leave the
 * conversation.
 */
export const AfterReportConversationDialog = memo(
  function AfterReportConversationDialogInner({
    control,
    params,
    currentScreen,
  }: {
    control: Dialog.DialogControlProps
    params: ReportDialogParams
    currentScreen: 'list' | 'conversation'
  }): React.ReactNode {
    const {t: l} = useLingui()
    return (
      <Dialog.Outer control={control} nativeOptions={{preventExpansion: true}}>
        <Dialog.Handle />
        <Dialog.ScrollableInner
          label={l`Would you like to leave this conversation?`}
          style={[web({maxWidth: 400})]}>
          <DoneStep convoId={params.convoId} currentScreen={currentScreen} />
          <Dialog.Close />
        </Dialog.ScrollableInner>
      </Dialog.Outer>
    )
  },
)

function DoneStep({
  convoId,
  currentScreen,
}: {
  convoId: string
  currentScreen: 'list' | 'conversation'
}) {
  const {t: l} = useLingui()
  const navigation = useNavigation<NavigationProp>()
  const control = Dialog.useDialogContext()
  const {gtMobile} = useBreakpoints()
  const t = useTheme()
  const [actions, setActions] = useState<string[]>([])

  const {mutate: leaveConvo} = useLeaveConvo(convoId, {
    onMutate: () => {
      if (currentScreen === 'conversation') {
        navigation.dispatch(
          StackActions.replace('Messages', IS_NATIVE ? {animation: 'pop'} : {}),
        )
      }
    },
    onError: () => {
      Toast.show(l`Could not leave chat`, {
        type: 'error',
      })
    },
  })

  let btnText = l`Done`
  let toastMsg: string | undefined
  if (actions.includes('leave')) {
    btnText = l`Leave conversation`
    toastMsg = l({message: 'Conversation left', context: 'toast'})
  }

  const onPressPrimaryAction = () => {
    control.close(() => {
      if (actions.includes('leave')) {
        leaveConvo()
      }
      if (toastMsg) {
        Toast.show(toastMsg, {
          type: 'success',
        })
      }
    })
  }

  return (
    <View style={a.gap_2xl}>
      <View style={[a.justify_center, gtMobile ? a.gap_sm : a.gap_xs]}>
        <Text style={[a.text_2xl, a.font_semi_bold]}>
          <Trans>Report submitted</Trans>
        </Text>
        <Text style={[a.text_md, t.atoms.text_contrast_medium]}>
          <Trans>Our moderation team has received your report.</Trans>
        </Text>
      </View>
      <Toggle.Group
        label={l`Leave this conversation`}
        values={actions}
        onChange={setActions}>
        <View style={[a.gap_md]}>
          <Toggle.Item name="leave" label={l`Leave conversation`}>
            <Toggle.Checkbox />
            <Toggle.LabelText style={[a.text_md]}>
              <Trans>Leave conversation</Trans>
            </Toggle.LabelText>
          </Toggle.Item>
        </View>
      </Toggle.Group>
      <View style={[a.gap_sm]}>
        <Button
          label={btnText}
          onPress={onPressPrimaryAction}
          size="large"
          color={actions.length > 0 ? 'negative' : 'primary'}>
          <ButtonText>{btnText}</ButtonText>
        </Button>
        <Button
          label={l`Close`}
          onPress={() => control.close()}
          size="large"
          color="secondary">
          <ButtonText>
            <Trans>Close</Trans>
          </ButtonText>
        </Button>
      </View>
    </View>
  )
}
