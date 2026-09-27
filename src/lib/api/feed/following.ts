import {type Client} from '@atproto/lex'

import {app} from '#/lexicons'
import {type FeedAPI, type FeedAPIResponse} from './types'

const REQUEST_TIMEOUT_MS = 15_000

export class FollowingFeedTimeoutError extends Error {
  constructor() {
    super('Following feed request timed out')
    this.name = 'FollowingFeedTimeoutError'
  }
}

export class FollowingFeedAPI implements FeedAPI {
  client: Client

  constructor({client}: {client: Client}) {
    this.client = client
  }

  async peekLatest(): Promise<app.bsky.feed.defs.FeedViewPost> {
    const data = await this.client.call(app.bsky.feed.getTimeline, {
      limit: 1,
    })
    return data.feed[0]
  }

  async fetch({
    cursor,
    limit,
    signal,
  }: {
    cursor: string | undefined
    limit: number
    signal?: AbortSignal
  }): Promise<FeedAPIResponse> {
    /*
     * A failed request rejects rather than resolving, so the error propagates
     * to the query and drives the feed error UI. The agent behaved the same
     * way - its `success` flag was only ever true - so the empty-page branch
     * this replaces was unreachable.
     */
    const controller = new AbortController()
    let didTimeout = false
    const onQueryAbort = () => controller.abort(signal?.reason)
    if (signal?.aborted) {
      onQueryAbort()
    } else {
      signal?.addEventListener('abort', onQueryAbort, {once: true})
    }
    const timeoutId = setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const data = await this.client.call(
        app.bsky.feed.getTimeline,
        {
          cursor,
          limit,
        },
        {signal: controller.signal},
      )
      return {
        cursor: data.cursor,
        feed: data.feed,
      }
    } catch (error) {
      if (didTimeout) {
        throw new FollowingFeedTimeoutError()
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', onQueryAbort)
    }
  }
}
