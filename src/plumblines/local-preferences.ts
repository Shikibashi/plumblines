import {useCallback, useMemo, useSyncExternalStore} from 'react'

import {useSession} from '#/state/session'
import {IS_WEB} from '#/env'
import {account} from '#/storage'

type Key =
  | 'plumblinesSections'
  | 'plumblinesAttention'
  | 'plumblinesReading'
  | 'plumblinesFrontPage'

/** Local-only account-scoped preferences, with stable snapshots and cross-tab updates. */
export function usePlumblinesStorage<T>(
  key: Key,
  validate: (value: unknown) => T,
  fallback: T,
): [T, (value: T) => void] {
  const {currentAccount} = useSession()
  const did = currentAccount?.did ?? 'guest'
  const read = useCallback(() => {
    try {
      return JSON.stringify(account.get([did, key])) ?? ''
    } catch {
      return ''
    }
  }, [did, key])
  const subscribe = useCallback(
    (notify: () => void) => {
      const subscription = account.addOnValueChangedListener([did, key], notify)
      if (IS_WEB) window.addEventListener('storage', notify)
      return () => {
        subscription.remove()
        if (IS_WEB) window.removeEventListener('storage', notify)
      }
    },
    [did, key],
  )
  const raw = useSyncExternalStore(subscribe, read, () => '')
  const value = useMemo(() => {
    if (!raw) return fallback
    try {
      return validate(JSON.parse(raw))
    } catch {
      return fallback
    }
  }, [raw, validate, fallback])
  const write = useCallback(
    (next: T) => {
      account.set([did, key], validate(next))
    },
    [did, key, validate],
  )
  return [value, write]
}
