import {
  DEFAULT_SECTIONS,
  matchesSectionFilters,
  moveSection,
  parseSectionSource,
  validateSections,
} from './model'

it('starts with a Following section and repairs invalid persisted input', () => {
  expect(validateSections(null)).toBe(DEFAULT_SECTIONS)
  expect(validateSections({version: 2, sections: []})).toBe(DEFAULT_SECTIONS)
  expect(DEFAULT_SECTIONS.sections[0].source).toEqual({kind: 'following'})
})

it('normalizes links and rejects mismatched sources and arbitrary websites', () => {
  expect(
    parseSectionSource(
      'feedgen',
      'https://bsky.app/profile/example.com/feed/news',
    ),
  ).toEqual({
    kind: 'feedgen',
    uri: 'at://example.com/app.bsky.feed.generator/news',
  })
  expect(
    parseSectionSource(
      'list',
      'at://did:plc:example/app.bsky.graph.list/friends',
    ),
  ).toEqual({
    kind: 'list',
    uri: 'at://did:plc:example/app.bsky.graph.list/friends',
  })
  expect(() =>
    parseSectionSource(
      'list',
      'https://bsky.app/profile/example.com/feed/news',
    ),
  ).toThrow()
  expect(() =>
    parseSectionSource(
      'feedgen',
      'https://elsewhere.example/profile/example.com/feed/news',
    ),
  ).toThrow()
  expect(() => parseSectionSource('search', ' ')).toThrow()
  expect(() =>
    parseSectionSource('feedgen', 'at://example.com/app.bsky.feed.post/post'),
  ).toThrow()
})

it('keeps different filters for the same source and drops corrupt/duplicate sections', () => {
  const first = DEFAULT_SECTIONS.sections[0]
  const config = validateSections({
    version: 1,
    activeId: 'missing',
    sections: [
      first,
      {
        ...first,
        id: 'second',
        filters: {replies: false, reposts: false, quotes: false},
      },
      first,
      {id: 'bad', title: 'bad', source: {kind: 'feedgen', uri: 'bad'}},
    ],
  })
  expect(config.sections).toHaveLength(2)
  expect(config.activeId).toBe('following')
  expect(config.sections[1].filters).toEqual({
    replies: false,
    reposts: false,
    quotes: false,
  })
  expect(moveSection(config, 'second', -1).sections[0].id).toBe('second')
  expect(moveSection(config, 'following', -1)).toBe(config)
})

it('filters replies and quote-with-media without hiding ordinary images', () => {
  const filters = {replies: false, reposts: false, quotes: false}
  expect(
    matchesSectionFilters(
      {record: {text: 'reply', reply: {parent: {}}}},
      filters,
    ),
  ).toBe(false)
  expect(
    matchesSectionFilters(
      {record: {}, embed: {$type: 'app.bsky.embed.recordWithMedia#view'}},
      filters,
    ),
  ).toBe(false)
  expect(
    matchesSectionFilters(
      {record: {embed: {$type: 'app.bsky.embed.record'}}},
      filters,
    ),
  ).toBe(false)
  expect(
    matchesSectionFilters(
      {record: {}, embed: {$type: 'app.bsky.embed.images#view'}},
      filters,
    ),
  ).toBe(true)
})
