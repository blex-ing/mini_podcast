import { expect, test, type Page } from '@playwright/test'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'iphone', width: 390, height: 844 },
  { name: 'small-mobile', width: 320, height: 740 },
]

async function inspectLayout(page: Page, screenName: string) {
  const body = await page.evaluate(() => {
    const doc = document.documentElement
    return { viewport: innerWidth, fullWidth: doc.scrollWidth }
  })
  expect(body.fullWidth, `${screenName}: horizontal overflow ${body.fullWidth}px / ${body.viewport}px`).toBeLessThanOrEqual(body.viewport + 2)
  const overlaps = await page.evaluate(() => {
    const header = document.querySelector('.nav')
    if (!header) return ['Missing navigation']
    const visible = [...header.querySelectorAll('a')].filter((el) => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    })
    const collisions: string[] = []
    for (let i = 0; i < visible.length; i++) {
      const a = visible[i].getBoundingClientRect()
      for (let j = i + 1; j < visible.length; j++) {
        const b = visible[j].getBoundingClientRect()
        const intersection = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
        if (intersection > 3 && Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom) - 3) {
          collisions.push(`${visible[i].textContent?.trim()} overlaps ${visible[j].textContent?.trim()}`)
        }
      }
    }
    return collisions
  })
  expect(overlaps, `${screenName}: overlapping navigation elements`).toEqual([])
}

for (const viewport of viewports) {
  test(`Studio and Roadmap responsive QA: ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/#estudio', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.panel.editor')).toBeVisible()
    await expect(page.locator('.panel.process')).toBeVisible()
    await inspectLayout(page, viewport.name)
    await page.screenshot({ path: `test-results/visual/studio-${viewport.name}.png`, fullPage: true })
    await page.goto('/#roadmap', { waitUntil: 'networkidle' })
    await expect(page.locator('.roadmap-page')).toBeVisible()
    await expect(page.locator('.roadmap-main-stat')).toBeVisible()
    await inspectLayout(page, viewport.name)
    await page.screenshot({ path: `test-results/visual/roadmap-${viewport.name}.png`, fullPage: true })
    expect(errors, `${viewport.name}: uncaught errors`).toEqual([])
  })
}

test('Equivalent Studio panels share hybrid glass and pointer response', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#estudio', { waitUntil: 'networkidle' })
  const editor = page.locator('.panel.editor')
  const process = page.locator('.panel.process')
  await expect(editor).toHaveClass(/ui-hybrid-glass/)
  await expect(process).toHaveClass(/ui-hybrid-glass/)
  for (const panel of [editor, process]) {
    const box = await panel.boundingBox()
    expect(box).not.toBeNull()
    if (!box) continue
    await page.mouse.move(box.x + box.width * .33, box.y + box.height * .27)
    await expect.poll(() => panel.evaluate(el => (el as HTMLElement).style.getPropertyValue('--glass-pointer-x'))).not.toBe('')
    const styles = await panel.evaluate(el => {
      const st = getComputedStyle(el)
      const before = getComputedStyle(el, '::before')
      return { backdrop: st.backdropFilter || st.webkitBackdropFilter, light: before.backgroundImage }
    })
    expect(styles.backdrop).not.toBe('none')
    expect(styles.light).toContain('radial-gradient')
  }
  await page.screenshot({ path: 'test-results/visual/studio-pointer-desktop.png', fullPage: true })
})

test('Reduced motion keeps pages functional', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#estudio')
  await expect(page.locator('.panel.editor')).toBeVisible()
  await page.goto('/#roadmap')
  await expect(page.locator('.roadmap-page')).toBeVisible()
  await inspectLayout(page, 'reduced-motion-mobile')
})
