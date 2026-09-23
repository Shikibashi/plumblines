import {type PropsWithChildren} from 'react'
import {
  blockActorList,
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
import {useListBlockMutation, useListMuteMutation} from '../list'
import {
  useProfileBlockMutationQueue,
  useProfileMuteMutationQueue,
} from '../profile'

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
      profile: useProfileBlockMutationQueue({
        did,
        handle: 'subject.test',
        viewer: {blocking},
      } as never),
      mute: useProfileMuteMutationQueue({
        did,
        handle: 'subject.test',
        viewer: {},
      } as never),
      list: useListBlockMutation(),
      muteList: useListMuteMutation(),
    }),
    {wrapper},
  )
  return {hook, pdsClient, appviewClient}
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

it('rejects account block creation before writes or optimistic profile changes', async () => {
  const {hook, pdsClient} = setup()
  await act(async () => {
    await expect(hook.result.current.profile[0]()).rejects.toThrow(
      'Plumblines does not create',
    )
  })
  expect(pdsClient.create).not.toHaveBeenCalled()
  expect(pdsClient.delete).not.toHaveBeenCalled()
  expect(updateProfileShadow).not.toHaveBeenCalled()
})

it('removes an existing account block without creating a replacement', async () => {
  const {hook, pdsClient} = setup(blockUri)
  await act(async () => {
    await hook.result.current.profile[1]()
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

it('rejects blocking-list subscriptions without sending requests', async () => {
  const {hook, pdsClient, appviewClient} = setup()
  await act(async () => {
    await expect(
      hook.result.current.list.mutateAsync({uri: listUri, block: true}),
    ).rejects.toThrow('Plumblines does not create')
  })
  expect(pdsClient.call).not.toHaveBeenCalled()
  expect(appviewClient.call).not.toHaveBeenCalled()
  expect(until).not.toHaveBeenCalled()
})

it('removes existing blocking-list subscriptions', async () => {
  const {hook, pdsClient} = setup()
  await act(async () => {
    await hook.result.current.list.mutateAsync({uri: listUri, block: false})
  })
  expect(pdsClient.call).toHaveBeenCalledWith(unblockActorList, {list: listUri})
  expect(pdsClient.call).not.toHaveBeenCalledWith(
    blockActorList,
    expect.anything(),
  )
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
    await hook.result.current.mute[0]()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(muteActor, {actor: did})
  await act(async () => {
    await hook.result.current.mute[1]()
  })
  expect(appviewClient.call).toHaveBeenCalledWith(unmuteActor, {actor: did})
})
