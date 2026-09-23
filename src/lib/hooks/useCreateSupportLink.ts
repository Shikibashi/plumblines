import {useCallback} from 'react'

import {APP_CONFIG} from '#/plumblines/config'

export const ZENDESK_SUPPORT_URL = APP_CONFIG.supportUrl

export enum SupportCode {
  AA_DID = 'AA_DID',
  AA_BIRTHDATE = 'AA_BIRTHDATE',
}

/** Open fork support without embedding account identifiers in a public URL. */
export function useCreateSupportLink() {
  return useCallback(
    (_context: {code: SupportCode; email?: string}) =>
      `${APP_CONFIG.supportUrl}/new`,
    [],
  )
}
