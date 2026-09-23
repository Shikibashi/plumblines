/* eslint-disable bsky-internal/avoid-unwrapped-text -- This feature is mounted only in the web newspaper shell. */
import {Fragment, useMemo, useRef, useState} from 'react'
import {Trans, useLingui} from '@lingui/react/macro'

import {usePostAuthorShadowFilter} from '#/state/cache/profile-shadow'
import {FeedFeedbackProvider} from '#/state/feed-feedback'
import {useHiddenPosts} from '#/state/preferences/hidden-posts'
import {
  type FeedDescriptor,
  type FeedPostSlice,
  usePostFeedQuery,
} from '#/state/queries/post-feed'
import {useResolveUriQuery} from '#/state/queries/resolve-uri'
import {useSearchPostsV2Query} from '#/state/queries/search-posts-v2'
import {useSession} from '#/state/session'
import {useLoggedOutViewControls} from '#/state/shell/logged-out'
import {Post} from '#/view/com/post/Post'
import {PostFeedItem} from '#/view/com/posts/PostFeedItem'
import {ViewFullThread} from '#/view/com/posts/ViewFullThread'
import {DispatchStory} from '#/plumblines/frontpage/DispatchStory'
import {useLocalAttention} from '#/plumblines/local-attention'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'
import {StandardReading} from '#/plumblines/reading/standard'
import {
  DEFAULT_FRONT_PAGE_PREFERENCES,
  type FrontPageSegment,
  resolveFrontPagePackages,
  selectFrontPageSegment,
  type StoryTreatment,
  validateFrontPagePreferences,
} from '../frontpage/model'
import {useSectionKeyboard} from './keyboard'
import {
  DEFAULT_FILTERS,
  DEFAULT_SECTIONS,
  matchesSectionFilters,
  MAX_SECTIONS,
  moveSection,
  type NewspaperSection,
  parseSectionSource,
  type SectionSource,
  validateSections,
} from './model'

