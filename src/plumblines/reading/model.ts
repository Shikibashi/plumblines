import {type ThreadItem} from '#/state/queries/usePostThread/types'

export type ReadingPreferences = {reader: boolean; article: boolean}
export const DEFAULT_READING: ReadingPreferences = {
  reader: false,
  article: false,
}

export function validateReadingPreferences(value: unknown): ReadingPreferences {
  if (!value || typeof value !== 'object') return DEFAULT_READING
  return {
    reader: 'reader' in value && value.reader === true,
    article: 'article' in value && value.article === true,
  }
}

/** Change presentation only; original moderation, records and item order survive. */
export function articleThreadItem(item: ThreadItem): ThreadItem {
  if (item.type !== 'threadPost') return item
  return {
    ...item,
    ui: {
      ...item.ui,
      showParentReplyLine: false,
      showChildReplyLine: false,
      precedesChildReadMore: false,
    },
  }
}
