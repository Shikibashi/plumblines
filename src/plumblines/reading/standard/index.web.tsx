/* eslint-disable bsky-internal/avoid-unwrapped-text -- This entry is web-only and uses semantic HTML. */
import {createElement, useCallback, useEffect, useRef, useState} from 'react'
import {Trans, useLingui} from '@lingui/react/macro'
import {defaultImageUrlResolver} from '@standard-reader/renderer-core'
import {
  type RendererComponentsInput,
  StandardDocumentRenderer,
} from '@standard-reader/renderer-react'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'

import {STALE} from '#/state/queries'
import {createQueryKey} from '#/state/queries/util'
import {useTheme} from '#/alf'
import {
  fetchDocument,
  fetchLatestFeed,
  safeExternalUrl,
  type StandardDocument,
  type StandardFeedItem,
} from './api'

const feedKey = createQueryKey('plumblines-standard-reading-feed', {})
const documentKey = (uri: string) =>
  createQueryKey('plumblines-standard-reading-document', {uri})

function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  const safeSrc = safeExternalUrl(src)
  if (!safeSrc) return null
  return (
    <figure className="pl-standard-image">
      <img
        src={safeSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function externalLink(href: string, children: React.ReactNode) {
  const safeHref = safeExternalUrl(href)
  if (!safeHref) return <>{children}</>
  return (
    <a href={safeHref} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  )
}

const rendererComponents: RendererComponentsInput = {
  shared: {
    Link: ({href, children}) => externalLink(href, children),
    Website: ({src, title, description}) => (
      <p className="pl-standard-embed-link">
        {externalLink(src, title || src)}
        {description ? <span>{description}</span> : null}
      </p>
    ),
    Button: ({text, href, caption}) => (
      <p>
        {externalLink(href, text)}
        {caption ? <small>{caption}</small> : null}
      </p>
    ),
    Iframe: ({url}) => {
      const safeUrl = safeExternalUrl(url)
      return safeUrl ? (
        <p className="pl-standard-embed-link">
          <a href={safeUrl} target="_blank" rel="noopener noreferrer nofollow">
            <Trans>Open embedded media at its source</Trans>
          </a>
        </p>
      ) : null
    },
    Image: ArticleImage,
    Root: ({children}) => <div className="pl-standard-prose">{children}</div>,
    Paragraph: ({children}) => <p>{children}</p>,
    Heading: ({level, children}) => {
      const tagName = `h${Math.min(6, Math.max(2, level))}` as
        'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return createElement(tagName, null, children)
    },
  },
}

function rendererImageUrl(input: {
  blob?: unknown
  externalSrc?: string
  authorDid?: string
}) {
  return safeExternalUrl(defaultImageUrlResolver(input)) ?? null
}

function dateLabel(
  date: string | undefined,
  i18n: ReturnType<typeof useLingui>['i18n'],
) {
  if (!date) return undefined
  return i18n.date(new Date(date), {dateStyle: 'medium'})
}

function provenance(item: StandardFeedItem) {
  return [
    item.publicationName,
    item.publicationOwnerHandle ? `@${item.publicationOwnerHandle}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')
}

function ArticleMetadata({item}: {item: StandardFeedItem}) {
  const {i18n} = useLingui()
  const date = dateLabel(item.publishedAt, i18n)
  const details = [
    provenance(item),
    date,
    item.readingTimeMinutes
      ? i18n._({
          id: 'plumblines.standard.readingTime',
          message: '{minutes} min read',
          values: {minutes: item.readingTimeMinutes},
        })
      : undefined,
  ].filter(Boolean)
  return (
    <div className="pl-standard-provenance">
      {details.length ? <p>{details.join(' · ')}</p> : null}
      {item.labels.length ? (
        <ul aria-label={i18n._('Labels')} className="pl-standard-labels">
          {item.labels.map((label, index) => (
            <li key={`${label.name}-${label.source ?? ''}-${index}`}>
              <span>{label.name}</span>
              {label.source ? <small> · {label.source}</small> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function DocumentBody({document}: {document: StandardDocument}) {
  if (!document.hasRenderableBody) {
    return (
      <p className="pl-standard-unavailable">
        <Trans>
          The source has not made a readable article body available.
        </Trans>
      </p>
    )
  }
  return (
    <div className="pl-standard-body">
      <StandardDocumentRenderer
        document={{
          content: document.content,
          contentFormat: document.contentFormat,
          authorDid: document.did,
          description: document.description,
        }}
        components={rendererComponents}
        options={{resolveImageUrl: rendererImageUrl}}
      />
      <p className="pl-standard-unavailable pl-standard-render-fallback">
        {document.textContent ? (
          <>
            <span>{document.textContent}</span>
            <br />
            <Trans>
              This document format is not supported by the reader yet. Showing
              the source text.
            </Trans>
          </>
        ) : (
          <Trans>
            This document format is not supported by the reader yet.
          </Trans>
        )}
      </p>
    </div>
  )
}

function ArticleReader({item}: {item: StandardFeedItem}) {
  const query = useQuery({
    queryKey: documentKey(item.uri),
    queryFn: ({signal}) => fetchDocument(item.uri, signal),
    enabled: item.hasRenderableBody,
    staleTime: STALE.HOURS.ONE,
  })

  if (!item.hasRenderableBody) {
    return (
      <article
        className="pl-standard-article"
        aria-labelledby="pl-standard-title">
        <ArticleMetadata item={item} />
        <h2 id="pl-standard-title">{item.title}</h2>
        {item.description ? (
          <p className="pl-standard-deck">{item.description}</p>
        ) : null}
        <p className="pl-standard-unavailable">
          <Trans>The index has no readable body for this document.</Trans>
        </p>
        {item.canonicalUrl ? (
          <p>
            <a
              href={item.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer nofollow">
              <Trans>Read at the publication</Trans>
            </a>
          </p>
        ) : null}
      </article>
    )
  }

  if (query.isPending) {
    return (
      <p role="status">
        <Trans>Opening article…</Trans>
      </p>
    )
  }
  if (query.isError) {
    return (
      <div role="alert" className="pl-standard-error">
        <p>
          <Trans>The article could not be loaded.</Trans>
        </p>
        <button type="button" onClick={() => void query.refetch()}>
          <Trans>Retry</Trans>
        </button>
      </div>
    )
  }

  const document = query.data
  return (
    <article
      className="pl-standard-article"
      aria-labelledby="pl-standard-title">
      <p className="pl-standard-kicker">
        <Trans>Standard.site article</Trans>
      </p>
      <ArticleMetadata item={document} />
      <h2 id="pl-standard-title">{document.title}</h2>
      {document.description ? (
        <p className="pl-standard-deck">{document.description}</p>
      ) : null}
      {document.coverImageUrl ? (
        <ArticleImage src={document.coverImageUrl} alt="" />
      ) : null}
      <DocumentBody document={document} />
      <footer className="pl-standard-article-footer">
        <p>
          <Trans>Original record</Trans> <code>{document.uri}</code>
        </p>
        {document.canonicalUrl ? (
          <a
            href={document.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer nofollow">
            <Trans>Read at the publication</Trans>
          </a>
        ) : null}
      </footer>
    </article>
  )
}

function StoryEntry({
  item,
  selected,
  onOpen,
}: {
  item: StandardFeedItem
  selected: boolean
  onOpen: () => void
}) {
  const {i18n} = useLingui()
  const date = dateLabel(item.publishedAt, i18n)
  return (
    <li
      className="pl-standard-entry"
      data-renderable={item.hasRenderableBody ? 'true' : 'false'}>
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        aria-label={i18n._({
          id: 'plumblines.standard.readArticle',
          message: 'Read article: {title}',
          values: {title: item.title},
        })}
        onClick={onOpen}>
        <span className="pl-standard-entry-type">
          <Trans>ARTICLE</Trans>
        </span>
        <span className="pl-standard-entry-title">{item.title}</span>
        <span className="pl-standard-entry-source">
          {provenance(item) || item.did}
        </span>
        {item.labels.length > 0 ? (
          <span className="pl-standard-entry-labels">
            {item.labels.map(label => label.name).join(' · ')}
          </span>
        ) : null}
        {date ? <time dateTime={item.publishedAt}>{date}</time> : null}
      </button>
    </li>
  )
}

export function StandardReading() {
  const {t: l} = useLingui()
  const theme = useTheme()
  const [selectedUri, setSelectedUri] = useState<string>()
  const feed = useInfiniteQuery({
    queryKey: feedKey,
    queryFn: ({pageParam, signal}) => fetchLatestFeed(pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: page => page.cursor,
    staleTime: STALE.MINUTES.FIVE,
  })
  const items = feed.data?.pages.flatMap(page => page.items) ?? []
  const selected = items.find(item => item.uri === selectedUri)
  const endOfIndex = useRef<HTMLDivElement>(null)
  const loadMore = useCallback(
    () => void feed.fetchNextPage(),
    [feed.fetchNextPage],
  )
  useEffect(() => {
    const element = endOfIndex.current
    if (
      !element ||
      !feed.hasNextPage ||
      feed.isFetchingNextPage ||
      feed.isFetchNextPageError ||
      typeof IntersectionObserver === 'undefined'
    )
      return
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) loadMore()
      },
      {rootMargin: '600px 0px'},
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [
    feed.hasNextPage,
    feed.isFetchingNextPage,
    feed.isFetchNextPageError,
    loadMore,
  ])

  return (
    <section
      className="pl-standard-reading"
      aria-labelledby="pl-standard-heading"
      style={
        {
          '--pl-paper': theme.atoms.bg.backgroundColor,
          '--pl-ink': theme.atoms.text.color,
          '--pl-muted': theme.atoms.text_contrast_medium.color,
          '--pl-rule': theme.atoms.border_contrast_low.borderColor,
          '--pl-red': theme.palette.primary_500,
        } as React.CSSProperties
      }>
      <style>{`
        .pl-standard-reading{color:var(--pl-ink);background:var(--pl-paper);padding:clamp(16px,3vw,36px);font-family:Georgia,'Times New Roman',serif;min-width:0}
        .pl-standard-reading *{box-sizing:border-box}
        .pl-standard-reading a{color:inherit;text-decoration-thickness:1px;text-underline-offset:3px}
        .pl-standard-reading button{font:inherit;color:inherit;background:transparent;border:0;border-radius:0;text-align:left;cursor:pointer}
        .pl-standard-reading button:focus-visible,.pl-standard-reading a:focus-visible{outline:2px solid var(--pl-red);outline-offset:3px}
        .pl-standard-head{border-bottom:3px double var(--pl-ink);padding-bottom:12px;margin-bottom:24px}
        .pl-standard-heading-row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap}
        .pl-standard-heading-row h1{font-size:clamp(30px,4vw,52px);line-height:1;margin:0;text-transform:uppercase;letter-spacing:.035em}
        .pl-standard-source{font-family:Arial,sans-serif;font-size:13px;color:var(--pl-muted);margin:8px 0 0}
        .pl-standard-layout{display:grid;grid-template-columns:minmax(210px,30%) minmax(0,1fr);gap:clamp(20px,4vw,56px);align-items:start}
        .pl-standard-list{list-style:none;padding:0;margin:0;border-top:1px solid var(--pl-rule)}
        .pl-standard-entry{border-bottom:1px solid var(--pl-rule)}
        .pl-standard-entry button{display:grid;gap:5px;width:100%;padding:14px 8px;min-height:72px}
        .pl-standard-entry button[aria-current=true]{border-left:3px solid var(--pl-red);padding-left:12px}
        .pl-standard-entry-type,.pl-standard-kicker{font:600 11px/1.3 Arial,sans-serif;letter-spacing:.12em;color:var(--pl-red)}
        .pl-standard-entry-title{font-size:18px;line-height:1.22;overflow-wrap:anywhere}
        .pl-standard-entry-source,.pl-standard-entry time,.pl-standard-provenance{font:13px/1.45 Arial,sans-serif;color:var(--pl-muted)}
        .pl-standard-entry time{font-size:12px}
        .pl-standard-entry-labels{font:600 12px/1.4 Arial,sans-serif;color:var(--pl-ink);border-inline-start:2px solid var(--pl-red);padding-inline-start:8px}
        .pl-standard-reading-more,.pl-standard-error button{margin-top:14px;padding:10px 2px;border-bottom:1px solid var(--pl-ink)}
        .pl-standard-load-sentinel{height:1px;width:100%}
        .pl-standard-reading-more:disabled,.pl-standard-error button:disabled{opacity:.55;cursor:wait}
        .pl-standard-detail{min-width:0;border-left:1px solid var(--pl-rule);padding-left:clamp(16px,3vw,40px)}
        .pl-standard-article{max-width:60ch;margin:0 auto}
        .pl-standard-article h2{font-size:clamp(30px,4vw,44px);line-height:1.08;margin:8px 0 12px;overflow-wrap:anywhere}
        .pl-standard-provenance p{margin:0 0 8px}
        .pl-standard-deck{font-size:20px;line-height:1.4;color:var(--pl-muted);margin:0 0 20px}
        .pl-standard-image{margin:20px 0}
        .pl-standard-image img{display:block;width:100%;height:auto;max-height:70vh;object-fit:contain}
        .pl-standard-image figcaption,.pl-standard-embed-link span{display:block;font:13px/1.45 Arial,sans-serif;color:var(--pl-muted);margin-top:6px}
        .pl-standard-prose{font-size:18px;line-height:1.72;overflow-wrap:anywhere}
        .pl-standard-prose p{margin:0 0 1.1em}
        .pl-standard-prose h2,.pl-standard-prose h3,.pl-standard-prose h4,.pl-standard-prose h5,.pl-standard-prose h6{line-height:1.2;margin:1.5em 0 .5em}
        .pl-standard-prose img{max-width:100%;height:auto}
        .pl-standard-prose pre{max-width:100%;overflow:auto;white-space:pre-wrap}
        .pl-standard-prose table{display:block;max-width:100%;overflow:auto;border-collapse:collapse}
        .pl-standard-prose th,.pl-standard-prose td{padding:6px;border:1px solid var(--pl-rule)}
        .pl-standard-labels{display:flex;gap:6px 14px;flex-wrap:wrap;list-style:none;margin:0;padding:0}
        .pl-standard-labels li{color:var(--pl-red)}
        .pl-standard-unavailable{color:var(--pl-muted);font-style:italic}
        .pl-standard-render-fallback{display:none}
        .pl-standard-body:not(:has(.pl-standard-prose)) .pl-standard-render-fallback{display:block}
        .pl-standard-error{border-left:3px solid var(--pl-red);padding:4px 0 8px 14px}
        .pl-standard-article-footer{border-top:1px solid var(--pl-rule);margin-top:36px;padding-top:12px;font:12px/1.5 Arial,sans-serif;color:var(--pl-muted);overflow-wrap:anywhere}
        .pl-standard-article-footer p{margin:0 0 8px}
        .pl-standard-article-footer code{font-size:11px}
        @media(max-width:700px){.pl-standard-reading{padding:16px}.pl-standard-layout{grid-template-columns:minmax(0,1fr);gap:24px}.pl-standard-detail{border-left:0;border-top:3px double var(--pl-rule);padding:20px 0 0}.pl-standard-entry button{min-height:60px}.pl-standard-article h2{font-size:32px}}
      `}</style>
      <header className="pl-standard-head">
        <div className="pl-standard-heading-row">
          <h1 id="pl-standard-heading">
            <Trans>Reading</Trans>
          </h1>
          <span className="pl-standard-kicker">
            <Trans>LONG-FORM</Trans>
          </span>
        </div>
        <p className="pl-standard-source">
          <Trans>
            Source: Standard Reader public index · Latest documents · Newest
            first
          </Trans>
        </p>
      </header>

      {feed.isPending ? (
        <p role="status">
          <Trans>Loading public articles…</Trans>
        </p>
      ) : feed.isError ? (
        <div className="pl-standard-error" role="alert">
          <p>
            <Trans>The public Reading index could not be loaded.</Trans>
          </p>
          <button type="button" onClick={() => void feed.refetch()}>
            <Trans>Retry</Trans>
          </button>
        </div>
      ) : items.length === 0 ? (
        <p>
          <Trans>The public index has no readable documents right now.</Trans>
        </p>
      ) : (
        <div className="pl-standard-layout">
          <nav aria-label={l`Latest public articles`}>
            <ol className="pl-standard-list">
              {items.map(item => (
                <StoryEntry
                  key={item.uri}
                  item={item}
                  selected={item.uri === selectedUri}
                  onOpen={() => setSelectedUri(item.uri)}
                />
              ))}
            </ol>
            {feed.hasNextPage && (
              <div
                ref={endOfIndex}
                className="pl-standard-load-sentinel"
                aria-hidden="true"
              />
            )}
            {feed.hasNextPage ? (
              <button
                className="pl-standard-reading-more"
                type="button"
                disabled={feed.isFetchingNextPage}
                onClick={loadMore}>
                {feed.isFetchingNextPage ? (
                  <Trans>Loading more…</Trans>
                ) : (
                  <Trans>More articles</Trans>
                )}
              </button>
            ) : null}
            {feed.isFetchNextPageError ? (
              <p role="alert">
                <Trans>
                  More articles could not be loaded. Select “More articles” to
                  retry.
                </Trans>
              </p>
            ) : null}
          </nav>
          <div className="pl-standard-detail" aria-live="polite">
            {selected ? (
              <ArticleReader item={selected} />
            ) : (
              <p>
                <Trans>
                  Select an article to open its full text from the public index.
                </Trans>
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default StandardReading
