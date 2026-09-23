import {type ThreadItem} from '#/state/queries/usePostThread/types'
import {articleThreadItem, validateReadingPreferences} from '../model'
import {cardPages, wrapCardText} from '../text-card'

test('malformed local reader preferences cannot enable modes', () => {
  for (const value of [null, [], 'yes', {reader: 'true', article: 1}]) {
    expect(validateReadingPreferences(value)).toEqual({
      reader: false,
      article: false,
    })
  }
  expect(validateReadingPreferences({reader: true, article: false})).toEqual({
    reader: true,
    article: false,
  })
})

test('article presentation retains records, moderation, depth and pagination placeholders', () => {
  const item = {
    type: 'threadPost',
    key: 'post',
    uri: 'at://post',
    depth: 4,
    moderation: {filtered: true},
    value: {post: {record: {text: 'Original'}}},
    ui: {
      showParentReplyLine: true,
      showChildReplyLine: true,
      precedesChildReadMore: true,
    },
  } as unknown as ThreadItem
  const original = JSON.stringify(item)
  const result = articleThreadItem(item)
  expect(JSON.stringify(item)).toBe(original)
  expect(result).toMatchObject({
    depth: 4,
    moderation: {filtered: true},
    value: {post: {record: {text: 'Original'}}},
  })
  if (result.type === 'threadPost' && item.type === 'threadPost') {
    expect(result.value).toBe(item.value)
    expect(result.moderation).toBe(item.moderation)
    expect(result.ui.showParentReplyLine).toBe(false)
  }
  for (const type of [
    'threadPostBlocked',
    'threadPostNotFound',
    'threadPostNoUnauthenticated',
    'readMore',
    'readMoreUp',
  ]) {
    const placeholder = {type, key: type} as ThreadItem
    expect(articleThreadItem(placeholder)).toBe(placeholder)
  }
})

test('text-card wrapping preserves all characters and blank paragraphs', () => {
  const text =
    'A long paragraph 👩🏽‍🚀 with repeated  spaces and Ελληνικά.\n\nLast line.'
  const paragraphs = text.split('\n')
  const lines = paragraphs.map(paragraph =>
    wrapCardText(paragraph, 12, value => Array.from(value).length),
  )
  expect(lines.map(paragraph => paragraph.join('')).join('\n')).toBe(text)
  expect(lines.flat().some(line => line.includes('👩🏽‍🚀'))).toBe(true)
  expect(wrapCardText('First\n\nThird', 100, value => value.length)).toEqual([
    'First',
    '',
    'Third',
  ])
})

test('long text is paginated completely without clipping or omission', () => {
  const lines = Array.from({length: 105}, (_, index) => `Line ${index}`)
  const pages = cardPages(lines)
  expect(pages).toHaveLength(4)
  expect(pages.flat()).toEqual(lines)
  expect(pages.every(page => page.length <= 34)).toBe(true)
  expect(() => cardPages(lines, 0)).toThrow()
})
