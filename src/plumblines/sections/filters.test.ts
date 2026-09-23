jest.unmock('multiformats/cid')

import {FeedTuner} from '#/lib/api/feed-manip'
import {app} from '#/lexicons'
import {parse} from '#/types/bsky'
import {sectionFeedFilter} from './filters'

jest.mock('#/lib/api/feed/home', () => ({
  FALLBACK_MARKER_POST: {post: {uri: 'fallback-marker'}},
}))

function item(
  id: string,
  reply = false,
  repost = false,
  quote = false,
): app.bsky.feed.defs.FeedViewPost {
  const author = {did: 'did:plc:3ijrhre2q5e4tt2f4ph2sneo', handle: 'alice.test'}
  return {
    post: {
      uri: `at://did:plc:3ijrhre2q5e4tt2f4ph2sneo/app.bsky.feed.post/${id}`,
      cid: id,
      author,
      record: {
        $type: 'app.bsky.feed.post',
        text: id,
        createdAt: '2026-09-23T00:00:00Z',
        ...(reply
          ? {
              reply: {
                root: {
                  uri: 'at://did:plc:3ijrhre2q5e4tt2f4ph2sneo/app.bsky.feed.post/root',
                  cid: 'bafyreieawtmh7hwfrqpamqkodza5r62bbfhsepe2iyustgxhgbhi6b2lfi',
                },
                parent: {
                  uri: 'at://did:plc:3ijrhre2q5e4tt2f4ph2sneo/app.bsky.feed.post/root',
                  cid: 'bafyreieawtmh7hwfrqpamqkodza5r62bbfhsepe2iyustgxhgbhi6b2lfi',
                },
              },
            }
          : {}),
      },
      indexedAt: '2026-09-23T00:00:00Z',
      ...(quote ? {embed: {$type: 'app.bsky.embed.recordWithMedia#view'}} : {}),
    },
    ...(repost
      ? {
          reason: {
            $type: 'app.bsky.feed.defs#reasonRepost',
            by: author,
            indexedAt: '2026-09-23T00:00:00Z',
          },
        }
      : {}),
  } as app.bsky.feed.defs.FeedViewPost
}

it('combines reply/repost/quote filters on actual feed slices independently', () => {
  const feed = [
    item('original'),
    item('reply', true),
    item('repost', false, true),
    item('quote', false, false, true),
    item('reposted-reply', true, true),
  ]
  for (const entry of feed) parse(app.bsky.feed.post, entry.post.record)
  const selected = (replies: boolean, reposts: boolean, quotes: boolean) =>
    new FeedTuner([sectionFeedFilter({replies, reposts, quotes})])
      .tune(feed)
      .map(slice => slice.items[slice.items.length - 1].record.text)
  expect(selected(true, true, true)).toEqual([
    'original',
    'reply',
    'repost',
    'quote',
    'reposted-reply',
  ])
  expect(selected(false, true, true)).toEqual(['original', 'repost', 'quote'])
  expect(selected(true, false, true)).toEqual(['original', 'reply', 'quote'])
  expect(selected(true, true, false)).toEqual([
    'original',
    'reply',
    'repost',
    'reposted-reply',
  ])
  expect(selected(false, false, false)).toEqual(['original'])
})
