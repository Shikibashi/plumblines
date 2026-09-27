/* eslint-disable bsky-internal/avoid-unwrapped-text -- HTML text is valid in these web-shell-only components. */
import {Trans, useLingui} from '@lingui/react/macro'

/** Original botanical printer's ornament; no upstream artwork. */
function Branch({mirror = false}: {mirror?: boolean}) {
  return (
    <svg
      viewBox="0 0 100 90"
      aria-hidden="true"
      className="press-branch"
      style={{transform: mirror ? 'scaleX(-1)' : undefined}}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M96 84C57 85 31 62 13 8M88 82C60 69 53 44 58 16M65 77C42 77 21 68 6 56" />
        {[0, 1, 2, 3].map(i => (
          <g key={i} transform={`translate(${i * 9} ${i * 15})`}>
            <path d="M13 10C1 7 3 22 21 25C29 12 22 7 18 15M18 18L13 10M21 25L25 16" />
          </g>
        ))}
        <path d="M57 24C43 8 46 1 59 14C70 0 75 10 59 29M56 40C41 26 39 35 57 48C74 29 72 24 58 37M62 61C77 45 84 51 68 67M35 70C16 51 9 60 25 70C9 75 28 84 46 76" />
      </g>
    </svg>
  )
}

export function NewspaperMasthead() {
  const {i18n} = useLingui()
  return (
    <header className="press-masthead" data-testid="plumblines-masthead">
      <a className="press-skip" href="#plumblines-content">
        <Trans>Skip to content</Trans>
      </a>
      <div className="press-nameplate">
        <div className="press-name">
          <Branch />
          <a href="/" aria-label="Plumblines home">
            PLUMBLINES
          </a>
          <Branch mirror />
        </div>
        <div className="press-motto">
          <Trans>A newspaper for the Atmosphere</Trans>
        </div>
        <div className="press-edition">
          plumblines.uk <span>·</span>{' '}
          <Trans>independent AT Protocol client</Trans> <span>·</span>{' '}
          {i18n.date(new Date(), {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
    </header>
  )
}
