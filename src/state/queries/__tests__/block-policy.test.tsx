import {type PropsWithChildren} from 'react'
import {
  muteActor,
  muteActorList,
  unblockActorList,
  unmuteActor,
} from '@bsky/sdk'
import {
  notifyManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {act, renderHook} from '@testing-library/react-native'

import {until} from '#/lib/async/until'
import {updateProfileShadow} from '#/state/cache/profile-shadow'
import {useAppviewClient, usePdsClient, useSession} from '#/state/session'
import {app} from '#/lexicons'
import {useAccountActions} from '#/plumblines/account-actions'
import {useListMuteMutation, useListUnblockMutation} from '../list'
import {resetProfilePostsQueries} from '../post-feed'
import {useProfileUnblockMutationQueue} from '../profile'

jest.mock('#/lib/async/until', () => ({until: jest.fn()}))
jest.mock('#/lib/api', () => ({uploadBlob: jest.fn()}))
jest.mock('../feed', () => ({FEED_INFO_RQKEY_ROOT: 'feed-info'}))
jest.mock('../my-lists', () => ({invalidate: jest.fn()}))
jest.mock('../profile-lists', () => ({RQKEY: jest.fn()}))
jest.mock('../post-feed', () => ({resetProfilePostsQueries: jest.fn()}))
jest.mock('../verification/useUpdateProfileVerificationCache', () => ({
  useUpdateProfileVerificationCache: jest.fn(),
}))
jest.mock('../messages/list-conversations', () => ({RQKEY_ROOT: 'convos'}))
jest.mock('#/state/cache/profile-shadow', () => ({
  updateProfileShadow: jest.fn(),
}))
jest.mock('#/state/userActionHistory', () => ({}))
jest.mock('#/state/shell/progress-guide', () => ({}))
jest.mock('#/analytics', () => ({useAnalytics: () => ({metric: jest.fn()})}))
jest.mock('#/state/session', () => ({
  useAppviewClient: jest.fn(),
  usePdsClient: jest.fn(),
  useSession: jest.fn(),
}))

const did = 'did:plc:subject'
const blockUri = 'at://did:plc:viewer/app.bsky.graph.block/existing'
const listUri = 'at://did:plc:creator/app.bsky.graph.list/list'

function setup(blocking?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {retry: false, gcTime: Infinity},
      mutations: {retry: false, gcTime: Infinity},
    },
  })
  const pdsClient = {create: jest.fn(), delete: jest.fn(), call: jest.fn()}
  const appviewClient = {call: jest.fn()}
  jest.mocked(usePdsClient).mockReturnValue(pdsClient as never)
  jest.mocked(useAppviewClient).mockReturnValue(appviewClient as never)
  jest
    .mocked(useSession)
    .mockReturnValue({currentAccount: {did: 'did:plc:viewer'}} as never)
  const wrapper = ({children}: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const hook = renderHook(
    () => ({
      profile: useProfileUnblockMutationQueue({
        did,
        handle: 'subject.test',
        viewer: {blocking},
      } as never),
      actions: useAccountActions({
        did,
        handle: 'subject.test',
        viewer: {blocking},
      } as never),
      list: useListUnblockMutation(),
      muteList: useListMuteMutation(),
    }),
    {wrapper},
  )
  return {hook, pdsClient, appviewClient, queryClient}
}

beforeAll(() => {
  notifyManager.setNotifyFunction(callback => {
    act(callback)
  })
})

afterAll(() => {
  notifyManager.setNotifyFunction(callback => callback())
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(until).mockResolvedValue(true)
})

it('exposes mute capabilities but no block or unblock action for an unblocked account', () => {
  const {hook} = setup()
  expect(Object.keys(hook.result.current.actions).sort()).toEqual([
    'mute',
    'muteReposts',
    'unmute',
    'unmuteReposts',
  ])
})

it('unblocking an account without an existing block is a no-op', async () => {
  const {hook, pdsClient} = setup()
  await act(async () => {
    await hook.result.current.profile()
  })
  expect(pdsClient.delete).not.toHaveBeenCalled()
  expect(updateProfileShadow).not.toHaveBeenCalled()
})

it('removes an existing account block without creating a replacement', async () => {
  const {hook, pdsClient} = setup(blockUri)
  await act(async () => {
    await hook.result.current.actions.unblock!()
  })
  expect(pdsClient.delete).toHaveBeenCalledWith(app.bsky.graph.block, {
    repo: 'did:plc:viewer',
    rkey: 'existing',
  })
  expect(pdsClient.create).not.toHaveBeenCalled()
  expect(updateProfileShadow).toHaveBeenCalledWith(expect.anything(), did, {
    blockingUri: undefined,
  })
})

it('removes existing blocking-list subscriptions', async () => {
  const {hook, pdsClient} = setup()
  await act(async () => {
    await hook.result.current.list.mutateAsync({uri: listUri})
  })
  expect(pdsClient.call).toHaveBeenCalledWith(unblockActorList, {list: listUri})
  expect(pdsClient.call).not.toHaveBeenCalledWith(expect.anything())
})

it('retains mute-list subscriptions', async () => {
  const {hook, appviewClient} = setup()
  await act(async () => {
    await hook.result.current.muteList.mutateAsync({uri: listUri, mute: true})
  })
  expect(appviewClient.call).toHaveBeenCalledWith(muteActorList, {
    list: listUri,
  })
})

it('retains account muting and unmuting', async () => {
  const {hook, appviewClient} = setup()
  await act(async () => {
    await hook.result.current.actions.mute()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(muteActor, {actor: did})
  await act(async () => {
    await hook.result.current.actions.unmute()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(unmuteActor, {actor: did})
})

it('retains repost-only muting and unmuting', async () => {
  const {hook, appviewClient} = setup()
  await act(async () => {
    await hook.result.current.actions.muteReposts()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(muteActor, {
    actor: did,
    onlyReposts: true,
  })
  await act(async () => {
    await hook.result.current.actions.unmuteReposts()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(unmuteActor, {actor: did})
})

it('coalesces concurrent unblock requests, resolves every caller and refreshes caches', async () => {
  const {hook, pdsClient, queryClient} = setup(blockUri)
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries')
  let release!: () => void
  pdsClient.delete.mockImplementation(
    () =>
      new Promise<void>(resolve => {
        release = resolve
      }),
  )
  await act(async () => {
    const first = hook.result.current.profile()
    const second = hook.result.current.profile()
    await Promise.resolve()
    await Promise.resolve()
    release()
    await Promise.all([first, second])
    await hook.result.current.profile()
  })
  expect(pdsClient.delete).toHaveBeenCalledTimes(1)
  expect(invalidate).toHaveBeenCalledWith({queryKey: ['my-blocked-accounts']})
  expect(invalidate).toHaveBeenCalledWith({queryKey: ['convos']})
  expect(resetProfilePostsQueries).toHaveBeenCalledWith(queryClient, did, 1000)
})

it('restores the block shadow after a failed deletion and allows a retry', async () => {
  const {hook, pdsClient} = setup(blockUri)
  pdsClient.delete.mockRejectedValueOnce(new Error('network failure'))
  await act(async () => {
    await expect(hook.result.current.profile()).rejects.toThrow(
      'network failure',
    )
  })
  expect(updateProfileShadow).toHaveBeenLastCalledWith(expect.anything(), did, {
    blockingUri: blockUri,
  })
  await act(async () => {
    await hook.result.current.profile()
  })
  expect(pdsClient.delete).toHaveBeenCalledTimes(2)
  expect(updateProfileShadow).toHaveBeenLastCalledWith(expect.anything(), did, {
    blockingUri: undefined,
  })
})
