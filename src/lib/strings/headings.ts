import {APP_CONFIG} from '#/plumblines/config'

export function bskyTitle(page: string, unreadCountLabel?: string) {
  const unreadPrefix = unreadCountLabel ? `(${unreadCountLabel}) ` : ''
  return `${unreadPrefix}${page} — ${APP_CONFIG.name}`
}
