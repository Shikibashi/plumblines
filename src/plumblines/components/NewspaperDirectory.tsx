/* eslint-disable bsky-internal/avoid-unwrapped-text -- HTML text is valid in these web-shell-only components. */
import {Trans} from '@lingui/react/macro'

/** The product description remains separate from account-derived statistics. */
export function NewspaperDirectory() {
  return (
    <div className="press-directory">
      <h2>PLUMBLINES</h2>
      <p>
        <Trans>
          A social commons for a freer world.
          <br />
          Built on the AT Protocol.
          <br />
          Your attention. Your associations.
          <br />
          Your choice of feeds.
        </Trans>
      </p>
    </div>
  )
}
