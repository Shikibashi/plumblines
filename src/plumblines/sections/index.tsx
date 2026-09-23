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
import {useLocalAttention} from '#/plumblines/local-attention'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'
import {StandardReading} from '#/plumblines/reading/standard'
import {
  composeFrontPage,
  DEFAULT_FRONT_PAGE_PREFERENCES,
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
  const composition = composeFrontPage(
    config.sections.map(section => ({
      id: section.id,
      title: section.title,
      source: section.source,
      // Slots are layout-only; live feed items remain owned by their query.
      items: Array.from({length: 30}, () => ({hasImage: false})),
    })),
    frontPage,
  )
  const root = useRef<HTMLDivElement>(null)
  useSectionKeyboard(root, config, save)
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
      <div className="newspaper-heading">
        <h1>
          <Trans>The front page</Trans>
        </h1>
        <button onClick={() => setManaging(v => !v)} aria-expanded={managing}>
          <Trans>Manage sections</Trans>
        </button>
      </div>
      <nav
        className="newspaper-section-tabs"
        aria-label={l`Newspaper sections`}>
        {composition.sheets
          .flatMap(sheet => sheet.sections)
          .map(section => (
            <button
              key={section.id}
              aria-current={
                composition.leadSectionId === section.id
                  ? 'location'
                  : undefined
              }
              onClick={() =>
                scrollToNewspaperLandmark(`newspaper-section-${section.id}`)
              }>
              {section.title}
            </button>
          ))}
        <button onClick={() => scrollToNewspaperLandmark('newspaper-reading')}>
          <Trans>Reading</Trans>
        </button>
      </nav>
      <details className="newspaper-layout-settings">
        <summary>
          <Trans>Edit front page</Trans>
        </summary>
        <div className="newspaper-layout-controls">
          <label>
            <Trans>Lead section</Trans>
            <select
              value={frontPage.leadSectionId ?? composition.leadSectionId ?? ''}
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
          <Trans>Keyboard shortcuts</Trans>
        </summary>
        <p>
          <Trans>
            j / k move between stories; o opens the focused story; 1–8 select
            configured sections.
          </Trans>
        </p>
      </details>
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
      {composition.sheets.map(sheet => (
        <div
          className="newspaper-sheet"
          id={`newspaper-page-${sheet.pageNumber}`}
          key={sheet.pageNumber}>
          <div className="newspaper-folio">
            <span>
              <Trans>Live front page</Trans>
            </span>
            <span>{l`Page ${sheet.pageNumber}`}</span>
          </div>
          <div
            className="newspaper-columns"
            data-template={composition.template}
            data-count={sheet.sections.length}>
            {sheet.sections.map(layoutSection => {
              const section = config.sections.find(
                candidate => candidate.id === layoutSection.id,
              )
              if (!section) return null
              return (
                <section
                  key={section.id}
                  id={`newspaper-section-${section.id}`}
                  className="newspaper-column"
                  data-testid="newspaper-section"
                  data-lead={composition.leadSectionId === section.id}
                  data-feature={
                    layoutSection.stories[0]?.treatment === 'feature'
                  }
                  aria-label={section.title}
                  onFocusCapture={() => {
                    if (config.activeId !== section.id)
                      save({...config, activeId: section.id})
                  }}>
                  <header>
                    <h2>
                      {section.title}
                      {composition.leadSectionId === section.id && (
                        <span className="newspaper-lead-label">
                          <Trans>Lead</Trans>
                        </span>
                      )}
                    </h2>
                    <details className="newspaper-section-settings">
                      <summary aria-label={l`Settings for ${section.title}`}>
                        ···
                      </summary>
                      <div className="newspaper-section-toolbar">
                        {(['replies', 'reposts', 'quotes'] as const).map(
                          filter => (
                            <label key={filter}>
                              <input
                                type="checkbox"
                                checked={section.filters[filter]}
                                disabled={
                                  filter === 'reposts' &&
                                  section.source.kind === 'search'
                                }
                                onChange={e =>
                                  update({
                                    ...section,
                                    filters: {
                                      ...section.filters,
                                      [filter]: e.target.checked,
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
                          ),
                        )}
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
                    </details>
                  </header>
                  <SectionContent
                    section={section}
                    treatments={layoutSection.stories.map(
                      story => story.treatment,
                    )}
                    isConfiguredLead={
                      !!layoutSection.stories[0]?.isConfiguredLead
                    }
                  />
                </section>
              )
            })}
          </div>
          <footer className="newspaper-page-colophon">
            <span>PLUMBLINES</span>
            {sheet.pageNumber > 1 ? (
              <a href={`#newspaper-page-${sheet.pageNumber - 1}`}>
                <Trans>Previous page</Trans>
              </a>
            ) : (
              <span />
            )}
            <span>{l`Page ${sheet.pageNumber} of ${composition.sheets.length + 1}`}</span>
            <a
              href={
                sheet.pageNumber < composition.sheets.length
                  ? `#newspaper-page-${sheet.pageNumber + 1}`
                  : '#newspaper-reading'
              }>
              <Trans>Next page</Trans>
            </a>
          </footer>
        </div>
      ))}
      <div className="newspaper-sheet" id="newspaper-reading">
        <div className="newspaper-folio">
          <span>
            <Trans>Long-form index</Trans>
          </span>
          <span>{l`Page ${composition.sheets.length + 1}`}</span>
        </div>
        <StandardReading />
        <footer className="newspaper-page-colophon">
          <span>PLUMBLINES</span>
          <a href={`#newspaper-page-${composition.sheets.length}`}>
            <Trans>Previous page</Trans>
          </a>
          <span>{l`Page ${composition.sheets.length + 1} of ${composition.sheets.length + 1}`}</span>
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

function SectionContent({
  section,
  treatments,
  isConfiguredLead,
}: {
  section: NewspaperSection
  treatments: StoryTreatment[]
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
        treatments={treatments}
        isConfiguredLead={isConfiguredLead}
      />
    )
  if (section.source.kind === 'following')
    return (
      <FeedColumn
        section={section}
        descriptor="following"
        treatments={treatments}
        isConfiguredLead={isConfiguredLead}
      />
    )
  return (
    <ResolvedFeedColumn
      section={section}
      uri={section.source.uri}
      kind={section.source.kind}
      treatments={treatments}
      isConfiguredLead={isConfiguredLead}
    />
  )
}

function ResolvedFeedColumn({
  section,
  uri,
  kind,
  treatments,
  isConfiguredLead,
}: {
  section: NewspaperSection
  uri: string
  kind: 'feedgen' | 'list'
  treatments: StoryTreatment[]
  isConfiguredLead: boolean
}) {
  const result = useResolveUriQuery(uri)
  return result.data ? (
    <FeedColumn
      section={section}
      descriptor={`${kind}|${result.data.uri}`}
      treatments={treatments}
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
  treatments,
  isConfiguredLead,
}: {
  section: NewspaperSection
  descriptor: FeedDescriptor
  treatments: StoryTreatment[]
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
  const sliceOffsets = slices.map((_, index) =>
    slices
      .slice(0, index)
      .reduce((offset, slice) => offset + slice.items.length, 0),
  )
  return (
    <FeedFeedbackProvider value={feedback}>
      <div className="newspaper-stories" tabIndex={0}>
        <QueryControls result={result} empty={slices.length === 0} />
        {isConfiguredLead && (
          <p className="newspaper-lead-credit">
            <Trans>Lead follows your section order.</Trans>
          </p>
        )}
        {slices.map((slice, index) => (
          <SectionFeedSlice
            key={slice._reactKey}
            slice={slice}
            offset={sliceOffsets[index]}
            treatments={treatments}
            dispatchLabel={l`Dispatch`}
          />
        ))}
        <MoreButton result={result} />
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
            <div
              data-section-story=""
              data-story-uri={item.uri}
              data-treatment={
                hasImageEmbed(item.post.embed)
                  ? 'visual'
                  : (treatments[offset + index] ?? 'standard')
              }
              tabIndex={0}>
              <span className="newspaper-dispatch-label">{dispatchLabel}</span>
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
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

function SearchColumn({
  section,
  query,
  treatments,
  isConfiguredLead,
}: {
  section: NewspaperSection
  query: string
  treatments: StoryTreatment[]
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
  return (
    <div className="newspaper-stories" tabIndex={0}>
      <QueryControls result={result} empty={posts.length === 0} />
      {isConfiguredLead && (
        <p className="newspaper-lead-credit">
          <Trans>Lead follows your section order.</Trans>
        </p>
      )}
      {posts.map((post, index) => (
        <div
          key={post.uri}
          data-section-story=""
          data-story-uri={post.uri}
          data-treatment={
            hasImageEmbed(post.embed)
              ? 'visual'
              : (treatments[index] ?? 'standard')
          }
          tabIndex={0}>
          <span className="newspaper-dispatch-label">{l`Dispatch`}</span>
          <Post post={post} />
        </div>
      ))}
      <MoreButton result={result} />
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
        disabled={result.isFetching}
        onClick={() => void result.refetch()}>
        <Trans>Refresh section</Trans>
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
