// Ahrefs API v3 — https://docs.ahrefs.com/

export interface AhrefsConfig {
  apiKey: string
}

export interface AhrefsDomainData {
  domainRating: number
  ahrefsRank: number
  backlinks: number
  referringDomains: number
  organicTraffic: number
  organicKeywords: number
}

export async function getAhrefsDomainData(
  domain: string,
  config: AhrefsConfig
): Promise<AhrefsDomainData> {
  const target = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const date = new Date().toISOString().slice(0, 10)
  const headers = { Authorization: `Bearer ${config.apiKey}` }

  const base = 'https://api.ahrefs.com/v3/site-explorer'
  const params = new URLSearchParams({ target, date })
  const paramsMode = new URLSearchParams({ target, date, mode: 'domain' })

  const [drRes, backlinksRes, metricsRes] = await Promise.all([
    fetch(`${base}/domain-rating?${params}`, { headers }),
    fetch(`${base}/backlinks-stats?${paramsMode}`, { headers }),
    fetch(`${base}/metrics?${paramsMode}`, { headers }),
  ])

  const [drJson, backlinksJson, metricsJson] = await Promise.all([
    drRes.json() as Promise<{ domain_rating?: { domain_rating?: number; ahrefs_rank?: number } }>,
    backlinksRes.json() as Promise<{ metrics?: { live?: number; live_refdomains?: number } }>,
    metricsRes.json() as Promise<{ metrics?: { org_traffic?: number; org_keywords?: number } }>,
  ])

  return {
    domainRating:     toNum(drJson.domain_rating?.domain_rating),
    ahrefsRank:       toNum(drJson.domain_rating?.ahrefs_rank),
    backlinks:        toNum(backlinksJson.metrics?.live),
    referringDomains: toNum(backlinksJson.metrics?.live_refdomains),
    organicTraffic:   toNum(metricsJson.metrics?.org_traffic),
    organicKeywords:  toNum(metricsJson.metrics?.org_keywords),
  }
}

function toNum(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}
