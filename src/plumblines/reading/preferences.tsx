import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {IS_WEB} from '#/env'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'
import {DEFAULT_READING, validateReadingPreferences} from './model'

export {ReaderPreferencesEffect} from './ReaderPreferencesEffect'

export function useReadingPreferences() {
  return usePlumblinesStorage(
    'plumblinesReading',
    validateReadingPreferences,
    DEFAULT_READING,
  )
}

export function ReaderControls({
  includeArticle = false,
}: {
  includeArticle?: boolean
}) {
  const {t: l} = useLingui()
  const [preferences, setPreferences] = useReadingPreferences()
  if (!IS_WEB) return null
  return (
    <View style={[a.flex_row, a.flex_wrap, a.gap_sm]}>
      <Button
        testID="plumblines-reader-toggle"
        label={l`Reader mode`}
        accessibilityRole="switch"
        accessibilityState={{checked: preferences.reader}}
        size="small"
        color={preferences.reader ? 'primary' : 'secondary'}
        onPress={() =>
          setPreferences({...preferences, reader: !preferences.reader})
        }>
        <ButtonText>
          <Trans>Reader mode</Trans>
        </ButtonText>
      </Button>
      {includeArticle && (
        <Button
          testID="plumblines-article-toggle"
          label={l`Article mode`}
          accessibilityRole="switch"
          accessibilityState={{checked: preferences.article}}
          size="small"
          color={preferences.article ? 'primary' : 'secondary'}
          onPress={() =>
            setPreferences({...preferences, article: !preferences.article})
          }>
          <ButtonText>
            <Trans>Article mode</Trans>
          </ButtonText>
        </Button>
      )}
    </View>
  )
}
