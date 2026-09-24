import {useMemo} from 'react'
import {useMediaQuery} from 'react-responsive'

export type Breakpoint = 'gtPhone' | 'gtMobile' | 'gtTablet'

export function useBreakpoints(): Record<Breakpoint, boolean> & {
  activeBreakpoint: Breakpoint | undefined
} {
  const gtPhone = useMediaQuery({minWidth: 500})
  const gtMobile = useMediaQuery({minWidth: 980})
  const gtTablet = useMediaQuery({minWidth: 1500})
  return useMemo(() => {
    let active: Breakpoint | undefined
    if (gtTablet) {
      active = 'gtTablet'
    } else if (gtMobile) {
      active = 'gtMobile'
    } else if (gtPhone) {
      active = 'gtPhone'
    }
    return {
      activeBreakpoint: active,
      gtPhone,
      gtMobile,
      gtTablet,
    }
  }, [gtPhone, gtMobile, gtTablet])
}

/**
 * Fine-tuned breakpoints for the shell layout
 */
export function useLayoutBreakpoints() {
  const rightNavVisible = useMediaQuery({minWidth: 1280})
  const centerColumnOffset = useMediaQuery({minWidth: 1280, maxWidth: 1499})
  const leftNavMinimal = useMediaQuery({maxWidth: 1499})

  return {
    rightNavVisible,
    centerColumnOffset,
    leftNavMinimal,
  }
}
