/* eslint-disable bsky-internal/avoid-unwrapped-text -- This component is web-only semantic navigation. */
import {useEffect, useState} from 'react'
import {Trans, useLingui} from '@lingui/react/macro'

/** Page links give long editions stable landmarks without adding nested scrolling. */
export function PageNavigator({pageCount}: {pageCount: number}) {
  const {t: l} = useLingui()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const pages = Array.from({length: pageCount}, (_, index) =>
      document.getElementById(`newspaper-page-${index + 1}`),
    ).filter((page): page is HTMLElement => page instanceof HTMLElement)
    if (!pages.length) return

    // Pages can be much taller than the viewport. Determine the folio from the
    // last sheet whose top has crossed a stable line near the top of the page.
    const updateCurrentPage = () => {
      const landmark = window.innerHeight * 0.22
      let visiblePage = 1
      pages.forEach((page, index) => {
        if (page.getBoundingClientRect().top <= landmark)
          visiblePage = index + 1
      })
      setCurrentPage(visiblePage)
    }
    updateCurrentPage()
    window.addEventListener('scroll', updateCurrentPage, {passive: true})
    window.addEventListener('resize', updateCurrentPage)
    return () => {
      window.removeEventListener('scroll', updateCurrentPage)
      window.removeEventListener('resize', updateCurrentPage)
    }
  }, [pageCount])

  return (
    <nav className="newspaper-page-navigator" aria-label={l`Edition pages`}>
      <span className="newspaper-page-navigator-label">
        <Trans>Pages</Trans>
      </span>
      <ol>
        {Array.from({length: pageCount}, (_, index) => {
          const page = index + 1
          return (
            <li key={page}>
              <a
                href={`#newspaper-page-${page}`}
                aria-label={l`Page ${page}`}
                onClick={event => {
                  if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  ) {
                    return
                  }
                  event.preventDefault()
                  const target = document.getElementById(
                    `newspaper-page-${page}`,
                  )
                  if (!target) return
                  window.history.pushState({}, '', `#newspaper-page-${page}`)
                  target.scrollIntoView({block: 'start', behavior: 'auto'})
                  setCurrentPage(page)
                }}
                aria-current={currentPage === page ? 'location' : undefined}>
                {String(page).padStart(2, '0')}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
