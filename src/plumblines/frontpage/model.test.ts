import {
  composeFrontPage,
  DEFAULT_FRONT_PAGE_PREFERENCES,
  type FrontPageSection,
  validateFrontPagePreferences,
} from './model'

type Item = {text: string; hasImage?: boolean; recordType: string}
const feedA = {kind: 'following'}
const feedB = {kind: 'feedgen', uri: 'at://example.com/feed/economics'}

function sections(
  count = 2,
): FrontPageSection<Item, typeof feedA | typeof feedB>[] {
  return Array.from({length: count}, (_, index) => ({
    id: `section-${index + 1}`,
    title: `Section ${index + 1}`,
    source: index === 1 ? feedB : feedA,
    items: [
      {text: `Story ${index + 1}a`, recordType: 'app.bsky.feed.post'},
      {text: `Story ${index + 1}b`, recordType: 'site.standard.document'},
    ],
  }))
}

it('produces identical placements for identical section and item order', () => {
  const input = sections(3)
  const first = composeFrontPage(input)
  const second = composeFrontPage(input)

  expect(first).toEqual(second)
  expect(
    first.sheets[0].sections.flatMap(section => section.stories).slice(0, 4),
  ).toMatchObject([
    {sectionId: 'section-1', itemIndex: 0, slotIndex: 0, treatment: 'lead'},
    {sectionId: 'section-1', itemIndex: 1, slotIndex: 1, treatment: 'brief'},
    {sectionId: 'section-2', itemIndex: 0, slotIndex: 2, treatment: 'feature'},
    {sectionId: 'section-2', itemIndex: 1, slotIndex: 3, treatment: 'standard'},
  ])
})

it('uses the reader-selected lead section and marks its prominence truthfully', () => {
  const result = composeFrontPage(sections(), {
    version: 1,
    template: 'broadsheet',
    leadSectionId: 'section-2',
  })
  const stories = result.sheets[0].sections.flatMap(section => section.stories)

  expect(result.leadSectionId).toBe('section-2')
  expect(stories[0]).toMatchObject({
    sectionId: 'section-2',
    slotIndex: 0,
    zone: 'lead',
    treatment: 'lead',
    isConfiguredLead: true,
  })
  expect(stories[2]).toMatchObject({
    sectionId: 'section-1',
    slotIndex: 2,
    treatment: 'feature',
  })
  expect(stories[0]).not.toHaveProperty('headline')
})

it('changes configured prominence when section order changes', () => {
  const original = sections()
  const reordered = [original[1], original[0]]

  const originalLead = composeFrontPage(original)
    .sheets[0].sections.flatMap(section => section.stories)
    .find(story => story.treatment === 'lead')
  const reorderedLead = composeFrontPage(reordered)
    .sheets[0].sections.flatMap(section => section.stories)
    .find(story => story.treatment === 'lead')

  expect(originalLead?.sectionId).toBe('section-1')
  expect(reorderedLead?.sectionId).toBe('section-2')
  expect(reorderedLead?.slotIndex).toBe(0)
})

it('groups configured sections into sheets of four in their original order', () => {
  const input = sections(9)
  const result = composeFrontPage(input)

  expect(result.sheets.map(sheet => sheet.pageNumber)).toEqual([1, 2, 3])
  expect(
    result.sheets.map(sheet => sheet.sections.map(section => section.id)),
  ).toEqual([
    ['section-1', 'section-2', 'section-3', 'section-4'],
    ['section-5', 'section-6', 'section-7', 'section-8'],
    ['section-9'],
  ])
  expect(result.sheets[1].sections[0].stories[0]).toMatchObject({
    sheetIndex: 1,
    slotIndex: 8,
  })
})

it('lets image presence change treatment without changing story rank or source data', () => {
  const plain = sections(2)
  const illustrated = sections(2)
  plain[1].items = [
    {text: 'Actual document title', recordType: 'site.standard.document'},
  ]
  illustrated[1].items = [
    {
      text: 'Actual document title',
      recordType: 'site.standard.document',
      hasImage: true,
    },
  ]

  const plainStory = composeFrontPage(plain).sheets[0].sections[1].stories[0]
  const visualStory =
    composeFrontPage(illustrated).sheets[0].sections[1].stories[0]

  expect(plainStory).toMatchObject({
    slotIndex: 2,
    itemIndex: 0,
    treatment: 'feature',
  })
  expect(visualStory).toMatchObject({
    slotIndex: 2,
    itemIndex: 0,
    treatment: 'visual',
  })
  expect(visualStory.item).toBe(illustrated[1].items[0])
  expect(visualStory.source).toBe(feedB)
  expect(visualStory.item).toEqual({
    text: 'Actual document title',
    recordType: 'site.standard.document',
    hasImage: true,
  })
})

it('supports broadsheet, compact, and chronological reading templates', () => {
  const input = sections(2)
  const broadsheet = composeFrontPage(input, {
    version: 1,
    template: 'broadsheet',
    leadSectionId: null,
  })
  const compact = composeFrontPage(input, {
    version: 1,
    template: 'compact',
    leadSectionId: null,
  })
  const reading = composeFrontPage(input, {
    version: 1,
    template: 'reading',
    leadSectionId: null,
  })

  expect(broadsheet.sheets[0].sections[1].stories[0].treatment).toBe('feature')
  expect(compact.sheets[0].sections[1].stories[0].zone).toBe('grid')
  expect(reading.sheets[0].sections[0].stories[0]).toMatchObject({
    zone: 'stream',
    treatment: 'standard',
  })
  expect(
    reading.sheets[0].sections
      .flatMap(section => section.stories)
      .map(story => story.slotIndex),
  ).toEqual([0, 1, 2, 3])
})

it('repairs invalid persisted local preferences and an unavailable lead section', () => {
  expect(validateFrontPagePreferences(null, ['section-1'])).toBe(
    DEFAULT_FRONT_PAGE_PREFERENCES,
  )
  expect(
    validateFrontPagePreferences(
      {version: 1, template: 'future-layout', leadSectionId: 'removed'},
      ['section-1'],
    ),
  ).toEqual({version: 1, template: 'broadsheet', leadSectionId: null})
  expect(
    validateFrontPagePreferences(
      {version: 2, template: 'compact', leadSectionId: 'section-1'},
      ['section-1'],
    ),
  ).toBe(DEFAULT_FRONT_PAGE_PREFERENCES)
  expect(
    validateFrontPagePreferences(
      {version: 1, template: 'reading', leadSectionId: 'section-1'},
      ['section-1'],
    ),
  ).toEqual({version: 1, template: 'reading', leadSectionId: 'section-1'})
})
