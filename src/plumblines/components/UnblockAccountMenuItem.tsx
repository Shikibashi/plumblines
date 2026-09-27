import {Trans, useLingui} from '@lingui/react/macro'

import {type Shadow} from '#/state/cache/types'
import {PersonCheck_Stroke2_Corner0_Rounded as PersonCheck} from '#/components/icons/Person'
import * as Menu from '#/components/Menu'
import * as Prompt from '#/components/Prompt'
import * as Toast from '#/components/Toast'
import {useAccountActions} from '#/plumblines/account-actions'
import {type AnyProfileView} from '#/types/bsky/profile'

type Profile = Shadow<AnyProfileView>

/** Return a direct Menu.Item: native Menu.Group filters out wrapper components. */
export function useUnblockAccountMenuItem({
  profile,
  onPress,
  testID,
}: {
  profile: Profile
  onPress: () => void
  testID?: string
}) {
  const {t: l} = useLingui()
  if (!profile.viewer?.blocking) return null
  return (
    <Menu.Item testID={testID} label={l`Unblock account`} onPress={onPress}>
      <Menu.ItemText>
        <Trans>Unblock account</Trans>
      </Menu.ItemText>
      <Menu.ItemIcon icon={PersonCheck} />
    </Menu.Item>
  )
}

/** Render outside Menu.Outer so closing the menu cannot unmount its dialog. */
export function UnblockAccountDialog({
  profile,
  control,
}: {
  profile: Profile
  control: Prompt.PromptControlProps
}) {
  const {t: l} = useLingui()
  const {unblock} = useAccountActions(profile)
  const onConfirm = async () => {
    if (!unblock) return
    try {
      await unblock()
      Toast.show(l({message: 'Account unblocked', context: 'toast'}))
    } catch {
      Toast.show(l`Could not unblock this account. Please try again.`, {
        type: 'error',
      })
    }
  }
  return (
    <Prompt.Basic
      control={control}
      title={l`Unblock account?`}
      description={l`The account will be able to interact with you after unblocking.`}
      onConfirm={() => void onConfirm()}
      confirmButtonCta={l`Unblock`}
    />
  )
}
