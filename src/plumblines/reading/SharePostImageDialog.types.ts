import {type DialogControlProps} from '#/components/Dialog'
import {type app} from '#/lexicons'

export type SharePostImageDialogProps = {
  control: DialogControlProps
  post: app.bsky.feed.defs.PostView
  record: app.bsky.feed.post.Main
}
