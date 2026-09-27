import {useEffect, useState} from 'react'
import {View} from 'react-native'
import {AtUri} from '@atproto/syntax'
import {moderatePost} from '@bsky/sdk/moderation'
import {Trans, useLingui} from '@lingui/react/macro'

import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {ContentHider} from '#/components/moderation/ContentHider'
import {Text} from '#/components/Typography'
import {type SharePostImageDialogProps} from './SharePostImageDialog.types'
import {cardPages, type TextCard, wrapCardText} from './text-card'

function drawCards(card: TextCard): string[] {
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  context.font = '32px Georgia, serif'
  const paragraphs = wrapCardText(
    card.text,
    872,
    text => context.measureText(text).width,
  )
  const pages = cardPages(paragraphs)
  return pages.map((lines, index) => {
    const rows: {text: string; font: string; step: number}[] = []
    const append = (text: string, font: string, step: number) => {
      context.font = font
      for (const part of wrapCardText(
        text,
        872,
        value => context.measureText(value).width,
      )) {
        rows.push({text: part, font, step})
      }
    }
    append('PLUMBLINES', 'bold 42px Georgia, serif', 58)
    append(card.author, 'bold 28px Georgia, serif', 36)
    append(card.handle, '24px Georgia, serif', 44)
    rows.push(
      ...lines.map(text => ({text, font: '32px Georgia, serif', step: 48})),
    )
    append('', '22px Georgia, serif', 20)
    append(card.date, '22px Georgia, serif', 30)
    append(card.permalink, '18px Georgia, serif', 25)
    append(`${index + 1} / ${pages.length}`, '20px Georgia, serif', 28)
    canvas.height = 100 + rows.reduce((height, row) => height + row.step, 0)
    context.fillStyle = '#f5efdf'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#24221e'
    let y = 64
    for (const row of rows) {
      context.font = row.font
      context.fillText(row.text, 64, y)
      y += row.step
    }
    const image = canvas.toDataURL('image/png')
    if (!image.startsWith('data:image/png')) {
      throw new Error('The browser could not create this image')
    }
    return image
  })
}

export function SharePostImageDialog({
  control,
  post,
  record,
}: SharePostImageDialogProps) {
  const {t: l} = useLingui()
  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={l`Share post as image`}>
        <ModeratedPreview post={post} record={record} />
        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}

function ModeratedPreview(props: Omit<SharePostImageDialogProps, 'control'>) {
  const opts = useModerationOpts()
  if (!opts) return null
  const moderation = moderatePost(props.post, opts)
  // Preview mounts only after any permitted reveal. Keeping the canvas effect
  // inside this subtree also prevents generating hidden content in memory.
  return (
    <ContentHider modui={moderation.ui('contentList')}>
      <Preview {...props} />
    </ContentHider>
  )
}

function Preview({post, record}: Omit<SharePostImageDialogProps, 'control'>) {
  const {t: l, i18n} = useLingui()
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    setImages([])
    setError(false)
    void document.fonts.ready
      .then(() => {
        if (!active) return
        const uri = new AtUri(post.uri)
        if (uri.collection !== 'app.bsky.feed.post')
          throw new Error('Invalid post URI')
        const date = new Date(record.createdAt)
        const result = drawCards({
          author: post.author.displayName || post.author.handle,
          handle: `@${post.author.handle}`,
          text: record.text,
          date: Number.isNaN(date.getTime())
            ? record.createdAt
            : i18n.date(date, {dateStyle: 'long', timeStyle: 'short'}),
          permalink: `https://plumblines.uk/profile/${post.author.did}/post/${uri.rkey}`,
        })
        if (active) setImages(result)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [
    post.uri,
    post.author.did,
    post.author.displayName,
    post.author.handle,
    record.text,
    record.createdAt,
    i18n,
  ])

  return (
    <View style={[a.gap_lg]}>
      <Text style={[a.text_xl, a.font_bold]}>
        <Trans>Share post as image</Trans>
      </Text>
      <Text>
        <Trans>
          Text-only card. Images, videos and quoted posts are not included.
          Review the preview before downloading.
        </Trans>
      </Text>
      {error ? (
        <Text>
          <Trans>
            Could not create the image. Close this dialog and try again.
          </Trans>
        </Text>
      ) : images.length === 0 ? (
        <Text>
          <Trans>Preparing preview…</Trans>
        </Text>
      ) : null}
      {images.map((image, index) => (
        <View key={index} style={[a.gap_sm]}>
          <img
            src={image}
            alt={l`Post text card preview, page ${index + 1}`}
            style={{width: '100%', height: 'auto'}}
          />
          <Button
            label={l`Download image ${index + 1}`}
            size="large"
            color="primary"
            onPress={() => {
              const link = document.createElement('a')
              link.download = `plumblines-post-${index + 1}.png`
              link.href = image
              link.click()
            }}>
            <ButtonText>
              <Trans>Download image {index + 1}</Trans>
            </ButtonText>
          </Button>
        </View>
      ))}
    </View>
  )
}
