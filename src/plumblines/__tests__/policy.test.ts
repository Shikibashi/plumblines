import {assertPdsWriteAllowed} from '../policy'

function write(path: string, body: unknown) {
  assertPdsWriteAllowed(path, {body: JSON.stringify(body)})
}

const createRecord = '/xrpc/com.atproto.repo.createRecord'
const putRecord = '/xrpc/com.atproto.repo.putRecord'
const applyWrites = '/xrpc/com.atproto.repo.applyWrites'

it.each(['app.bsky.graph.block', 'app.bsky.graph.listblock'] as const)(
  'rejects createRecord for %s',
  collection => {
    expect(() =>
      write(createRecord, {repo: 'did:plc:viewer', collection}),
    ).toThrow('Plumblines does not create account blocks')
  },
)

it.each(['app.bsky.graph.block', 'app.bsky.graph.listblock'] as const)(
  'rejects putRecord for %s',
  collection => {
    expect(() =>
      write(putRecord, {
        repo: 'did:plc:viewer',
        collection,
        rkey: 'existing',
        record: {$type: collection},
      }),
    ).toThrow('Plumblines does not create account blocks')
  },
)

it.each(['app.bsky.graph.block', 'app.bsky.graph.listblock'] as const)(
  'rejects applyWrites creates and puts for %s',
  collection => {
    for (const action of ['create', 'update'] as const) {
      expect(() =>
        write(applyWrites, {
          repo: 'did:plc:viewer',
          writes: [
            {
              $type: `com.atproto.repo.applyWrites#${action}`,
              collection,
              rkey: 'existing',
              value: {$type: collection},
            },
          ],
        }),
      ).toThrow('Plumblines does not create account blocks')
    }
  },
)

it('allows deleting an existing block and unrelated record writes', () => {
  expect(() =>
    write(applyWrites, {
      repo: 'did:plc:viewer',
      writes: [
        {
          $type: 'com.atproto.repo.applyWrites#delete',
          collection: 'app.bsky.graph.block',
          rkey: 'existing',
        },
      ],
    }),
  ).not.toThrow()

  expect(() =>
    write(createRecord, {
      repo: 'did:plc:viewer',
      collection: 'app.bsky.feed.post',
      record: {$type: 'app.bsky.feed.post', text: 'Hello'},
    }),
  ).not.toThrow()
})

it('fails closed when a repository write payload cannot be inspected', () => {
  expect(() =>
    assertPdsWriteAllowed(createRecord, {body: new Blob(['{}'])}),
  ).toThrow('Cannot inspect repository write payload')
  expect(() => assertPdsWriteAllowed(createRecord, {body: '{'})).toThrow()
})
