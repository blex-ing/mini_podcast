import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const data = JSON.parse(readFileSync(resolve('src/data/roadmap.json'), 'utf8'))
const fail = (message) => { throw new Error(message) }
if (data.schemaVersion !== 1) fail('Unknown roadmap schema')
if (!Array.isArray(data.milestones) || !data.milestones.length) fail('No milestones')
if (!Array.isArray(data.features) || !data.features.length) fail('No features')

const ids = new Set()
for (const milestone of data.milestones) {
  if (!milestone.id || ids.has(milestone.id)) fail('Invalid/duplicate milestone')
  ids.add(milestone.id)
}
const featureIds = new Set()
const branches = new Set()
let total = 0
for (const feature of data.features) {
  if (!feature.id || featureIds.has(feature.id)) fail('Duplicate feature ID')
  if (!ids.has(feature.milestone)) fail('Unknown milestone: ' + feature.id)
  if (typeof feature.weight !== 'number' || feature.weight <= 0 || !Number.isFinite(feature.weight)) fail('Invalid weight: ' + feature.id)
  if (!feature.branch?.startsWith('feature/') || branches.has(feature.branch)) fail('Invalid/duplicate branch: ' + feature.branch)
  if (!feature.title || !feature.description || !Array.isArray(feature.acceptance) || !feature.acceptance.length || feature.acceptance.some(x => !x.trim())) fail('Missing feature metadata: ' + feature.id)
  if (!feature.baseline || typeof feature.baseline.develop !== 'boolean' || typeof feature.baseline.master !== 'boolean') fail('Missing baseline: ' + feature.id)
  if (feature.baseline.master && !feature.baseline.develop) fail('Production without develop: ' + feature.id)
  if (feature.baseline.develop && (!Number.isInteger(feature.baseline.pr) || feature.baseline.pr <= 0)) fail('Unverified baseline: ' + feature.id)
  total += feature.weight
  featureIds.add(feature.id)
  branches.add(feature.branch)
}
if (total !== 100) fail('Feature weights must sum to 100; got ' + total)
console.log('Roadmap validated: ' + data.features.length + ' features, ' + total + '% weight, ' + data.milestones.length + ' milestones')
