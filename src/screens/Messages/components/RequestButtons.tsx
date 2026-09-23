import {useCallback} from 'react'
import {Trans, useLingui} from '@lingui/react/macro'
import {StackActions, useNavigation} from '@react-navigation/native'
import {useQueryClient} from '@tanstack/react-query'

import {type NavigationProp} from '#/lib/routes/types'
import {useEmail} from '#/state/email-verification'
import {useAcceptConversation} from '#/state/queries/messages/accept-conversation'
import {precacheConvoQuery} from '#/state/queries/messages/conversation'
import {useLeaveConvo} from '#/state/queries/messages/leave-conversation'
import {useMuteConvo} from '#/state/queries/messages/mute-conversation'
import {useSession} from '#/state/session'
import {
  Button,
  ButtonIcon,
  type ButtonProps,
  ButtonText,
} from '#/components/Button'
import {useDialogControl} from '#/components/Dialog'
import {
  EmailDialogScreenID,
  useEmailDialogControl,
} from '#/components/dialogs/EmailDialog'
import {AfterReportConversationDialog} from '#/components/dms/AfterReportConversationDialog'
import {AfterReportDialog} from '#/components/dms/AfterReportDialog'
import {
  type ConvoWithDetails,
  getConvoReportSubject,
} from '#/components/dms/util'
import {ArrowBoxLeft_Stroke2_Corner0_Rounded as LeaveIcon} from '#/components/icons/ArrowBoxLeft'
import {Check_Stroke2_Corner0_Rounded as CheckIcon} from '#/components/icons/Check'
import {CircleX_Stroke2_Corner0_Rounded} from '#/components/icons/CircleX'
import {Flag_Stroke2_Corner0_Rounded as FlagIcon} from '#/components/icons/Flag'
import {Mute_Stroke2_Corner0_Rounded as MuteIcon} from '#/components/icons/Mute'
import {SpeakerVolumeFull_Stroke2_Corner0_Rounded as UnmuteIcon} from '#/components/icons/Speaker'
import {Loader} from '#/components/Loader'
import * as Menu from '#/components/Menu'
import {ReportDialog} from '#/components/moderation/ReportDialog'
import * as Toast from '#/components/Toast'
import {type chat} from '#/lexicons'

export function RejectMenu({
  convo,
  profile,
  size = 'small',
  color = 'secondary',
  label,
  icon = false,
  showDeleteConvo,
  currentScreen,
  ...props
}: Omit<ButtonProps, 'onPress' | 'children' | 'label'> & {
  label?: string
  icon?: boolean
  convo: ConvoWithDetails
  profile: chat.bsky.actor.defs.ProfileViewBasic
  showDeleteConvo?: boolean
  currentScreen: 'list' | 'conversation'
}) {
  const {t: l} = useLingui()
  const {currentAccount} = useSession()
  const navigation = useNavigation<NavigationProp>()

  const {mutate: leaveConvo} = useLeaveConvo(convo.view.id, {
    onMutate: () => {
      if (currentScreen === 'conversation') {
        navigation.dispatch(StackActions.pop())
      }
    },
    onError: () => {
      Toast.show(
        l({
          context: 'toast',
          message: 'Failed to delete chat',
        }),
        {
          type: 'error',
        },
      )
    },
  })

  const {mutate: muteConvo} = useMuteConvo(convo.view.id, {
    onSuccess: data => {
      Toast.show(
        data.convo.muted
          ? l({message: 'Chat muted', context: 'toast'})
          : l({message: 'Chat unmuted', context: 'toast'}),
      )
    },
    onError: () => {
      Toast.show(l`Could not mute chat`, {type: 'error'})
    },
  })

  const onPressDelete = useCallback(() => {
    Toast.show(
      l({
        context: 'toast',
        message: 'Chat deleted',
      }),
      {
        type: 'success',
      },
    )
    leaveConvo()
  }, [leaveConvo, l])

  const reportControl = useDialogControl()
  const afterReportControl = useDialogControl()

  const reportSubject = getConvoReportSubject(convo, currentAccount?.did)

  return (
    <>
      <Menu.Root>
        <Menu.Trigger label={l`Reject chat request`}>
          {({props: triggerProps}) => (
            <Button
              {...triggerProps}
              {...props}
              label={triggerProps.accessibilityLabel}
              color={color}
              size={size}>
              {icon ? <ButtonIcon icon={FlagIcon} /> : null}
              <ButtonText>
                {label || (
                  <Trans comment="Reject a chat request, this opens a menu with options">
                    Reject
                  </Trans>
                )}
              </ButtonText>
            </Button>
          )}
        </Menu.Trigger>
        <Menu.Outer showCancel>
          <Menu.Group>
            {showDeleteConvo && (
              <Menu.Item label={l`Delete conversation`} onPress={onPressDelete}>
                <Menu.ItemText>
                  <Trans>Delete conversation</Trans>
                </Menu.ItemText>
                <Menu.ItemIcon icon={CircleX_Stroke2_Corner0_Rounded} />
              </Menu.Item>
            )}
            <Menu.Item
              label={
                convo.view.muted ? l`Unmute conversation` : l`Mute conversation`
              }
              onPress={() => muteConvo({mute: !convo.view.muted})}>
              <Menu.ItemText>
                {convo.view.muted ? (
                  <Trans>Unmute conversation</Trans>
                ) : (
                  <Trans>Mute conversation</Trans>
                )}
              </Menu.ItemText>
              <Menu.ItemIcon icon={convo.view.muted ? UnmuteIcon : MuteIcon} />
            </Menu.Item>
            <Menu.Item
              label={l`Report conversation`}
              onPress={reportControl.open}>
              <Menu.ItemText>
                <Trans>Report conversation</Trans>
              </Menu.ItemText>
              <Menu.ItemIcon icon={FlagIcon} />
            </Menu.Item>
          </Menu.Group>
        </Menu.Outer>
      </Menu.Root>

      {reportSubject && (
        <ReportDialog
          subject={reportSubject}
          control={reportControl}
          onAfterSubmit={() => {
            afterReportControl.open()
          }}
        />
      )}
      {convo.kind === 'group' ? (
        <AfterReportConversationDialog
          control={afterReportControl}
          currentScreen={currentScreen}
          params={{
            convoId: convo.view.id,
            did: profile.did,
          }}
        />
      ) : (
        <AfterReportDialog
          control={afterReportControl}
          currentScreen={currentScreen}
          params={{
            convoId: convo.view.id,
            did: profile.did,
          }}
        />
      )}
    </>
  )
}

