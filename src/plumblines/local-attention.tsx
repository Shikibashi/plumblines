import {useCallback, useEffect, useState} from 'react'
import {TextInput, View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as Menu from '#/components/Menu'
import * as Toast from '#/components/Toast'
import {Text} from '#/components/Typography'
import {type app} from '#/lexicons'
import {
  addAttentionRule,
  type AttentionRule,
  EMPTY_ATTENTION,
  isLocallyHidden,
  validateAttention,
} from '#/plumblines/attention'
import {usePlumblinesStorage} from '#/plumblines/local-preferences'

export function useLocalAttention() {
  const [prefs, setPrefs] = usePlumblinesStorage(
    'plumblinesAttention',
    validateAttention,
    EMPTY_ATTENTION,
  )
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [])
  const isPostHidden = useCallback(
    (post: app.bsky.feed.defs.PostView) =>
      isLocallyHidden(post, prefs.rules, now),
    [prefs.rules, now],
  )
  const removeRule = (rule: AttentionRule) =>
    setPrefs({
      version: 1,
      rules: prefs.rules.filter(
        item => !(item.kind === rule.kind && item.subject === rule.subject),
      ),
    })
  const snoozeAccount = (did: string, handle: string, days = 1) => {
    setPrefs(
      addAttentionRule(
        prefs,
        {
          kind: 'account',
          subject: did,
          label: handle,
          expiresAt: Date.now() + days * 86_400_000,
        },
        Date.now(),
      ),
    )
  }
  const snoozeTopic = (topic: string) => {
    const subject = topic.trim().toLocaleLowerCase()
    if (!subject || subject.length > 80) return
    setPrefs(
      addAttentionRule(
        prefs,
        {
          kind: 'topic',
          subject,
          label: topic.trim(),
          expiresAt: Date.now() + 7 * 86_400_000,
        },
        Date.now(),
      ),
    )
  }
  return {
    rules: prefs.rules.filter(rule => rule.expiresAt > now),
    isPostHidden,
    removeRule,
    snoozeAccount,
    snoozeTopic,
  }
}

/** Direct items, compatible with native Menu.Group child filtering. */
export function useSnoozeAccountMenuItems(profile: {
  did: string
  handle: string
}) {
  const {t: l} = useLingui()
  const attention = useLocalAttention()
  const rule = attention.rules.find(
    item => item.kind === 'account' && item.subject === profile.did,
  )
  const snooze = (days: number) => {
    try {
      attention.snoozeAccount(profile.did, profile.handle, days)
      Toast.show(
        l`Account snoozed on this device. Manage it under Local attention.`,
      )
    } catch {
      Toast.show(
        l`Could not save the local rule. Remove an existing rule and try again.`,
        {type: 'error'},
      )
    }
  }
  return rule
    ? [
        <Menu.Item
          key="resume"
          label={l`End local snooze`}
          onPress={() => attention.removeRule(rule)}>
          <Menu.ItemText>
            <Trans>End local snooze</Trans>
          </Menu.ItemText>
        </Menu.Item>,
      ]
    : [
        <Menu.Item
          key="snooze-day"
          label={l`Snooze account for 24 hours`}
          onPress={() => snooze(1)}>
          <Menu.ItemText>
            <Trans>Snooze account for 24 hours</Trans>
          </Menu.ItemText>
        </Menu.Item>,
        <Menu.Item
          key="snooze-week"
          label={l`Snooze account for 7 days`}
          onPress={() => snooze(7)}>
          <Menu.ItemText>
            <Trans>Snooze account for 7 days</Trans>
          </Menu.ItemText>
        </Menu.Item>,
      ]
}

export function LocalAttentionDialog({
  control,
}: {
  control: Dialog.DialogControlProps
}) {
  const {t: l, i18n} = useLingui()
  const t = useTheme()
  const attention = useLocalAttention()
  const [topic, setTopic] = useState('')
  const save = () => {
    try {
      attention.snoozeTopic(topic)
      setTopic('')
    } catch {
      Toast.show(
        l`Could not save the local rule. Remove an existing rule and try again.`,
        {type: 'error'},
      )
    }
  }
  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={l`Local attention`} style={[a.gap_md]}>
        <Text style={[a.text_2xl, a.font_bold]}>
          <Trans>Local attention</Trans>
        </Text>
        <Text>
          <Trans>
            Snoozes hide matching stories in feeds on this device. They expire
            automatically and do not create blocks or change your account's
            network preferences.
          </Trans>
        </Text>
        <Text>
          <Trans>Ignore a word or phrase for 7 days</Trans>
        </Text>
        <TextInput
          accessibilityLabel={l`Word or phrase`}
          accessibilityHint={l`Matching post text will be hidden from feeds for seven days on this device.`}
          value={topic}
          onChangeText={setTopic}
          maxLength={80}
          onSubmitEditing={save}
          style={[
            a.p_md,
            a.border,
            t.atoms.border_contrast_medium,
            t.atoms.text,
          ]}
        />
        <Button
          label={l`Snooze topic`}
          onPress={save}
          disabled={!topic.trim()}
          size="small"
          color="primary">
          <ButtonText>
            <Trans>Snooze topic</Trans>
          </ButtonText>
        </Button>
        {attention.rules.length === 0 && (
          <Text>
            <Trans>No active local snoozes.</Trans>
          </Text>
        )}
        {attention.rules.map(rule => (
          <View
            key={`${rule.kind}:${rule.subject}`}
            style={[
              a.gap_sm,
              a.py_md,
              a.border_t,
              t.atoms.border_contrast_low,
            ]}>
            <Text style={a.font_bold}>{rule.label}</Text>
            <Text>
              <Trans>
                Until{' '}
                {i18n.date(new Date(rule.expiresAt), {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </Trans>
            </Text>
            <Button
              label={l`End snooze for ${rule.label}`}
              onPress={() => attention.removeRule(rule)}
              size="small"
              color="secondary">
              <ButtonText>
                <Trans>End snooze</Trans>
              </ButtonText>
            </Button>
          </View>
        ))}
        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}
