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
import {useTheme} from '#/alf'
import {useLocalAttention} from '#/plumblines/local-attention'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'
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
  const t = useTheme()
  const [config, save] = usePlumblinesStorage(
    'plumblinesSections',
    validateSections,
    DEFAULT_SECTIONS,
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
      data-testid="newspaper-sections"
      style={{
        color: t.atoms.text.color,
        background: t.atoms.bg.backgroundColor,
      }}>
      <style>{`
      .newspaper-sections{font-family:Georgia,'Times New Roman',serif;min-width:0;width:100%;padding:16px;box-sizing:border-box}
      .newspaper-sections *{box-sizing:border-box}
      .newspaper-sections button,.newspaper-sections input,.newspaper-sections select{font:inherit;color:inherit;background:transparent;border:1px solid #a49a87;padding:8px;max-width:100%}
      .newspaper-sections button{cursor:pointer}.newspaper-sections button:disabled{opacity:.5;cursor:default}
      .newspaper-sections button:focus-visible,.newspaper-sections input:focus-visible,.newspaper-sections select:focus-visible{outline:2px solid #8d2924;outline-offset:2px}
      .newspaper-heading,.newspaper-section-toolbar,.newspaper-section-tabs{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .newspaper-heading{justify-content:space-between;border-bottom:3px double #a49a87;margin-bottom:12px}.newspaper-heading h1{font-size:28px;text-transform:uppercase;margin:0 0 10px}
      .newspaper-section-tabs{margin-bottom:16px}.newspaper-section-tabs [aria-pressed=true]{border-bottom:3px solid #8d2924}
      .newspaper-columns{display:grid;grid-template-columns:minmax(0,1fr);gap:18px;align-items:start}
      .newspaper-column{min-width:0;border:1px solid #a49a87;overflow:hidden}.newspaper-column>header{padding:12px;border-bottom:3px double #a49a87}
      .newspaper-column h2{font-size:23px;margin:0 0 8px;overflow-wrap:anywhere}.newspaper-column p{line-height:1.45;overflow-wrap:anywhere}
      .newspaper-stories{max-height:75vh;overflow:auto;overscroll-behavior:contain}.newspaper-stories>p,.newspaper-stories>button{margin:12px}
      .newspaper-section-toolbar label{display:flex;align-items:center;gap:4px;font-size:14px}.newspaper-section-toolbar input{margin:0}
      .newspaper-manager{padding:12px;border:1px solid #a49a87;margin-bottom:16px}.newspaper-manager form{display:grid;gap:10px}.newspaper-manager label{display:grid;gap:4px}.newspaper-manager input{width:100%}
      .newspaper-manager-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.newspaper-manager-row label{flex:1;min-width:120px}
      .newspaper-columns[data-count="1"]{grid-template-columns:minmax(0,1fr)}
      [data-section-story]:focus-visible{outline:2px solid #8d2924;outline-offset:-2px}
      @media(min-width:1500px){.newspaper-columns:not([data-count="1"]){grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:1499px){.newspaper-columns{grid-template-columns:minmax(0,1fr)}.newspaper-column[data-active=false]{display:none}.newspaper-stories{max-height:none;overflow:visible}}
      @media(max-width:500px){.newspaper-sections{padding:8px}.newspaper-heading h1{font-size:24px}}
    `}</style>
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
        {config.sections.map(section => (
          <button
            key={section.id}
            aria-pressed={config.activeId === section.id}
            onClick={() => save({...config, activeId: section.id})}>
            {section.title}
          </button>
        ))}
      </nav>
      <p>
        <Trans>
          Keyboard: j / k move between stories, o opens the focused story, 1–8
          select sections.
        </Trans>
      </p>
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
      <div className="newspaper-columns" data-count={config.sections.length}>
        {config.sections.map(section => (
          <section
            key={section.id}
            className="newspaper-column"
            data-testid="newspaper-section"
            data-active={config.activeId === section.id}
            aria-label={section.title}
            onFocusCapture={() => {
              if (config.activeId !== section.id)
                save({...config, activeId: section.id})
            }}>
            <header>
              <h2>{section.title}</h2>
              <div className="newspaper-section-toolbar">
                {(['replies', 'reposts', 'quotes'] as const).map(filter => (
                  <label key={filter}>
                    <input
                      type="checkbox"
                      checked={section.filters[filter]}
                      disabled={
                        filter === 'reposts' && section.source.kind === 'search'
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
                ))}
              </div>
              <p>
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
            </header>
            <SectionContent section={section} />
          </section>
        ))}
      </div>
    </div>
  )
}

function SectionContent({section}: {section: NewspaperSection}) {
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
    return <SearchColumn section={section} query={section.source.query} />
  if (section.source.kind === 'following')
    return <FeedColumn section={section} descriptor="following" />
  return (
    <ResolvedFeedColumn
      section={section}
      uri={section.source.uri}
      kind={section.source.kind}
    />
  )
}

function ResolvedFeedColumn({
  section,
  uri,
  kind,
}: {
  section: NewspaperSection
  uri: string
  kind: 'feedgen' | 'list'
}) {
  const result = useResolveUriQuery(uri)
  return result.data ? (
    <FeedColumn section={section} descriptor={`${kind}|${result.data.uri}`} />
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
}: {
  section: NewspaperSection
  descriptor: FeedDescriptor
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
  return (
    <FeedFeedbackProvider value={feedback}>
      <div className="newspaper-stories" tabIndex={0}>
        <QueryControls result={result} empty={slices.length === 0} />
        {slices.map(slice => (
          <SectionFeedSlice key={slice._reactKey} slice={slice} />
        ))}
        <MoreButton result={result} />
      </div>
    </FeedFeedbackProvider>
  )
}

/** Preserve the upstream root / missing replies / parent / selected-story presentation. */
export function SectionFeedSlice({slice}: {slice: FeedPostSlice}) {
  const incomplete = slice.isIncompleteThread && slice.items.length >= 3
  const indices = incomplete
    ? [0, slice.items.length - 2, slice.items.length - 1]
    : slice.items.map((_, index) => index)
  return (
    <div>
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
            <div data-section-story="" data-story-uri={item.uri} tabIndex={0}>
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
}: {
  section: NewspaperSection
  query: string
}) {
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
      {posts.map(post => (
        <div
          key={post.uri}
          data-section-story=""
          data-story-uri={post.uri}
          tabIndex={0}>
          <Post post={post} />
        </div>
      ))}
      <MoreButton result={result} />
    </div>
  )
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
