import type { HTMLAttributes } from 'react'
import { moveGlassLight } from './moveGlassLight'

type HybridGlassSurfaceProps = HTMLAttributes<HTMLDivElement>

/**
 * Shared interactive glass surface: every sibling panel using this primitive
 * receives the same backdrop, rim lighting and cursor response.
 */
export function HybridGlassSurface({ className = '', onPointerMove, ...props }: HybridGlassSurfaceProps) {
  return (
    <div
      {...props}
      className={['ui-hybrid-glass', className].filter(Boolean).join(' ')}
      onPointerMove={event => {
        moveGlassLight(event)
        onPointerMove?.(event)
      }}
    />
  )
}
