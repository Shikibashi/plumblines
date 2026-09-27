import {
  declaredPdsFromDocument,
  didDocumentUrl,
  resolveDeclaredPublicPds,
} from './public-pds'
import {formatRecordJson, getRecordInfo, getRecordRenderer} from './registry'

const did = 'did:plc:3ijrhre2q5e4tt2f4ph2sneo'
const document = {
  id: did,
  service: [
    {
      id: '#atproto_pds',
      type: 'AtprotoPersonalDataServer',
      serviceEndpoint: 'https://pds.example.org/',
    },
  ],
}

afterEach(() => jest.restoreAllMocks())

it('retains custom record metadata and dispatches only explicitly supported record types', () => {
  const value = {
    $type: 'com.example.article',
    title: '<script>alert(1)</script>',
  }
  expect(getRecordRenderer(value)).toBe('generic')
  expect(getRecordRenderer({$type: 'app.bsky.feed.post'})).toBe('post')
  expect(getRecordRenderer({$type: '__proto__'})).toBe('generic')
  expect(
    getRecordInfo({
      $type: 'app.bsky.embed.record#viewRecord',
      author: {did},
      uri: 'at://example',
      value,
    }),
  ).toMatchObject({type: 'com.example.article', did, record: value})
  expect(formatRecordJson(value)).toContain(
    '"title": "<script>alert(1)</script>"',
  )
})

it('bounds large, deep and circular supplied JSON without interpreting it', () => {
  expect(formatRecordJson({text: 'x'.repeat(90000)}).length).toBeLessThan(5000)
  expect(formatRecordJson(Array.from({length: 1000}, (_, i) => i))).toContain(
    'Additional items omitted',
  )
  const circular: {self?: unknown} = {}
  circular.self = circular
  expect(formatRecordJson(circular)).toContain('Circular reference')
  expect(getRecordInfo(null)).toMatchObject({type: undefined, did: undefined})
  expect(getRecordRenderer(null)).toBe('generic')
  expect(formatRecordJson(undefined)).toBe('No record supplied')
})

it('validates DID binding and normalizes the declared HTTPS PDS origin', () => {
  expect(declaredPdsFromDocument(did, document)).toBe('https://pds.example.org')
  expect(() =>
    declaredPdsFromDocument(did, {...document, id: 'did:plc:other'}),
  ).toThrow('does not match')
  expect(declaredPdsFromDocument(did, {id: did})).toBeNull()
  expect(() =>
    declaredPdsFromDocument(did, {
      ...document,
      service: [...document.service, ...document.service],
    }),
  ).toThrow('ambiguous')
})

it.each([
  'http://pds.example.org',
  'https://user:secret@pds.example.org',
  'https://pds.example.org/path',
  'https://pds.example.org?token=1',
  'https://localhost',
  'https://127.0.0.1',
])('rejects invalid PDS endpoint %s', endpoint => {
  expect(() =>
    declaredPdsFromDocument(did, {
      ...document,
      service: [{...document.service[0], serviceEndpoint: endpoint}],
    }),
  ).toThrow()
})

it('resolves only supported public DID document locations', () => {
  expect(didDocumentUrl(did)).toBe(`https://plc.directory/${did}`)
  expect(didDocumentUrl('did:web:example.org')).toBe(
    'https://example.org/.well-known/did.json',
  )
  expect(() => didDocumentUrl('did:web:example.org:path')).toThrow(
    'Unsupported',
  )
  expect(() => didDocumentUrl('did:web:localhost')).toThrow()
  expect(() => didDocumentUrl('https://example.org')).toThrow('Invalid DID')
})

it('does not send credentials or follow redirects when reading public identity', async () => {
  const fetchMock = jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(document), {status: 200}))
  await expect(resolveDeclaredPublicPds(did)).resolves.toBe(
    'https://pds.example.org',
  )
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(
    `https://plc.directory/${did}`,
    expect.objectContaining({credentials: 'omit', redirect: 'error'}),
  )
  const init = fetchMock.mock.calls[0][1]
  expect(new Headers(init?.headers).get('authorization')).toBeNull()
})

it('stops after a mismatched identity response without fetching any record or fallback', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({...document, id: 'did:plc:other'}), {
      status: 200,
    }),
  )
  await expect(resolveDeclaredPublicPds(did)).rejects.toThrow('does not match')
  expect(fetchMock).toHaveBeenCalledTimes(1)
})
