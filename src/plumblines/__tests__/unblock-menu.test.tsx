import {type PropsWithChildren} from 'react'
import {Text} from 'react-native'
import {setupI18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react-native'

import {castAsShadow} from '#/state/cache/types'
import {
  useProfileMuteMutationQueue,
  useProfileMuteRepostsMutationQueue,
  useProfileUnblockMutationQueue,
} from '#/state/queries/profile'
import * as Menu from '#/components/Menu'
import * as Toast from '#/components/Toast'
import {
  UnblockAccountDialog,
  useUnblockAccountMenuItem,
} from '#/plumblines/components/UnblockAccountMenuItem'
import {type AnyProfileView} from '#/types/bsky/profile'

jest.mock('#/state/queries/profile', () => ({
  useProfileMuteMutationQueue: jest.fn(),
  useProfileMuteRepostsMutationQueue: jest.fn(),
  useProfileUnblockMutationQueue: jest.fn(),
}))
jest.mock('#/components/icons/Person', () => ({
  PersonCheck_Stroke2_Corner0_Rounded: () => null,
}))
jest.mock('#/components/Toast', () => ({show: jest.fn()}))

/* Use the real native Menu.Group: it drops custom component children, so the
 * hook must supply a direct Menu.Item while the dialog survives menu closure. */
jest.mock('#/alf', () => ({
  atoms: {},
  useTheme: () => ({
    atoms: {text_contrast_medium: {color: 'black'}},
    palette: {},
  }),
}))
jest.mock('#/components/Typography', () => {
  const {
    Text: NativeText,
  }: typeof import('react-native') = require('react-native')
  return {Text: NativeText}
})
jest.mock('#/components/Button', () => ({}))
jest.mock('#/components/Dialog', () => ({
  useDialogControl: () => ({close: (callback?: () => void) => callback?.()}),
}))
jest.mock('#/components/Prompt', () => {
  const {
    Pressable,
    Text: NativeText,
    View,
  }: typeof import('react-native') = require('react-native')
  return {
    Basic: ({
      title,
      description,
      onConfirm,
      confirmButtonCta,
    }: {
      title: string
      description: string
      onConfirm: () => void
      confirmButtonCta: string
    }) => (
      <View>
        <NativeText>{title}</NativeText>
        <NativeText>{description}</NativeText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={confirmButtonCta}
          accessibilityHint=""
          onPress={onConfirm}>
          <NativeText>{confirmButtonCta}</NativeText>
        </Pressable>
      </View>
    ),
  }
})

const i18n = setupI18n({locale: 'en', messages: {en: {}}})
const blockUri = 'at://did:plc:viewer/app.bsky.graph.block/existing'
const unblock = jest.fn<Promise<void>, []>()
const mute = jest.fn()
const unmute = jest.fn()
const muteReposts = jest.fn()
const unmuteReposts = jest.fn()

function wrapper({children}: PropsWithChildren) {
  return (
    <I18nProvider i18n={i18n} defaultComponent={Text}>
      {children}
    </I18nProvider>
  )
}

function NativeMenuItem(
  props: Parameters<typeof useUnblockAccountMenuItem>[0],
) {
  const item = useUnblockAccountMenuItem(props)
  return (
    <Menu.Root>
      <Menu.Group>{item}</Menu.Group>
    </Menu.Root>
  )
}

function profile(viewer: AnyProfileView['viewer'] = {}) {
  return castAsShadow<AnyProfileView>({
    did: 'did:plc:subject',
    handle: 'subject.test',
    viewer,
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  unblock.mockResolvedValue(undefined)
  jest.mocked(useProfileUnblockMutationQueue).mockReturnValue(unblock)
  jest.mocked(useProfileMuteMutationQueue).mockReturnValue([mute, unmute])
  jest
    .mocked(useProfileMuteRepostsMutationQueue)
    .mockReturnValue([muteReposts, unmuteReposts])
})

test.each([
  ['unblocked', {}],
  ['blocked by the other account', {blockedBy: true}],
  [
    'blocked through a list only',
    {
      blockingByList: {
        uri: 'at://did:plc:list/app.bsky.graph.list/existing',
        cid: 'list-cid',
        name: 'Existing list',
        purpose: 'app.bsky.graph.defs#modlist',
      },
    },
  ],
] as const)('does not offer unblock for an account %s', (_name, viewer) => {
  render(<NativeMenuItem profile={profile(viewer)} onPress={jest.fn()} />, {
    wrapper,
  })
  expect(screen.queryByLabelText('Unblock account')).toBeNull()
  expect(unblock).not.toHaveBeenCalled()
})

test('existing direct block opens confirmation without changing the account', () => {
  const open = jest.fn()
  render(
    <NativeMenuItem profile={profile({blocking: blockUri})} onPress={open} />,
    {wrapper},
  )
  fireEvent.press(screen.getByLabelText('Unblock account'))
  expect(open).toHaveBeenCalledTimes(1)
  expect(unblock).not.toHaveBeenCalled()
})

test('confirmation removes an existing block without invoking mute or repost actions', async () => {
  render(
    <UnblockAccountDialog
      profile={profile({blocking: blockUri})}
      control={{} as never}
    />,
    {wrapper},
  )
  expect(screen.getByText('Unblock account?')).toBeTruthy()
  expect(unblock).not.toHaveBeenCalled()
  fireEvent.press(screen.getByRole('button', {name: 'Unblock'}))
  await waitFor(() =>
    expect(Toast.show).toHaveBeenCalledWith('Account unblocked'),
  )
  expect(unblock).toHaveBeenCalledTimes(1)
  for (const action of [mute, unmute, muteReposts, unmuteReposts]) {
    expect(action).not.toHaveBeenCalled()
  }
})

test('failed unblock shows error feedback instead of success', async () => {
  unblock.mockRejectedValue(new Error('Service unavailable'))
  render(
    <UnblockAccountDialog
      profile={profile({blocking: blockUri})}
      control={{} as never}
    />,
    {wrapper},
  )
  fireEvent.press(screen.getByRole('button', {name: 'Unblock'}))
  await waitFor(() =>
    expect(Toast.show).toHaveBeenCalledWith(
      'Could not unblock this account. Please try again.',
      {type: 'error'},
    ),
  )
  expect(Toast.show).toHaveBeenCalledTimes(1)
})

test('stale confirmation cannot mutate an account whose direct block is already gone', () => {
  const {rerender} = render(
    <UnblockAccountDialog
      profile={profile({blocking: blockUri})}
      control={{} as never}
    />,
    {wrapper},
  )
  rerender(<UnblockAccountDialog profile={profile()} control={{} as never} />)
  fireEvent.press(screen.getByRole('button', {name: 'Unblock'}))
  expect(unblock).not.toHaveBeenCalled()
  expect(Toast.show).not.toHaveBeenCalled()
})
