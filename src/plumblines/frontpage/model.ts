/** Newspaper presentation templates. These preferences affect layout only. */
export type FrontPageTemplate = 'broadsheet' | 'compact' | 'reading'

/** Account/guest-local front-page configuration; it is never an AT Protocol record. */
export type FrontPagePreferences = {
  version: 1
  template: FrontPageTemplate
  /** Section the reader chose to place first, or null to follow configured section order. */
  leadSectionId: string | null
}

export const DEFAULT_FRONT_PAGE_PREFERENCES: FrontPagePreferences = {
  version: 1,
  template: 'broadsheet',
  leadSectionId: null,
}

/** Validate local persisted data against the currently configured section ids. */
export function validateFrontPagePreferences(
  value: unknown,
  configuredSectionIds: readonly string[] = [],
): FrontPagePreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_FRONT_PAGE_PREFERENCES
  }

  const candidate = value as Record<string, unknown>
  const template: FrontPageTemplate =
    candidate.template === 'compact' || candidate.template === 'reading'
      ? candidate.template
      : 'broadsheet'

  let leadSectionId: string | null = null
  if (
    typeof candidate.leadSectionId === 'string' &&
    configuredSectionIds.includes(candidate.leadSectionId)
  ) {
    leadSectionId = candidate.leadSectionId
  }

  if (candidate.version !== 1) return DEFAULT_FRONT_PAGE_PREFERENCES
  return {version: 1, template, leadSectionId}
}

export type StoryTreatment =
  'lead' | 'feature' | 'standard' | 'brief' | 'visual'

export type StoryZone = 'lead' | 'briefs' | 'secondary' | 'grid' | 'stream'

/** Minimal editorial input. `item` remains the original source object. */
export type FrontPageSection<T, Source = unknown> = {
  id: string
  title: string
  source: Source
  items: readonly T[]
}

export type FrontPageStory<T, Source> = {
  /** Original feed/search/article item; the compositor does not rewrite its data. */
  item: T
  /** Original configured source value, retained by reference. */
  source: Source
  sectionId: string
  sectionTitle: string
  sectionIndex: number
  itemIndex: number
  sheetIndex: number
  /** Stable flattened position derived only from configured section/item order. */
  slotIndex: number
  zone: StoryZone
  treatment: StoryTreatment
  /** True when this item leads because of the reader's selected layout. */
  isConfiguredLead?: boolean
}

export type FrontPageSheet<T, Source> = {
  pageNumber: number
  sections: Array<{
    id: string
    title: string
    source: Source
    sectionIndex: number
    stories: FrontPageStory<T, Source>[]
  }>
}

export type FrontPageComposition<T, Source> = {
  template: FrontPageTemplate
  leadSectionId: string | null
  sheets: FrontPageSheet<T, Source>[]
}

const SECTIONS_PER_SHEET = 4
const BRIEFS_PER_LEAD_SECTION = 3

/**
 * Place items without scoring or sorting them. Section and item order is the only
 * source of slot order; image presence may change visual treatment, never position.
 */
export function composeFrontPage<
  T extends {hasImage?: boolean},
  Source = unknown,
>(
  sections: readonly FrontPageSection<T, Source>[],
  preferences: FrontPagePreferences = DEFAULT_FRONT_PAGE_PREFERENCES,
): FrontPageComposition<T, Source> {
  const validated = validateFrontPagePreferences(
    preferences,
    sections.map(section => section.id),
  )
  const leadSectionId = validated.leadSectionId ?? sections[0]?.id ?? null
  const orderedSections = [
    ...sections.filter(section => section.id === leadSectionId),
    ...sections.filter(section => section.id !== leadSectionId),
  ]
  const firstSecondarySectionIndex = orderedSections.findIndex(
    section => section.id !== leadSectionId,
  )
  const sheets: FrontPageSheet<T, Source>[] = []
  let slotIndex = 0

  orderedSections.forEach((section, sectionIndex) => {
    const sheetIndex = Math.floor(sectionIndex / SECTIONS_PER_SHEET)
    let sheet = sheets[sheetIndex]
    if (!sheet) {
      sheet = {pageNumber: sheetIndex + 1, sections: []}
      sheets[sheetIndex] = sheet
    }

    const sectionIsLead = section.id === leadSectionId
    const stories = section.items.map((item, itemIndex) => {
      const zone = getZone(validated.template, sectionIsLead, itemIndex)
      const treatment = getTreatment(
        validated.template,
        sectionIsLead,
        sectionIndex,
        firstSecondarySectionIndex,
        itemIndex,
        item.hasImage === true,
      )
      const isConfiguredLead =
        validated.template !== 'reading' && sectionIsLead && itemIndex === 0
      const story: FrontPageStory<T, Source> = {
        item,
        source: section.source,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIndex,
        itemIndex,
        sheetIndex,
        slotIndex,
        zone: isConfiguredLead ? 'lead' : zone,
        treatment,
        ...(isConfiguredLead ? {isConfiguredLead: true} : {}),
      }
      slotIndex += 1
      return story
    })

    sheet.sections.push({
      id: section.id,
      title: section.title,
      source: section.source,
      sectionIndex,
      stories,
    })
  })

  return {template: validated.template, leadSectionId, sheets}
}

function getZone(
  template: FrontPageTemplate,
  sectionIsLead: boolean,
  itemIndex: number,
): StoryZone {
  if (template === 'reading') return 'stream'
  if (template === 'compact') return 'grid'
  if (sectionIsLead)
    return itemIndex <= BRIEFS_PER_LEAD_SECTION ? 'briefs' : 'secondary'
  return 'secondary'
}

function getTreatment(
  template: FrontPageTemplate,
  sectionIsLead: boolean,
  sectionIndex: number,
  firstSecondarySectionIndex: number,
  itemIndex: number,
  hasImage: boolean,
): StoryTreatment {
  if (template !== 'reading' && sectionIsLead && itemIndex === 0) return 'lead'
  if (hasImage) return 'visual'
  if (
    template === 'broadsheet' &&
    sectionIsLead &&
    itemIndex > 0 &&
    itemIndex <= BRIEFS_PER_LEAD_SECTION
  ) {
    return 'brief'
  }
  if (
    template === 'broadsheet' &&
    !sectionIsLead &&
    itemIndex === 0 &&
    sectionIndex === firstSecondarySectionIndex
  ) {
    return 'feature'
  }
  return 'standard'
}
