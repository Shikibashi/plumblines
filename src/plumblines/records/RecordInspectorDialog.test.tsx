import {type PropsWithChildren} from 'react'
import {Text} from 'react-native'
import {setupI18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {render, screen} from '@testing-library/react-native'

import {RecordInspectorDialog} from './RecordInspectorDialog'

jest.mock('#/alf', () => ({
  atoms: {},
  useTheme: () => ({atoms: {text: {color: 'black'}}}),
}))
jest.mock('#/components/Typography', () => {
  const native: typeof import('react-native') = require('react-native')
  return {Text: native.Text}
})
jest.mock('#/components/Dialog', () => {
  const native: typeof import('react-native') = require('react-native')
  return {
    Outer: native.View,
    ScrollableInner: native.View,
    Handle: () => null,
    Close: () => null,
  }
})
const i18n = setupI18n({locale: 'en', messages: {en: {}}})
function wrapper({children}: PropsWithChildren) {
  return (
    <I18nProvider i18n={i18n} defaultComponent={Text}>
      {children}
    </I18nProvider>
  )
}

it('renders custom HTML-looking values as selectable text without network or executable markup', () => {
  const fetchMock = jest.spyOn(global, 'fetch')
  try {
    render(
      <RecordInspectorDialog
        control={{id: 'inspector', ref: {current: null}, open() {}, close() {}}}
        supplied={{
          $type: 'com.example.article',
          title: '<script>alert(1)</script>',
          link: 'javascript:alert(1)',
        }}
      />,
      {wrapper},
    )
    expect(screen.getByText('com.example.article')).toBeTruthy()
    const json = screen.getByText(/"title": "<script>alert\(1\)<\/script>"/)
    expect(json.props.selectable).toBe(true)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(fetchMock).not.toHaveBeenCalled()
  } finally {
    fetchMock.mockRestore()
  }
})
