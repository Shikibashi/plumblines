import {forwardRef} from 'react'
import {type TextProps} from 'react-native'
import Svg, {Path, type PathProps, type SvgProps} from 'react-native-svg'

import {flatten, useTheme} from '#/alf'
import {PLUMBLINE_PATH} from '#/plumblines/brand'

type Props = {
  allowVariants?: boolean
  fill?: PathProps['fill']
  style?: TextProps['style']
} & Omit<SvgProps, 'style'>

export const Logo = forwardRef<Svg, Props>(function LogoImpl(props, ref) {
  const t = useTheme()
  const {allowVariants: _allowVariants, fill, ...rest} = props
  const styles = flatten(props.style)
  const size = Number(rest.width || 32)
  return (
    <Svg
      {...rest}
      ref={ref}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={styles}>
      <Path
        fill={
          fill === 'sky'
            ? t.palette.primary_500
            : fill || styles?.color || t.palette.primary_500
        }
        d={PLUMBLINE_PATH}
      />
    </Svg>
  )
})
