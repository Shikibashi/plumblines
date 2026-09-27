import {act, renderHook} from '@testing-library/react-native'

import {useSession} from '#/state/session'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'
import {account} from '#/storage'

jest.mock('#/env', () => ({IS_WEB: false}))
jest.mock('#/state/session', () => ({useSession: jest.fn()}))
jest.mock('#/storage', () => {
  const values = new Map<string, unknown>()
  const listeners = new Map<string, Set<() => void>>()
  return {
    account: {
      get: jest.fn((key: string[]) => values.get(key.join(':'))),
      set: (key: string[], value: unknown) => {
        const id = key.join(':')
        values.set(id, value)
        listeners.get(id)?.forEach(callback => callback())
      },
      addOnValueChangedListener: (key: string[], callback: () => void) => {
        const id = key.join(':')
        const set = listeners.get(id) ?? new Set()
        listeners.set(id, set)
        set.add(callback)
        return {remove: () => set.delete(callback)}
      },
    },
  }
})
const validate = (value: unknown) => (typeof value === 'number' ? value : 0)
const session = (did: string | undefined) =>
  jest
    .mocked(useSession)
    .mockReturnValue({currentAccount: did ? {did} : undefined} as ReturnType<
      typeof useSession
    >)
test('storage switches immediately between accounts and guest and synchronizes subscribers', () => {
  session('did:plc:a')
  const first = renderHook(() =>
    usePlumblinesStorage('plumblinesReading', validate, 0),
  )
  const second = renderHook(() =>
    usePlumblinesStorage('plumblinesReading', validate, 0),
  )
  act(() => first.result.current[1](42))
  expect(second.result.current[0]).toBe(42)
  session('did:plc:b')
  first.rerender({})
  expect(first.result.current[0]).toBe(0)
  act(() => first.result.current[1](7))
  session(undefined)
  first.rerender({})
  expect(first.result.current[0]).toBe(0)
  session('did:plc:a')
  first.rerender({})
  expect(first.result.current[0]).toBe(42)
})
test('corrupt stored JSON fails to defaults without crashing', () => {
  session('did:plc:corrupt')
  jest.mocked(account.get).mockImplementationOnce(() => {
    throw new SyntaxError('invalid JSON')
  })
  const hook = renderHook(() =>
    usePlumblinesStorage('plumblinesReading', validate, 0),
  )
  expect(hook.result.current[0]).toBe(0)
})
