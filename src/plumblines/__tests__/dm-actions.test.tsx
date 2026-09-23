import {type PropsWithChildren} from 'react'
import {Text} from 'react-native'
import {setupI18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {fireEvent, render, screen} from '@testing-library/react-native'

import {useLeaveConvo} from '#/state/queries/messages/leave-conversation'
import {useMuteConvo} from '#/state/queries/messages/mute-conversation'
import {RejectMenu} from '#/screens/Messages/components/RequestButtons'
import {type ConvoWithDetails} from '#/components/dms/util'
import * as Toast from '#/components/Toast'

jest.mock('@react-navigation/native', () => ({useNavigation: () => ({})}))
jest.mock('#/state/session', () => ({
  useSession: () => ({currentAccount: {did: 'did:plc:viewer'}}),
}))
jest.mock('#/state/email-verification', () => ({}))
jest.mock('#/state/queries/messages/accept-conversation', () => ({}))
jest.mock('#/state/queries/messages/conversation', () => ({}))
jest.mock('#/state/queries/messages/leave-conversation', () => ({
  useLeaveConvo: jest.fn(),
}))
jest.mock('#/state/queries/messages/mute-conversation', () => ({
  useMuteConvo: jest.fn(),
}))
jest.mock('#/components/Button', () => ({}))
jest.mock('#/components/Loader', () => ({}))
jest.mock('#/components/dialogs/EmailDialog', () => ({}))
jest.mock('#/components/dms/AfterReportConversationDialog', () => ({
  AfterReportConversationDialog: () => null,
}))
jest.mock('#/components/dms/AfterReportDialog', () => ({
  AfterReportDialog: () => null,
}))
jest.mock('#/components/dms/util', () => ({getConvoReportSubject: () => null}))
jest.mock('#/components/moderation/ReportDialog', () => ({}))
jest.mock('#/components/Toast', () => ({show: jest.fn()}))

const mockReportOpen = jest.fn()
jest.mock('#/components/Dialog', () => ({
  useDialogControl: () => ({open: mockReportOpen}),
}))

/* Test request actions independently of native sheet animation and its trigger. */
jest.mock('#/components/Menu', () => {
  const {
    Pressable,
    Text: NativeText,
  }: typeof import('react-native') = require('react-native')
  const Container = ({children}: PropsWithChildren) => children
  return {
    Root: Container,
    Trigger: () => null,
    Outer: Container,
    Group: Container,
    Item: ({
      children,
      label,
      onPress,
    }: PropsWithChildren<{
      label: string
      onPress: () => void
    }>) => (
      <Pressable
        accessibilityLabel={label}
        accessibilityHint=""
        onPress={onPress}>
        {children}
      </Pressable>
    ),
    ItemText: NativeText,
    ItemIcon: () => null,
  }
})
jest.mock('#/components/icons/ArrowBoxLeft', () => ({}))
jest.mock('#/components/icons/Check', () => ({}))
jest.mock('#/components/icons/CircleX', () => ({}))
jest.mock('#/components/icons/Flag', () => ({}))
jest.mock('#/components/icons/Mute', () => ({}))
jest.mock('#/components/icons/Speaker', () => ({}))

const i18n = setupI18n({locale: 'en', messages: {en: {}}})
const leave = jest.fn()
const mute = jest.fn()
const profile = {did: 'did:plc:sender', handle: 'sender.test'} as const

function setup(muted = false) {
  const convo = {
    kind: 'direct',
    view: {id: 'incoming-request', muted},
  } as unknown as ConvoWithDetails
  render(
    <I18nProvider i18n={i18n} defaultComponent={Text}>
      <RejectMenu
        convo={convo}
        profile={profile}
        currentScreen="list"
        showDeleteConvo
      />
    </I18nProvider>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useLeaveConvo).mockReturnValue({mutate: leave} as never)
  jest.mocked(useMuteConvo).mockReturnValue({mutate: mute} as never)
})

test.each([
  [false, 'Mute conversation', true],
  [true, 'Unmute conversation', false],
])(
  'request with muted=%s offers an independent %s action',
  (muted, label, next) => {
    setup(muted)
    expect(screen.getByLabelText('Delete conversation')).toBeTruthy()
    expect(screen.getByLabelText('Report conversation')).toBeTruthy()
    expect(screen.queryByText(/block/i)).toBeNull()
    fireEvent.press(screen.getByLabelText(label))
    expect(mute).toHaveBeenCalledWith({mute: next})
    expect(leave).not.toHaveBeenCalled()
    expect(mockReportOpen).not.toHaveBeenCalled()
    expect(Toast.show).not.toHaveBeenCalled()
  },
)

test('deleting a request does not mute or report it', () => {
  setup()
  fireEvent.press(screen.getByLabelText('Delete conversation'))
  expect(leave).toHaveBeenCalledTimes(1)
  expect(mute).not.toHaveBeenCalled()
  expect(mockReportOpen).not.toHaveBeenCalled()
})

test('reporting a request does not delete or mute it', () => {
  setup()
  fireEvent.press(screen.getByLabelText('Report conversation'))
  expect(mockReportOpen).toHaveBeenCalledTimes(1)
  expect(leave).not.toHaveBeenCalled()
  expect(mute).not.toHaveBeenCalled()
})

test('mute success and failure use service outcome feedback', () => {
  setup()
  const callbacks = jest.mocked(useMuteConvo).mock.calls[0][1]
  callbacks.onSuccess?.({convo: {muted: true}} as never)
  expect(Toast.show).toHaveBeenLastCalledWith('Chat muted')
  callbacks.onSuccess?.({convo: {muted: false}} as never)
  expect(Toast.show).toHaveBeenLastCalledWith('Chat unmuted')
  callbacks.onError?.(new Error('Service unavailable'))
  expect(Toast.show).toHaveBeenLastCalledWith('Could not mute chat', {
    type: 'error',
  })
  expect(leave).not.toHaveBeenCalled()
})