export function NewspaperSections() {
  const {t: l} = useLingui()
  const {hasSession} = useSession()
  const [config, save] = usePlumblinesStorage(
    'plumblinesSections',
    validateSections,
    DEFAULT_SECTIONS,
  )
  const [frontPage, saveFrontPage] = usePlumblinesStorage(
    'plumblinesFrontPage',
    value =>
      validateFrontPagePreferences(
        value,
        config.sections.map(section => section.id),
      ),
    DEFAULT_FRONT_PAGE_PREFERENCES,
  )
  const packages = resolveFrontPagePackages(config.sections, frontPage)
  const activeSection =
    config.sections.find(section => section.id === config.activeId) ?? null
  const sectionFor = (value: {id: string} | null) =>
    config.sections.find(section => section.id === value?.id) ?? null
  const leadSection = sectionFor(packages.lead)
  const briefsSection = sectionFor(packages.briefs)
  const secondaryLeftSection = sectionFor(packages.secondaryLeft)
  const secondaryRightSection = sectionFor(packages.secondaryRight)
  const root = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState<'front' | 'section'>('front')
  useSectionKeyboard(root, config, save, () => setActivePage('section'))
  const [managing, setManaging] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<SectionSource['kind']>('feedgen')
  const [source, setSource] = useState('')
  const [error, setError] = useState('')
  const update = (section: NewspaperSection) =>
    save({
      ...config,
      sections: config.sections.map(s => (s.id === section.id ? section : s)),
    })
  const add = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (config.sections.length >= MAX_SECTIONS)
        throw new Error(l`Up to eight sections can be open at once.`)
      if (!title.trim()) throw new Error(l`Give the section a name.`)
      const parsed = parseSectionSource(kind, source)
      const id = `section-${Date.now()}-${config.sections.length}`
      save({
        ...config,
        activeId: id,
        sections: [
          ...config.sections,
          {
            id,
            title: title.trim().slice(0, 80),
            source: parsed,
            filters: {...DEFAULT_FILTERS},
          },
        ],
      })
      setActivePage('section')
      setTitle('')
      setSource('')
      setError('')
    } catch {
      setError(
        l`Check the name and source. Use a matching feed/list AT URI or Bluesky link, or a non-empty search. Up to eight sections are supported.`,
      )
    }
  }
  return (
    <div
      ref={root}
      className="newspaper-sections"
      data-testid="newspaper-sections">
      <h1 className="sr-only">
        <Trans>Front page</Trans>
      </h1>
      <div className="newspaper-navigation-row">
        <nav
          className="newspaper-section-tabs"
          aria-label={l`Newspaper sections`}>
          <button
            aria-current={activePage === 'front' ? 'page' : undefined}
            onClick={() => setActivePage('front')}>
            <Trans>Front page</Trans>
          </button>
          {packages.availableSections.map(section => (
            <button
              key={section.id}
              aria-current={
                activePage === 'section' && config.activeId === section.id
                  ? 'page'
                  : undefined
              }
              onClick={() => {
                save({...config, activeId: section.id})
                setActivePage('section')
              }}>
              {section.title}
            </button>
          ))}
          <button
            className="newspaper-manage-button"
            onClick={() => setManaging(value => !value)}
            aria-expanded={managing}>
            <Trans>Manage sections</Trans>
          </button>
          <button
            onClick={() => scrollToNewspaperLandmark('newspaper-reading')}>
            <Trans>Reading</Trans>
          </button>
        </nav>
        <details className="newspaper-layout-settings">
          <summary>
            <Trans>Edit edition</Trans>
          </summary>
          <div className="newspaper-layout-controls">
            <label>
              <Trans>Lead section</Trans>
              <select
                value={frontPage.leadSectionId ?? packages.lead?.id ?? ''}
                onChange={event =>
                  saveFrontPage({
                    ...frontPage,
                    leadSectionId: event.target.value || null,
                  })
                }>
                {config.sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <Trans>Page composition</Trans>
              <select
                value={frontPage.template}
                onChange={event =>
                  saveFrontPage({
                    ...frontPage,
                    template: event.target.value as typeof frontPage.template,
                  })
                }>
                <option value="broadsheet">{l`Broadsheet`}</option>
                <option value="compact">{l`Compact`}</option>
                <option value="reading">{l`Reading`}</option>
              </select>
            </label>
          </div>
        </details>
        <details className="newspaper-keyboard-help">
          <summary>
            <Trans>Shortcuts</Trans>
          </summary>
          <p>
            <Trans>
              j / k move between stories; o opens the focused story; 1–8 select
              configured sections.
            </Trans>
          </p>
        </details>
      </div>
      {managing && (
        <section className="newspaper-manager" aria-label={l`Manage sections`}>
          <p>
            <Trans>
              Sections and their filters are saved on this device for this
              account.
            </Trans>
          </p>
          {config.sections.map((section, index) => (
            <div key={section.id} className="newspaper-manager-row">
              <label>
                <Trans>Section name</Trans>
                <input
                  aria-label={l`Rename ${section.title}`}
                  key={section.title}
                  defaultValue={section.title}
                  maxLength={80}
                  onBlur={e =>
                    update({
                      ...section,
                      title: e.target.value.trim() || section.title,
                    })
                  }
                />
              </label>
              <button
                disabled={index === 0}
                aria-label={l`Move ${section.title} earlier`}
                onClick={() => save(moveSection(config, section.id, -1))}>
                <Trans>Earlier</Trans>
              </button>
              <button
                disabled={index === config.sections.length - 1}
                aria-label={l`Move ${section.title} later`}
                onClick={() => save(moveSection(config, section.id, 1))}>
                <Trans>Later</Trans>
              </button>
              <button
                disabled={config.sections.length === 1}
                aria-label={l`Remove ${section.title}`}
                onClick={() => {
                  const sections = config.sections.filter(
                    s => s.id !== section.id,
                  )
                  save({
                    ...config,
                    sections,
                    activeId:
                      config.activeId === section.id
                        ? sections[0].id
                        : config.activeId,
                  })
                }}>
                <Trans>Remove</Trans>
              </button>
            </div>
          ))}
          <form onSubmit={add}>
            <label>
              <Trans>New section name</Trans>
              <input
                value={title}
                maxLength={80}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              <Trans>Source</Trans>
              <select
                value={kind}
                onChange={e =>
                  setKind(e.target.value as SectionSource['kind'])
                }>
                <option value="following">{l`Following`}</option>
                <option value="feedgen">{l`Custom feed`}</option>
                <option value="list">{l`List`}</option>
                <option value="search">{l`Saved search`}</option>
              </select>
            </label>
            {kind !== 'following' && (
              <label>
                {kind === 'search'
                  ? l`Search query`
                  : l`Feed or list link / AT URI`}
                <input
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  required
                  maxLength={1000}
                />
              </label>
            )}
            {error && <p role="alert">{error}</p>}
            <button
              type="submit"
              disabled={config.sections.length >= MAX_SECTIONS}>
              <Trans>Add section</Trans>
            </button>
          </form>
        </section>
      )}
      <div className="newspaper-sheet" id="newspaper-page-1">
        <div className="newspaper-folio">
          <span>
            {activePage === 'front' ? l`Live Edition` : l`Section front`}
          </span>
          <span>
            {activePage === 'front' ? l`Page 1` : activeSection?.title}
          </span>
        </div>
        {activePage === 'front' ? (
          <div
            className="newspaper-layout"
            data-template={frontPage.template}
            data-secondary-count={
              Number(!!secondaryLeftSection) + Number(!!secondaryRightSection)
            }
            data-testid="newspaper-layout">
            {leadSection && (
              <NewspaperRegion
                section={leadSection}
                slot="lead"
                segment="lead"
                onUpdate={update}
                isConfiguredLead
              />
            )}
            {briefsSection &&
              (hasSession ||
                !['following', 'search'].includes(
                  briefsSection.source.kind,
                )) && (
                <NewspaperRegion
                  section={briefsSection}
                  slot="briefs"
                  segment="briefs"
                  onUpdate={update}
                  isConfiguredLead
                />
              )}
            {secondaryLeftSection && (
              <NewspaperRegion
                section={secondaryLeftSection}
                slot="secondary-left"
                segment="secondary"
                onUpdate={update}
              />
            )}
            {secondaryRightSection && (
              <NewspaperRegion
                section={secondaryRightSection}
                slot="secondary-right"
                segment="secondary"
                onUpdate={update}
              />
            )}
            {!secondaryLeftSection && !secondaryRightSection && (
              <section className="newspaper-reading-promo">
                <h2>
                  <Trans>Reading</Trans>
                </h2>
                <p>
                  <Trans>
                    Long-form writing from the Atmosphere, collected in its own
                    index.
                  </Trans>
                </p>
                <button
                  onClick={() =>
                    scrollToNewspaperLandmark('newspaper-reading')
                  }>
                  <Trans>Open the reading index</Trans> →
                </button>
              </section>
            )}
          </div>
        ) : activeSection ? (
          <NewspaperRegion
            section={activeSection}
            slot="section-front"
            segment="section"
            onUpdate={update}
          />
        ) : null}
        <footer className="newspaper-page-colophon">
          <span>PLUMBLINES</span>
          {activePage === 'section' ? (
            <button onClick={() => setActivePage('front')}>
              <Trans>Back to front page</Trans>
            </button>
          ) : (
            <span />
          )}
          <span>
            {activePage === 'front' ? l`Page 1` : activeSection?.title}
          </span>
          <a href="#newspaper-reading">
            <Trans>Reading index</Trans>
          </a>
        </footer>
      </div>
      <div className="newspaper-sheet" id="newspaper-reading">
        <div className="newspaper-folio">
          <span>
            <Trans>Long-form index</Trans>
          </span>
          <span>{l`Page 2`}</span>
        </div>
        <StandardReading />
        <footer className="newspaper-page-colophon">
          <span>PLUMBLINES</span>
          <a href="#newspaper-page-1">
            <Trans>Previous page</Trans>
          </a>
          <span>{l`Page 2`}</span>
          <span />
        </footer>
      </div>
    </div>
  )
}

