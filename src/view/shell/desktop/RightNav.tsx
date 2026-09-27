import {View} from 'react-native'

import {atoms as a, useLayoutBreakpoints, web} from '#/alf'
import {CENTER_COLUMN_OFFSET, CENTER_COLUMN_WIDTH} from '#/components/Layout'
import {FeedContext} from '#/plumblines/components/FeedContext'
import {DesktopSearch} from './Search'

export function DesktopRightNav({routeName}: {routeName: string}) {
  const {rightNavVisible, centerColumnOffset} = useLayoutBreakpoints()
  if (
    !rightNavVisible ||
    routeName.startsWith('Messages') ||
    routeName === 'Home' ||
    routeName === 'Start'
  )
    return null
  return (
    <View
      testID="plumblines-right-nav"
      style={[
        a.gap_sm,
        web({
          position: 'fixed',
          left: '50%',
          width: centerColumnOffset ? 270 : 320,
          padding: 14,
          transform: [
            {
              translateX:
                CENTER_COLUMN_WIDTH / 2 +
                (centerColumnOffset ? CENTER_COLUMN_OFFSET : 0),
            },
            ...a.scrollbar_offset.transform,
          ],
        }),
      ]}>
      {routeName !== 'Search' && <DesktopSearch />}
      <FeedContext routeName={routeName} />
    </View>
  )
}
