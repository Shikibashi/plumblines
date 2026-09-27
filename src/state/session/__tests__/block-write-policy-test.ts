jest.unmock('multiformats/cid')

import {PasswordSession} from '@atproto/lex-password-session'
import {type NsidString} from '@atproto/syntax'
import {blockActorList} from '@bsky/sdk'

jest.mock('#/state/events', () => ({
  emitNetworkConfirmed: jest.fn(),
  emitNetworkLost: jest.fn(),
}))
jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({scope: 'com.atproto.access'}),
}))

import {app, com} from '#/lexicons'
import {buildAppviewClient, buildChatClient, buildPdsClient} from '../clients'
import {sessionAccountToSessionData} from '../session-data'
import {asFetch, DID, json, makeAccount, makeMockFetch} from './mock-fetch'

const cid = 'bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku'
const createdAt = '2026-09-23T00:00:00.000Z'
const restrictedCollections = [
  'app.bsky.graph.block',
  'app.bsky.graph.listblock',
] as const

function setup() {
  const fetchMock = makeMockFetch({
    'com.atproto.repo.createRecord': (_url, init) => {
      const body = JSON.parse(init.body as string) as {collection: string}
      return json({uri: `at://${DID}/${body.collection}/example`, cid})
    },
    'com.atproto.repo.putRecord': (_url, init) => {
      const body = JSON.parse(init.body as string) as {collection: string}
      return json({uri: `at://${DID}/${body.collection}/example`, cid})
    },
  })
  const session = new PasswordSession(
    sessionAccountToSessionData(makeAccount()),
    {
      fetch: asFetch(fetchMock),
    },
  )
  return {client: buildPdsClient(session), session, fetchMock}
}

function record(collection: string) {
  return collection === 'app.bsky.graph.block'
    ? {$type: collection, subject: 'did:plc:target', createdAt}
    : {
        $type: collection,
        subject: 'at://did:plc:owner/app.bsky.graph.list/example',
        createdAt,
      }
}

it.each(restrictedCollections)(
  'rejects serialized createRecord and putRecord for %s before authenticated I/O',
  async collection => {
    const {client, fetchMock} = setup()
    await expect(
      client.call(com.atproto.repo.createRecord, {
        repo: DID,
        collection,
        record: record(collection),
      }),
    ).rejects.toThrow('Plumblines does not create')
    await expect(
      client.call(com.atproto.repo.putRecord, {
        repo: DID,
        collection,
        rkey: 'example',
        record: record(collection),
      }),
    ).rejects.toThrow('Plumblines does not create')
    expect(fetchMock).not.toHaveBeenCalled()
  },
)

it('guards the typed record helper too', async () => {
  const {client, fetchMock} = setup()
  await expect(
    client.create(app.bsky.graph.block, {
      subject: 'did:plc:target',
      createdAt,
    }),
  ).rejects.toThrow('Plumblines does not create')
  expect(fetchMock).not.toHaveBeenCalled()
})

it.each(restrictedCollections)(
  'rejects the entire serialized applyWrites batch containing creation/update of %s',
  async collection => {
    for (const operation of ['create', 'update'] as const) {
      const {client, fetchMock} = setup()
      await expect(
        client.call(com.atproto.repo.applyWrites, {
          repo: DID,
          writes: [
            {
              $type: 'com.atproto.repo.applyWrites#delete',
              collection: 'app.bsky.feed.post',
              rkey: 'old',
            },
            {
              $type: `com.atproto.repo.applyWrites#${operation}`,
              collection,
              rkey: 'example',
              value: record(collection),
            },
          ],
        }),
      ).rejects.toThrow('Plumblines does not create')
      expect(fetchMock).not.toHaveBeenCalled()
    }
  },
)

it.each(restrictedCollections)(
  'allows deleting existing %s records directly and in batches',
  async collection => {
    const {client, fetchMock} = setup()
    await client.deleteRecord(collection, 'example')
    await client.call(com.atproto.repo.applyWrites, {
      repo: DID,
      writes: [
        {
          $type: 'com.atproto.repo.applyWrites#delete',
          collection,
          rkey: 'example',
        },
      ],
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    for (const [, init] of fetchMock.mock.calls) {
      expect(new Headers(init?.headers).get('authorization')).toBe(
        'Bearer access-jwt',
      )
    }
  },
)

it.each(['app.bsky.feed.post', 'app.bsky.graph.follow', 'app.bsky.feed.like'])(
  'preserves unrelated serialized writes for %s',
  async collection => {
    const {client, fetchMock} = setup()
    const value = {$type: collection, createdAt}
    await client.call(com.atproto.repo.createRecord, {
      repo: DID,
      collection: collection as NsidString,
      record: value,
    })
    await client.call(com.atproto.repo.putRecord, {
      repo: DID,
      collection: collection as NsidString,
      rkey: 'example',
      record: value,
    })
    await client.call(com.atproto.repo.applyWrites, {
      repo: DID,
      writes: [
        {
          $type: 'com.atproto.repo.applyWrites#create',
          collection: collection as NsidString,
          rkey: 'example',
          value,
        },
      ],
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    for (const [, init] of fetchMock.mock.calls) {
      expect((JSON.parse(init?.body as string) as {repo: string}).repo).toBe(
        DID,
      )
      expect(new Headers(init?.headers).get('authorization')).toBe(
        'Bearer access-jwt',
      )
      expect(new Headers(init?.headers).get('atproto-proxy')).toBeNull()
    }
  },
)

it('rejects the SDK blocking-list helper before network I/O', async () => {
  const {client, fetchMock} = setup()
  await expect(
    client.call(blockActorList, {
      list: 'at://did:plc:owner/app.bsky.graph.list/example',
    }),
  ).rejects.toThrow('Plumblines does not create')
  expect(fetchMock).not.toHaveBeenCalled()
})

it.each([buildAppviewClient, buildChatClient])(
  'guards PDS-targeting record helpers on every authenticated client',
  async buildClient => {
    const {session, fetchMock} = setup()
    await expect(
      buildClient(session).create(app.bsky.graph.block, {
        subject: 'did:plc:target',
        createdAt,
      }),
    ).rejects.toThrow('Plumblines does not create')
    expect(fetchMock).not.toHaveBeenCalled()
  },
)
