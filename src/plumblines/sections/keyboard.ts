import {type RefObject, useEffect} from 'react'
import {AtUri} from '@atproto/syntax'
import {useNavigation} from '@react-navigation/native'

import {type NavigationProp} from '#/lib/routes/types'
import {type SectionsConfig} from './model'

export function useSectionKeyboard(
  root: RefObject<HTMLDivElement | null>,
  config: SectionsConfig,
  save: (value: SectionsConfig) => void,
  onSectionSelect: () => void,
) {
  const navigation = useNavigation<NavigationProp>()
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!root.current?.getClientRects().length) return
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !(event.target instanceof Element)
      )
        return
      if (
        event.target.closest(
          'input,textarea,select,[contenteditable="true"],[role="textbox"]',
        )
      )
        return
      if (
        Array.from(
          document.querySelectorAll(
            '[role="dialog"],[role="alertdialog"],[role="menu"]',
          ),
        ).some(dialog => dialog.getClientRects().length)
      )
        return
      if (/^[1-8]$/.test(event.key)) {
        const section = config.sections[Number(event.key) - 1]
        if (section) {
          event.preventDefault()
          save({...config, activeId: section.id})
          onSectionSelect()
        }
        return
      }
      if (!['j', 'k', 'o'].includes(event.key)) return
      const stories = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          '[data-active="true"] [data-section-story]',
        ) ?? [],
      ).filter(story => story.getClientRects().length)
      const active = document.activeElement?.closest('[data-section-story]')
      const index = stories.findIndex(story => story === active)
      if (event.key === 'o') {
        const uri = index >= 0 ? stories[index].dataset.storyUri : undefined
        if (uri) {
          event.preventDefault()
          const record = new AtUri(uri)
          navigation.navigate('PostThread', {
            name: record.host,
            rkey: record.rkey,
          })
        }
      } else if (stories.length) {
        event.preventDefault()
        const next =
          index < 0
            ? 0
            : Math.max(
                0,
                Math.min(
                  stories.length - 1,
                  index + (event.key === 'j' ? 1 : -1),
                ),
              )
        stories[next].focus({preventScroll: true})
        stories[next].scrollIntoView({block: 'nearest', behavior: 'auto'})
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [root, config, save, onSectionSelect, navigation])
}
