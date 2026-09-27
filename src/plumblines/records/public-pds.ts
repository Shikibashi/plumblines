import {isValidDid} from '@atproto/syntax'

import {asRecord} from './registry'

function httpsOrigin(value: string): string {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.hostname === 'localhost' ||
    url.hostname.endsWith('.localhost') ||
    url.hostname.includes(':') ||
    !url.hostname.includes('.') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)
  ) {
    throw new Error('Identity document contains an invalid public HTTPS origin')
  }
  return url.origin
}

export function didDocumentUrl(did: string): string {
  if (!isValidDid(did)) throw new Error('Invalid DID')
  if (/^did:plc:[a-z2-7]{24}$/.test(did)) return `https://plc.directory/${did}`
  if (did.startsWith('did:web:')) {
    const domain = did.slice(8)
    if (domain.includes(':')) throw new Error('Unsupported DID document path')
    return `${httpsOrigin('https://' + decodeURIComponent(domain))}/.well-known/did.json`
  }
  throw new Error('Unsupported DID method')
}

export function declaredPdsFromDocument(
  did: string,
  value: unknown,
): string | null {
  const document = asRecord(value)
  if (document?.id !== did)
    throw new Error('Identity document does not match the author DID')
  if (!Array.isArray(document.service)) return null
  const services = document.service
    .map(asRecord)
    .filter(
      service =>
        service &&
        (service.id === '#atproto_pds' ||
          service.id === `${did}#atproto_pds`) &&
        service.type === 'AtprotoPersonalDataServer',
    )
  if (services.length === 0) return null
  if (
    services.length !== 1 ||
    typeof services[0]?.serviceEndpoint !== 'string'
  ) {
    throw new Error('Identity document contains an ambiguous PDS service')
  }
  return httpsOrigin(services[0].serviceEndpoint)
}

/** Display-only discovery; no credentials, record fetches, or alternate authority fallback. */
export async function resolveDeclaredPublicPds(
  did: string,
): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(didDocumentUrl(did), {
      credentials: 'omit',
      redirect: 'error',
      signal: controller.signal,
      headers: {accept: 'application/json'},
    })
    if (!response.ok) throw new Error('Identity document is unavailable')
    const text = await response.text()
    if (text.length > 100000) throw new Error('Identity document is too large')
    return declaredPdsFromDocument(did, JSON.parse(text) as unknown)
  } finally {
    clearTimeout(timer)
  }
}