function scrollToNewspaperLandmark(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  })
}

function NewspaperRegion({
  section,
  slot,
  segment,
  onUpdate,
  isConfiguredLead = false,
}: {
  section: NewspaperSection
  slot:
    'lead' | 'briefs' | 'secondary-left' | 'secondary-right' | 'section-front'
  segment: FrontPageSegment
  onUpdate: (section: NewspaperSection) => void
  isConfiguredLead?: boolean
}) {
  const {t: l} = useLingui()
  return (
    <section
      id={`newspaper-region-${slot}-${section.id}`}
      className="newspaper-region"
      data-testid="newspaper-section"
      data-slot={slot}
      data-active={slot === 'section-front' ? 'true' : undefined}
      aria-label={
        slot === 'briefs' ? l`Dispatches from ${section.title}` : section.title
      }>
      <header className="newspaper-region-heading">
        <h2>
          {slot === 'briefs' ? <Trans>Dispatches</Trans> : section.title}
          {slot === 'lead' && (
            <span className="newspaper-lead-label">
              <Trans>Lead position</Trans>
            </span>
          )}
        </h2>
        <details className="newspaper-section-settings">
          <summary aria-label={l`Settings for ${section.title}`}>···</summary>
          <div className="newspaper-section-menu">
            <div className="newspaper-section-toolbar">
              {(['replies', 'reposts', 'quotes'] as const).map(filter => (
                <label key={filter}>
                  <input
                    type="checkbox"
                    checked={section.filters[filter]}
                    disabled={
                      filter === 'reposts' && section.source.kind === 'search'
                    }
                    onChange={event =>
                      onUpdate({
                        ...section,
                        filters: {
                          ...section.filters,
                          [filter]: event.target.checked,
                        },
                      })
                    }
                  />
                  {filter === 'replies'
                    ? l`Replies`
                    : filter === 'reposts'
                      ? l`Reposts`
                      : l`Quotes`}
                </label>
              ))}
            </div>
            <p className="newspaper-source-note">
              {section.source.kind === 'following'
                ? l`Following timeline · AppView order · no recommended-feed fallback`
                : section.source.kind === 'search'
                  ? l`Search results · latest · repost attribution is not supplied`
                  : l`Ordering is determined by the source service.`}
            </p>
            {section.source.kind === 'feedgen' ||
            section.source.kind === 'list' ? (
              <details>
                <summary>
                  <Trans>Source information</Trans>
                </summary>
                <p>{section.source.uri}</p>
              </details>
            ) : section.source.kind === 'search' ? (
              <p>{section.source.query}</p>
            ) : null}
          </div>
        </details>
      </header>
      <SectionContent
        section={section}
        segment={segment}
        isConfiguredLead={isConfiguredLead}
      />
    </section>
  )
}

