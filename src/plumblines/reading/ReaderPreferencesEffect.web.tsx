import {useEffect} from 'react'

import {usePlumblinesStorage} from '#/plumblines/local-preferences'
import {DEFAULT_READING, validateReadingPreferences} from './model'

export function ReaderPreferencesEffect() {
  const [preferences] = usePlumblinesStorage(
    'plumblinesReading',
    validateReadingPreferences,
    DEFAULT_READING,
  )
  useEffect(() => {
    document.documentElement.classList.toggle(
      'plumblines-reader',
      preferences.reader,
    )
    return () => document.documentElement.classList.remove('plumblines-reader')
  }, [preferences.reader])
  return null
}
