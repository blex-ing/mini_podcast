import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative, join } from 'node:path'

const root = resolve('src')
const tokenFile = resolve('src/styles/tokens.css')
const tokens = readFileSync(tokenFile, 'utf8')
const registered = new Set([...tokens.matchAll(/(?:^|[;{\n])\s*(--[\w-]+)\s*:/g)].map(x => x[1]))
const errors = []

function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, item.name)
    if (item.isDirectory()) walk(file)
    else if (/\.(css|tsx|ts)$/.test(item.name) && file !== tokenFile) inspect(file)
  }
}
function inspect(file) {
  const source = readFileSync(file, 'utf8')
  const rel = relative(resolve('.'), file)
  const colorLiterals = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab|lch|hwb)\s*\(/g
  for (const match of source.matchAll(colorLiterals)) {
    const line = source.slice(0, match.index).split('\n').length
    errors.push(`${rel}:${line}: color literal ${match[0]} — use a semantic token from styles/tokens.css`)
  }
  const namedColors = /(?:^|[;{])\s*(?:background(?:-color)?|color|border-color)\s*:\s*(red|blue|green|white|black|pink|purple|gray|grey|orange|yellow)\s*(?:[;}])/gi
  for (const match of source.matchAll(namedColors)) {
    errors.push(`${rel}: named CSS color ${match[1]}; use a token instead`)
  }
  if (file.endsWith('.css')) {
    for (const match of source.matchAll(/border-radius\s*:\s*([^;}]+)/g)) {
      const value = match[1].trim()
      if (!/^(?:var\(--radius-[\w-]+\)|50%|inherit)$/.test(value)) {
        errors.push(`${rel}: border-radius must use a canonical --radius-* token; got ${value}`)
      }
    }
    for (const match of source.matchAll(/box-shadow\s*:\s*([^;}]+)/g)) {
      const value = match[1].trim()
      if (!/^(?:var\(--shadow-[\w-]+\)|none)$/.test(value)) {
        errors.push(`${rel}: box-shadow must use a canonical --shadow-* token; got ${value}`)
      }
    }
    for (const match of source.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (/^--(?:color|palette|radius|font|space|shadow|glass|motion|layout)-/.test(match[1]) && !registered.has(match[1])) {
        errors.push(`${rel}: unknown design token ${match[1]}`)
      }
    }
  }
}
walk(root)
if (errors.length) {
  console.error('Design system violations:\n' + errors.join('\n'))
  process.exit(1)
}
console.log(`Design system validated: ${registered.size} canonical tokens, no unregistered colors.`)
