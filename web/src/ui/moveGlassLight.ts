import type { PointerEvent } from 'react'

/**
 * Update the specular highlight on a handful of selected surfaces only.
 * CSS custom properties avoid React state updates / rerenders for pointer moves.
 * Coarse pointers get a static centered highlight.
 */
export function moveGlassLight(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
  const node = event.currentTarget
  const bounds = node.getBoundingClientRect()
  if (bounds.width <= 0 || bounds.height <= 0) return
  const x = Math.min(100, Math.max(0, (event.clientX - bounds.left) / bounds.width * 100))
  const y = Math.min(100, Math.max(0, (event.clientY - bounds.top) / bounds.height * 100))
  node.style.setProperty('--glass-pointer-x', `${x.toFixed(1)}%`)
  node.style.setProperty('--glass-pointer-y', `${y.toFixed(1)}%`)
}