export function AcceptChatButton({
  convo,
  size = 'small',
  color = 'primary',
  label,
  icon = false,
  currentScreen,
  onAcceptConvo,
  ...props
}: Omit<ButtonProps, 'onPress' | 'children' | 'label'> & {
  label?: string
  icon?: boolean
  convo: chat.bsky.convo.defs.ConvoView
  onAcceptConvo?: () => void
  currentScreen: 'list' | 'conversation'
}) {
  const {t: l} = useLingui()
  const queryClient = useQueryClient()
  const navigation = useNavigation<NavigationProp>()
  const {needsEmailVerification} = useEmail()
  const emailDialogControl = useEmailDialogControl()

  const {mutate: acceptConvo, isPending} = useAcceptConversation(convo.id, {
    onMutate: () => {
      onAcceptConvo?.()
      if (currentScreen === 'list') {
        precacheConvoQuery(queryClient, {...convo, status: 'accepted'})
        navigation.navigate('MessagesConversation', {
          conversation: convo.id,
          accept: true,
        })
      }
    },
    onError: () => {
      // Should we show a toast here? They'll be on the convo screen, and it'll make
      // no difference if the request failed - when they send a message, the convo will be accepted
      // automatically. The only difference is that when they back out of the convo (without sending a message), the conversation will be rejected.
      // the list will still have this chat in it -sfn
      Toast.show(
        l({
          context: 'toast',
          message: 'Failed to accept chat',
        }),
        {
          type: 'error',
        },
      )
    },
  })

  const onPressAccept = useCallback(() => {
    if (needsEmailVerification) {
      emailDialogControl.open({
        id: EmailDialogScreenID.Verify,
        instructions: [
          <Trans key="request-btn">
            Before you can accept this chat request, you must first verify your
            email.
          </Trans>,
        ],
      })
    } else {
      acceptConvo()
    }
  }, [acceptConvo, needsEmailVerification, emailDialogControl])

  let Icon: React.ReactNode = null
  if (isPending) {
    Icon = <ButtonIcon icon={Loader} />
  } else if (icon) {
    Icon = <ButtonIcon icon={CheckIcon} />
  }

  return (
    <Button
      {...props}
      label={label || l`Accept chat request`}
      size={size}
      color={color}
      onPress={onPressAccept}>
      {Icon}
      <ButtonText>
        {label || <Trans comment="Accept a chat request">Accept</Trans>}
      </ButtonText>
    </Button>
  )
}

export function DeleteChatButton({
  convo,
  size = 'small',
  color = 'secondary',
  label,
  icon = false,
  currentScreen,
  ...props
}: Omit<ButtonProps, 'children' | 'label'> & {
  label?: string
  icon?: boolean
  convo: chat.bsky.convo.defs.ConvoView
  currentScreen: 'list' | 'conversation'
}) {
  const {t: l} = useLingui()
  const navigation = useNavigation<NavigationProp>()

  const {mutate: leaveConvo} = useLeaveConvo(convo.id, {
    onMutate: () => {
      if (currentScreen === 'conversation') {
        navigation.dispatch(StackActions.pop())
      }
    },
    onError: () => {
      Toast.show(
        l({
          context: 'toast',
          message: 'Failed to delete chat',
        }),
        {
          type: 'error',
        },
      )
    },
  })

  const onPressDelete = useCallback(() => {
    Toast.show(
      l({
        context: 'toast',
        message: 'Chat deleted',
      }),
      {
        type: 'success',
      },
    )
    leaveConvo()
  }, [leaveConvo, l])

  return (
    <Button
      label={label || l`Delete chat`}
      size={size}
      color={color}
      onPress={onPressDelete}
      {...props}>
      {icon ? <ButtonIcon icon={LeaveIcon} /> : null}
      <ButtonText>{label || <Trans>Delete chat</Trans>}</ButtonText>
    </Button>
  )
}
