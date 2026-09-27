import {type StoryTreatment} from './model'

export type EditorialDispatchSlots = {
  reason?: React.ReactNode
  byline?: React.ReactNode
  context?: React.ReactNode
  body: React.ReactNode
  actions?: React.ReactNode
  supplemental?: React.ReactNode
}

/**
 * Plumblines presentation boundary for a social dispatch. The child uses the
 * upstream feed renderer for moderation, rich text, embeds, provenance, and
 * protocol actions; this component owns only editorial story structure.
 */
export function EditorialDispatch({
  uri,
  treatment,
  label,
  reason,
  byline,
  context,
  body,
  actions,
  supplemental,
  children,
}: {
  uri: string
  treatment: StoryTreatment
  label: string
  reason?: React.ReactNode
  byline?: React.ReactNode
  context?: React.ReactNode
  body?: React.ReactNode
  actions?: React.ReactNode
  supplemental?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <article
      className="plumblines-dispatch"
      tabIndex={-1}
      data-story-kind="dispatch"
      data-section-story=""
      data-story-uri={uri}
      data-treatment={treatment}>
      <header className="plumblines-dispatch-header">
        <span className="newspaper-dispatch-label">{label}</span>
        {reason ? (
          <div className="plumblines-dispatch-reason">{reason}</div>
        ) : null}
      </header>
      {byline ? (
        <div className="plumblines-dispatch-byline">{byline}</div>
      ) : null}
      {context ? (
        <aside className="plumblines-dispatch-context">{context}</aside>
      ) : null}
      <div className="plumblines-dispatch-content">{body ?? children}</div>
      {actions || supplemental ? (
        <footer className="plumblines-dispatch-actions">
          {actions}
          {supplemental}
        </footer>
      ) : null}
    </article>
  )
}

export type {EditorialDispatchSlots as DispatchSlots}