function SectionContent({
  section,
  segment,
  isConfiguredLead,
}: {
  section: NewspaperSection
  segment: FrontPageSegment
  isConfiguredLead: boolean
}) {
  const {hasSession} = useSession()
  const {requestSwitchToAccount} = useLoggedOutViewControls()
  if (
    !hasSession &&
    (section.source.kind === 'following' || section.source.kind === 'search')
  )
    return (
      <div className="newspaper-stories">
        <p>
          <Trans>
            Sign in to read this section. You can add a publicly available
            custom feed or list while signed out.
          </Trans>
        </p>
        <button
          onClick={() => requestSwitchToAccount({requestedAccount: 'none'})}>
          <Trans>Sign in</Trans>
        </button>
      </div>
    )
  if (section.source.kind === 'search')
    return (
      <SearchColumn
        section={section}
        query={section.source.query}
        segment={segment}
        isConfiguredLead={isConfiguredLead}
      />
    )
  if (section.source.kind === 'following')
    return (
      <FeedColumn
        section={section}
        descriptor="following"
        segment={segment}
        isConfiguredLead={isConfiguredLead}
      />
    )
  return (
    <ResolvedFeedColumn
      section={section}
      uri={section.source.uri}
      kind={section.source.kind}
      segment={segment}
      isConfiguredLead={isConfiguredLead}
    />
  )
}

