/** Break measured lines without dropping spaces, Unicode characters or paragraphs. */
export function wrapCardText(
  text: string,
  width: number,
  measure: (text: string) => number,
): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.match(/\s+|\S+/gu) ?? []) {
      if (line && measure(line + word) > width) {
        lines.push(line)
        line = ''
      }
      const characters =
        typeof Intl.Segmenter === 'function'
          ? Array.from(
              new Intl.Segmenter(undefined, {granularity: 'grapheme'}).segment(
                word,
              ),
              value => value.segment,
            )
          : Array.from(word)
      for (const character of characters) {
        if (line && measure(line + character) > width) {
          lines.push(line)
          line = ''
        }
        line += character
      }
    }
    lines.push(line)
  }
  return lines
}

export type TextCard = {
  author: string
  handle: string
  text: string
  date: string
  permalink: string
}

export function cardPages(lines: string[], maxLines = 34): string[][] {
  if (maxLines < 1) throw new Error('A card must fit at least one line')
  const pages: string[][] = []
  for (let offset = 0; offset < lines.length; offset += maxLines) {
    pages.push(lines.slice(offset, offset + maxLines))
  }
  return pages.length ? pages : [[]]
}
