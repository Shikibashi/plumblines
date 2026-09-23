import Svg, {type PathProps, type SvgProps, Text} from 'react-native-svg'

import {useTheme} from '#/alf'
import {APP_CONFIG} from '#/plumblines/config'

export function Logotype({
  fill,
  ...rest
}: {fill?: PathProps['fill']} & SvgProps) {
  const t = useTheme()
  const size = Number(rest.width || 160)
  return (
    <Svg {...rest} viewBox="0 0 280 42" width={size} height={(size * 42) / 280}>
      <Text
        x="0"
        y="33"
        fill={fill || t.atoms.text.color}
        fontFamily="Georgia"
        fontWeight="bold"
        fontSize="37"
        textLength="278"
        lengthAdjust="spacingAndGlyphs">
        {APP_CONFIG.name.toUpperCase()}
      </Text>
    </Svg>
  )
}
