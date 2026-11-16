import manifest from './roadmap.json'

export type RoadmapFeature = (typeof manifest.features)[number]
export type FeatureState = 'planned' | 'in_progress' | 'completed' | 'blocked'
export type FeatureStatus = {
  state: FeatureState
  integrated: boolean
  released: boolean
  pr: number | null
  prUrl: string | null
}
type PullRequest = {
  number: number
  state: 'open' | 'closed'
  merged_at: string | null
  merge_commit_sha: string | null
  html_url: string
  head: { ref: string }
}
export const roadmap = manifest

function baseline(feature: RoadmapFeature): FeatureStatus {
  return {
    state: feature.baseline.develop ? 'completed' : 'planned',
    integrated: feature.baseline.develop,
    released: feature.baseline.master,
    pr: 'pr' in feature.baseline ? (feature.baseline.pr ?? null) : null,
    prUrl: 'pr' in feature.baseline && feature.baseline.pr
      ? `https://github.com/${roadmap.repository}/pull/${feature.baseline.pr}`
      : null,
  }
}

export function baseStatus(): Record<string, FeatureStatus> {
  return Object.fromEntries(roadmap.features.map(feature => [feature.id, baseline(feature)]))
}
export function percentage(status: Record<string, FeatureStatus>, field: 'integrated' | 'released'): number {
  const total = roadmap.features.reduce((sum, feature) => sum + feature.weight, 0)
  return Math.round(100 * roadmap.features.reduce((sum, feature) =>
    sum + (status[feature.id]?.[field] ? feature.weight : 0), 0) / total)
}

async function githubGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${roadmap.repository}/${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  })
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`)
  return await res.json() as T
}

/**
 * GitHub is authoritative for new features. Future features must use the exact
 * registered branch name and a merged PR to develop. Production requires the
 * merge commit to be an ancestor of master, not merely a closed PR.
 */
export async function refreshFromGithub(signal?: AbortSignal): Promise<Record<string, FeatureStatus>> {
  const pulls = await githubGet<PullRequest[]>('pulls?state=all&base=develop&per_page=100', signal)
  const updated = baseStatus()
  for (const feature of roadmap.features) {
    const matches = pulls.filter(pr => pr.head.ref === feature.branch)
    const merged = matches.find(pr => pr.merged_at !== null && pr.merge_commit_sha)
    if (merged) {
      updated[feature.id] = { state: 'completed', integrated: true,
        released: feature.baseline.master, pr: merged.number, prUrl: merged.html_url }
    } else if (matches.some(pr => pr.state === 'open') && !feature.baseline.develop) {
      updated[feature.id] = { ...updated[feature.id], state: 'in_progress',
        pr: matches[0].number, prUrl: matches[0].html_url }
    }
  }
  // Only newly integrated features need an ancestry check.
  const pending = roadmap.features.filter(feature =>
    updated[feature.id].integrated && !updated[feature.id].released)
  await Promise.all(pending.map(async feature => {
    const mergedPr = pulls.find(pr => pr.number === updated[feature.id].pr)
    if (!mergedPr?.merge_commit_sha) return
    const result = await githubGet<{ status: string }>(
      `compare/${mergedPr.merge_commit_sha}...master`, signal)
    if (result.status === 'ahead' || result.status === 'identical') {
      updated[feature.id].released = true
    }
  }))
  return updated
}
