import {type StoryTreatment} from './model'

/** Plumblines editorial wrapper; the child keeps the upstream moderation/actions renderer. */
export function DispatchStory({
  uri,
  treatment,
  label,
  children,
}: {
  uri: string
  treatment: StoryTreatment
  label: string
  children: React.ReactNode
}) {
  return (
    <article
      className="plumblines-dispatch"
      data-section-story=""
      data-story-uri={uri}
      data-treatment={treatment}
      tabIndex={0}>
      <span className="newspaper-dispatch-label">{label}</span>
      {children}
    </article>
  )
}