function ResolvedFeedColumn({
  section,
  uri,
  kind,
  segment,
  isConfiguredLead,
}: {
  section: NewspaperSection
  uri: string
  kind: 'feedgen' | 'list'
  segment: FrontPageSegment
  isConfiguredLead: boolean
}) {
  const result = useResolveUriQuery(uri)
  return result.data ? (
    <FeedColumn
      section={section}
      descriptor={`${kind}|${result.data.uri}`}
      segment={segment}
      isConfiguredLead={isConfiguredLead}
    />
  ) : (
    <div className="newspaper-stories">
      <p>
        {result.isError ? (
          <Trans>Could not resolve this source.</Trans>
        ) : (
          <Trans>Loading source…</Trans>
        )}
      </p>
      {result.isError && (
        <button onClick={() => void result.refetch()}>
          <Trans>Retry</Trans>
        </button>
      )}
    </div>
  )
}

function FeedColumn({
  section,
  descriptor,
  segment,
  isConfiguredLead,
}: {
  section: NewspaperSection
  descriptor: FeedDescriptor
  segment: FrontPageSegment
  isConfiguredLead: boolean
}) {
  const params = useMemo(
    () => ({strictFollowing: true, sectionFilters: section.filters}),
    [section.filters],
  )
  const feedback = useMemo(
    () => ({
      enabled: false,
      onItemSeen: () => {},
      sendInteraction: () => {},
      feedDescriptor: descriptor,
      feedSourceInfo: undefined,
    }),
    [descriptor],
  )
  const result = usePostFeedQuery(descriptor, params)
  const {t: l} = useLingui()
  const hiddenAuthors = usePostAuthorShadowFilter(result.data?.pages)
  const hiddenPosts = useHiddenPosts()
  const slices =
    result.data?.pages
      .flatMap(page => page.slices)
      .filter(slice =>
        slice.items.every(
          item =>
            !hiddenAuthors.includes(item.post.author.did) &&
            !hiddenPosts?.includes(item.uri),
        ),
      ) ?? []
  const selected = selectFrontPageSegment(slices, segment)
  return (
    <FeedFeedbackProvider value={feedback}>
      <div className="newspaper-stories" tabIndex={0} data-segment={segment}>
        {(segment === 'lead' || segment === 'section') && (
          <QueryControls result={result} empty={slices.length === 0} />
        )}
        {isConfiguredLead && segment === 'lead' && (
          <p className="newspaper-lead-credit">
            <Trans>Placed here by the front-page layout.</Trans>
          </p>
        )}
        {selected.map(({item: slice, index}) => (
          <SectionFeedSlice
            key={slice._reactKey}
            slice={slice}
            offset={0}
            treatments={Array.from({length: slice.items.length}, () =>
              treatmentForSegment(segment, index),
            )}
            dispatchLabel={l`Dispatch`}
          />
        ))}
        {segment === 'section' && <MoreButton result={result} />}
      </div>
    </FeedFeedbackProvider>
  )
}

/** Preserve the upstream root / missing replies / parent / selected-story presentation. */
export function SectionFeedSlice({
  slice,
  offset = 0,
  treatments = [],
  dispatchLabel = 'Dispatch',
}: {
  slice: FeedPostSlice
  offset?: number
  treatments?: StoryTreatment[]
  dispatchLabel?: string
}) {
  const incomplete = slice.isIncompleteThread && slice.items.length >= 3
  const indices = incomplete
    ? [0, slice.items.length - 2, slice.items.length - 1]
    : slice.items.map((_, index) => index)
  return (
    <div className="newspaper-feed-slice">
      {indices.map((index, position) => {
        const item = slice.items[index]
        const showReplyTo = incomplete
          ? position === 1 && item.parentAuthor?.did !== item.post.author.did
          : index === 0
        return (
          <Fragment key={item._reactKey}>
            {incomplete && position === 1 && (
              <ViewFullThread uri={slice.items[0].uri} />
            )}
            <DispatchStory
              uri={item.uri}
              treatment={
                hasImageEmbed(item.post.embed)
                  ? 'visual'
                  : (treatments[offset + index] ?? 'standard')
              }
              label={dispatchLabel}>
              <PostFeedItem
                post={item.post}
                record={item.record}
                postNumbering={item.postNumbering}
                reason={index === 0 ? slice.reason : undefined}
                feedContext={slice.feedContext}
                reqId={slice.reqId}
                moderation={item.moderation}
                parentAuthor={item.parentAuthor}
                showReplyTo={showReplyTo}
                isThreadParent={index < slice.items.length - 1}
                isThreadChild={index > 0}
                isThreadLastChild={
                  index > 0 && index === slice.items.length - 1
                }
                isParentBlocked={item.isParentBlocked}
                isParentNotFound={item.isParentNotFound}
                rootPost={slice.items[0].post}
              />
            </DispatchStory>
          </Fragment>
        )
      })}
    </div>
  )
}

