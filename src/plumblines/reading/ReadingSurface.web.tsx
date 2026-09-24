export function ReadingSurface({
  children,
  enabled,
}: React.PropsWithChildren<{enabled: boolean}>) {
  return (
    <div
      style={{display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0}}
      data-plumblines-article={enabled ? 'true' : 'false'}>
      {children}
    </div>
  )
}
