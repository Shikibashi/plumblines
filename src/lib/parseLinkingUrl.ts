export function parseLinkingUrl(url: string): URL {
  /*
   * Hack: add a third slash to custom-scheme URLs so that `URL.host` is empty and
   * `URL.pathname` has the full path.
   */
  for (const scheme of ['plumblines', 'bluesky']) {
    if (url.startsWith(`${scheme}://`) && !url.startsWith(`${scheme}:///`)) {
      url = url.replace(`${scheme}://`, `${scheme}:///`)
    }
  }
  return new URL(url)
}