function SearchColumn({
  section,
  query,
  segment,
  isConfiguredLead,
}: {
  section: NewspaperSection
  query: string
  segment: FrontPageSegment
  isConfiguredLead: boolean
}) {
  const {t: l} = useLingui()
  const result = useSearchPostsV2Query({query, sort: 'latest'})
  const {isPostHidden} = useLocalAttention()
  const hiddenPosts = useHiddenPosts()
  const seen = new Set<string>()
  const posts =
    result.data?.pages
      .flatMap(page => page.posts)
      .filter(post => {
        if (
          seen.has(post.uri) ||
          hiddenPosts?.includes(post.uri) ||
          isPostHidden(post) ||
          !matchesSectionFilters(post, section.filters)
        )
          return false
        seen.add(post.uri)
        return true
      }) ?? []
  const selectedPosts = selectPostSegments(posts, segment)
  return (
    <div className="newspaper-stories" tabIndex={0} data-segment={segment}>
      {(segment === 'lead' || segment === 'section') && (
        <QueryControls result={result} empty={posts.length === 0} />
      )}
      {isConfiguredLead && segment === 'lead' && (
        <p className="newspaper-lead-credit">
          <Trans>Placed here by the front-page layout.</Trans>
        </p>
      )}
      {selectedPosts.map((post, index) => (
        <DispatchStory
          key={post.uri}
          uri={post.uri}
          treatment={
            hasImageEmbed(post.embed)
              ? 'visual'
              : treatmentForSegment(segment, index)
          }
          label={l`Dispatch`}>
          <Post post={post} />
        </DispatchStory>
      ))}
      {segment === 'section' && <MoreButton result={result} />}
    </div>
  )
}

function hasImageEmbed(embed: unknown): boolean {
  if (!embed || typeof embed !== 'object') return false
  const value = embed as {$type?: string; media?: unknown}
  if (value.$type?.endsWith('#images')) return true
  if (value.$type?.endsWith('#recordWithMedia'))
    return hasImageEmbed(value.media)
  return false
}

function selectPostSegments<T>(posts: readonly T[], segment: FrontPageSegment) {
  return selectFrontPageSegment(posts, segment).map(({item}) => item)
}

function treatmentForSegment(
  segment: FrontPageSegment,
  index: number,
): StoryTreatment {
  if (segment === 'briefs') return 'brief'
  if (index === 0 && (segment === 'lead' || segment === 'section'))
    return 'lead'
  if (index === 0 && segment === 'secondary') return 'feature'
  return 'standard'
}

type QueryStatus = {
  isFetching: boolean
  isPending: boolean
  isError: boolean
  refetch: () => Promise<unknown>
  hasNextPage: boolean
  fetchNextPage: () => Promise<unknown>
}
function QueryControls({result, empty}: {result: QueryStatus; empty: boolean}) {
  return (
    <>
      <button
        className="newspaper-refresh"
        disabled={result.isFetching}
        onClick={() => void result.refetch()}>
        <span aria-hidden="true">↻</span>
        <span className="sr-only">
          <Trans>Refresh section</Trans>
        </span>
      </button>
      {result.isPending ? (
        <p role="status">
          <Trans>Loading posts…</Trans>
        </p>
      ) : result.isError ? (
        <p role="alert">
          <Trans>This source could not be loaded. Refresh to retry.</Trans>
        </p>
      ) : empty ? (
        <p>
          <Trans>No posts match this section.</Trans>
        </p>
      ) : null}
    </>
  )
}
function MoreButton({result}: {result: QueryStatus}) {
  return result.hasNextPage ? (
    <button
      disabled={result.isFetching}
      onClick={() => void result.fetchNextPage()}>
      <Trans>Load more posts</Trans>
    </button>
  ) : null
}
