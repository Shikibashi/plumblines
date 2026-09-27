import {type JSX} from 'react'

import {useShellLayout} from '#/state/shell/shell-layout'
import {HomeHeaderLayoutMobile} from '#/view/com/home/HomeHeaderLayoutMobile'
import {atoms as a, useBreakpoints, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'

export function HomeHeaderLayout(props: {
  children: React.ReactNode
  tabBarAnchor: JSX.Element | null | undefined
}) {
  const {gtMobile} = useBreakpoints()
  const t = useTheme()
  const {headerHeight} = useShellLayout()
  if (!gtMobile) return <HomeHeaderLayoutMobile {...props} />
  return (
    <>
      {props.tabBarAnchor}
      <Layout.Center
        testID="plumblines-feed-header"
        style={[a.sticky, a.z_10, t.atoms.bg, {top: 0}]}
        onLayout={e => headerHeight.set(e.nativeEvent.layout.height)}>
        {props.children}
      </Layout.Center>
    </>
  )
}
