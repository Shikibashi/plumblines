/* eslint-disable bsky-internal/avoid-unwrapped-text -- HTML text is valid in these web-shell-only components. */
import {Trans, useLingui} from '@lingui/react/macro'

import {usePreferencesQuery} from '#/state/queries/preferences'
import {useSession} from '#/state/session'
import {useSelectedFeed} from '#/state/shell/selected-feed'
import {InlineLinkText} from '#/components/Link'
import {getFeedContext} from '#/plumblines/feed-context'

export function FeedContext({routeName}: {routeName: string}) {
  const {t: l} = useLingui()
  const {hasSession} = useSession()
  const selectedFeed = useSelectedFeed()
  const {data: preferences} = usePreferencesQuery()
  const context = getFeedContext({
    routeName,
    hasSession,
    selectedFeed,
    preferences,
  })
  const following = context.kind === 'following'
  const merged = following && context.merged === true
  const feedUri =
    context.kind === 'custom' || context.kind === 'list' ? context.uri : null
  const source = following
    ? merged
      ? l`Following and saved feeds`
      : context.discoverFallback
        ? l`Following with possible Discover`
        : l`Following timeline`
    : context.kind === 'custom'
      ? l`Selected custom feed`
      : context.kind === 'list'
        ? l`Selected list feed`
        : context.kind === 'public'
          ? l`Public feed`
          : context.kind === 'page'
            ? l`Current page`
            : l`Feed selection unavailable`
  const ordering =
    context.kind === 'page'
      ? l`Not a home feed`
      : merged
        ? l`Mixed timeline and feed ordering`
        : following && context.merged === undefined
          ? l`Feed settings loading`
          : following && context.discoverFallback
            ? l`Timeline, then possible recommendations`
            : following
              ? l`Timeline order from AppView`
              : l`Not independently verified`
  const provider = following
    ? l`Account’s AppView`
    : context.kind === 'custom'
      ? l`Selected feed generator`
      : context.kind === 'list'
        ? l`Account’s AppView list feed`
        : context.kind === 'page'
          ? l`No home-feed claim on this page`
          : l`Not identified here`
  const inputs =
    context.kind === 'page'
      ? l`Not available for this page`
      : merged
        ? l`Timeline and saved feed sources; provider inputs unknown`
        : following && context.merged === undefined
          ? l`Waiting for feed settings`
          : following && context.discoverFallback
            ? l`Followed accounts; Discover may follow`
            : following
              ? l`Timeline of followed accounts`
              : context.kind === 'list'
                ? l`Selected list’s accounts`
                : l`Provider inputs not verified`
  const explanation =
    context.kind === 'page'
      ? l`The selected home feed is not evidence about this page. Feed provenance is shown when viewing a selected feed on Home.`
      : following && context.merged === undefined
        ? l`Your feed settings are still loading. Plumblines cannot yet identify whether saved feeds are mixed into this timeline.`
        : merged
          ? l`The client mixes your following timeline with eligible saved feeds and lists. Each feed supplies its own results; their private ranking inputs are not independently verified. Mute, label and content preferences can further filter results.`
          : following && context.discoverFallback
            ? l`This configuration can append Discover recommendations after the following timeline ends. This panel does not observe whether that fallback has started. Mute, label and content preferences can further filter results.`
            : following
              ? l`The client requests your following timeline from your account’s AppView. This is not an independent audit of server ordering. Mute, label and content preferences affect what is shown.`
              : context.kind === 'list'
                ? l`The client requests posts from accounts in the selected list through your AppView. This panel does not independently verify server ordering. Your content preferences can further filter results.`
                : l`This panel has no verified ranking or input disclosure for this feed. Provider descriptions, when available on a feed’s page, are provider claims rather than independent verification.`
  return (
    <div className="press-context" data-testid="plumblines-feed-context">
      <section className="press-box">
        <h2>
          <Trans>Why you see this</Trans>
          <span aria-hidden="true">❧</span>
        </h2>
        <dl>
          <div>
            <dt>
              <Trans>Source</Trans>
            </dt>
            <dd>{source}</dd>
          </div>
          <div>
            <dt>
              <Trans>Ordering</Trans>
            </dt>
            <dd>{ordering}</dd>
          </div>
          <div>
            <dt>
              <Trans>Filters</Trans>
            </dt>
            <dd>
              {hasSession && preferences
                ? l`${preferences.moderationPrefs.mutedWords.length} muted terms`
                : l`Your content preferences`}
            </dd>
          </div>
          {merged && (
            <div>
              <dt>
                <Trans>Mixed feed</Trans>
              </dt>
              <dd>
                <Trans>Eligible saved feeds can be mixed in</Trans>
              </dd>
            </div>
          )}
        </dl>
        <InlineLinkText
          to={following ? '/settings/following-feed' : '/feeds'}
          label={l`Edit feed settings`}>
          <Trans>Edit feed settings →</Trans>
        </InlineLinkText>
      </section>
      <section className="press-box">
        <h2>
          <Trans>Moderation is your choice</Trans>
          <span aria-hidden="true">❧</span>
        </h2>
        <p>
          <Trans>
            You control what you see. Different people have different
            tolerances. Tools, not rules.
          </Trans>
        </p>
        <div className="press-context-links">
          <InlineLinkText
            to="/moderation/muted-accounts"
            label={l`Muted accounts`}>
            <Trans>Muted accounts</Trans>
            <span aria-hidden="true"> ›</span>
          </InlineLinkText>
          <InlineLinkText
            to="/moderation"
            label={l`Word filters and hidden posts`}>
            <Trans>Word filters & hidden posts</Trans>
            <span aria-hidden="true"> ›</span>
          </InlineLinkText>
          <InlineLinkText to="/moderation/modlists" label={l`Moderation lists`}>
            <Trans>Moderation lists</Trans>
            <span aria-hidden="true"> ›</span>
          </InlineLinkText>
          <InlineLinkText to="/moderation" label={l`Label services`}>
            <Trans>Label services</Trans>
            <span aria-hidden="true"> ›</span>
          </InlineLinkText>
          <InlineLinkText
            to="/moderation/interaction-settings"
            label={l`Reply and quote controls`}>
            <Trans>Reply & quote controls</Trans>
            <span aria-hidden="true"> ›</span>
          </InlineLinkText>
        </div>
        <p className="press-network-note">
          <Trans>
            Plumblines does not create blocks. Existing AT Protocol block
            relationships may still be respected by network services.
          </Trans>
        </p>
      </section>
      <section className="press-box">
        <h2>
          <Trans>Feed provenance</Trans>
          <span aria-hidden="true">❧</span>
        </h2>
        <dl>
          <div>
            <dt>
              <Trans>Provider</Trans>
            </dt>
            <dd>{provider}</dd>
          </div>
          <div>
            <dt>
              <Trans>Inputs</Trans>
            </dt>
            <dd>{inputs}</dd>
          </div>
        </dl>
        {feedUri && <p className="press-feed-uri">{feedUri}</p>}
        <details>
          <summary>
            <Trans>What determines this feed?</Trans>
          </summary>
          <p>{explanation}</p>
        </details>
      </section>
      <footer className="press-colophon">
        <Trans>More people. Brighter ideas.</Trans>
      </footer>
    </div>
  )
}
