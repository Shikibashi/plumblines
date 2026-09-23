import {useCallback} from 'react'
import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'
import {useFocusEffect} from '@react-navigation/native'

import {useSetTitle} from '#/lib/hooks/useSetTitle'
import {useSession} from '#/state/session'
import {useLoggedOutViewControls} from '#/state/shell/logged-out'
import {atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {useDialogControl} from '#/components/Dialog'
import * as Layout from '#/components/Layout'
import {IS_WEB} from '#/env'
import {LocalAttentionDialog} from '#/plumblines/local-attention'
import {ReaderControls} from '#/plumblines/reading/preferences'
import {NewspaperSections} from '#/plumblines/sections'

export function NewspaperHome() {
  const {t: l} = useLingui()
  const attention = useDialogControl()
  const {hasSession} = useSession()
  const {requestSwitchToAccount} = useLoggedOutViewControls()
  useSetTitle(l`The front page`)
  useFocusEffect(
    useCallback(() => {
      if (!IS_WEB) return
      document.body.dataset.plumblinesFrontPage = 'true'
      return () => {
        delete document.body.dataset.plumblinesFrontPage
      }
    }, []),
  )
  return (
    <Layout.Screen testID="HomeScreen" fullWidth>
      <View testID="plumblines-front-page">
        <View
          accessibilityRole="toolbar"
          accessibilityLabel={l`Reading tools`}
          accessibilityHint={l`Reader display controls and local attention settings`}
          style={[a.flex_row, a.flex_wrap, a.gap_sm, a.p_lg]}
          testID="plumblines-utility-bar">
          <ReaderControls />
          {!hasSession && (
            <>
              <Button
                testID="plumblines-sign-in"
                label={l`Sign in`}
                size="small"
                color="secondary"
                onPress={() =>
                  requestSwitchToAccount({requestedAccount: 'none'})
                }>
                <ButtonText>
                  <Trans>Sign in</Trans>
                </ButtonText>
              </Button>
              <Button
                testID="plumblines-create-account"
                label={l`Create account`}
                size="small"
                color="primary"
                onPress={() =>
                  requestSwitchToAccount({requestedAccount: 'new'})
                }>
                <ButtonText>
                  <Trans>Create account</Trans>
                </ButtonText>
              </Button>
            </>
          )}
          <Button
            label={l`Local attention`}
            size="small"
            color="secondary"
            onPress={attention.open}>
            <ButtonText>
              <Trans>Local attention</Trans>
            </ButtonText>
          </Button>
        </View>
        <NewspaperSections />
      </View>
      <LocalAttentionDialog control={attention} />
    </Layout.Screen>
  )
}
