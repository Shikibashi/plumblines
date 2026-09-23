import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react'
import Svg, {Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export type IconWithSvgMeta = ForwardRefExoticComponent<
  Props & RefAttributes<Svg>
> & {
  svgPaths: string[]
  svgViewBox: string
  svgStrokeWidth: number
}

export function createSinglePathSVG({
  path,
  viewBox,
  strokeWidth = 0,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
}: {
  path: string
  viewBox?: string
  strokeWidth?: number
  strokeLinecap?: 'butt' | 'round' | 'square'
  strokeLinejoin?: 'miter' | 'round' | 'bevel'
}) {
  const Icon = forwardRef<Svg, Props>(function LogoImpl(props, ref) {
    const {fill, size, style, gradient, ...rest} = useCommonSVGProps(props)

    const hasStroke = strokeWidth > 0

    return (
      <Svg
        fill="none"
        {...rest}
        ref={ref}
        viewBox={viewBox ?? '0 0 24 24'}
        width={size}
        height={size}
        style={[style]}>
        {gradient}
        <Path
          fill={hasStroke ? 'none' : fill}
          stroke={hasStroke ? fill : 'none'}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          fillRule="evenodd"
          clipRule="evenodd"
          d={path}
        />
      </Svg>
    )
  }) as IconWithSvgMeta
  Icon.svgPaths = [path]
  Icon.svgViewBox = viewBox || '0 0 24 24'
  Icon.svgStrokeWidth = strokeWidth
  return Icon
}

export function createMultiPathSVG({
  paths,
  viewBox,
}: {
  paths: string[]
  viewBox?: string
}) {
  const Icon = forwardRef<Svg, Props>(function LogoImpl(props, ref) {
    const {fill, size, style, gradient, ...rest} = useCommonSVGProps(props)

    return (
      <Svg
        fill="none"
        {...rest}
        ref={ref}
        viewBox={viewBox ?? '0 0 24 24'}
        width={size}
        height={size}
        style={[style]}>
        {gradient}
        {paths.map((path, i) => (
          <Path
            key={i}
            fill={fill}
            fillRule="evenodd"
            clipRule="evenodd"
            d={path}
          />
        ))}
      </Svg>
    )
  }) as IconWithSvgMeta
  Icon.svgPaths = paths
  Icon.svgViewBox = viewBox || '0 0 24 24'
  Icon.svgStrokeWidth = 0
  return Icon
}
