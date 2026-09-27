import Svg, {Text as SvgText} from 'react-native-svg'

import {PLUMBLINE_PATH} from '#/plumblines/brand'
import {APP_CONFIG} from '#/plumblines/config'
import {type Props, useCommonSVGProps} from './common'
import {createSinglePathSVG} from './TEMPLATE'

export const Mark = createSinglePathSVG({path: PLUMBLINE_PATH})

export function Full(
  props: Omit<Props, 'fill' | 'size' | 'height'> & {
    markFill?: Props['fill']
    textFill?: Props['fill']
  },
) {
  const {fill, size, style, gradient, ...rest} = useCommonSVGProps(props)
  return (
    <Svg
      {...rest}
      viewBox="0 0 280 42"
      width={size}
      height={(size * 42) / 280}
      style={style}>
      {gradient}
      <SvgText
        x="0"
        y="33"
        fill={props.textFill ?? fill}
        fontFamily="Georgia"
        fontWeight="bold"
        fontSize="37"
        textLength="278"
        lengthAdjust="spacingAndGlyphs">
        {APP_CONFIG.name.toUpperCase()}
      </SvgText>
    </Svg>
  )
}
