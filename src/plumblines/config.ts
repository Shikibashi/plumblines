import identity from './identity.json'

/** Fork identity. Protocol service identifiers deliberately live upstream. */
export const APP_CONFIG = {
  ...identity,
  features: {
    customFeeds: true,
    feedProvenance: true,
    newspaper: true,
  },
} as const
