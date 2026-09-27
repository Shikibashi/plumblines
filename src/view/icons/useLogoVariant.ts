export type LogoVariant = 'default' | 'japan' | 'kawaii'

/** The fork ships its own mark in every region. */
export function useLogoVariant(_allowVariants = true): LogoVariant {
  return 'default'
}
