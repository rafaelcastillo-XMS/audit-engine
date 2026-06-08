// Ahrefs API v3 — https://docs.ahrefs.com/

export interface AhrefsConfig {
  apiKey: string
}

export interface AhrefsDomainData {
  domainRating: number
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
  const paramsUS = new URLSearchParams({ target, date, mode: 'domain', country: 'US' })

  const [drRes, backlinksRes, metricsRes] = await Promise.all([
    fetch(`${base}/domain-rating?${params}`, { headers }),
    fetch(`${base}/backlinks-stats?${paramsMode}`, { headers }),
    fetch(`${base}/metrics-by-country?${paramsUS}`, { headers }),
  ])

  const [drJson, backlinksJson, metricsJson] = await Promise.all([
    drRes.json() as Promise<{ domain_rating?: { domain_rating?: number } }>,
    backlinksRes.json() as Promise<{ metrics?: { live?: number; live_refdomains?: number } }>,
    metricsRes.json() as Promise<{ metrics?: Array<{ org_traffic?: number; org_keywords?: number }> }>,
  ])

  const usMetrics = metricsJson.metrics?.[0]

  return {
    domainRating:     toNum(drJson.domain_rating?.domain_rating),
    backlinks:        toNum(backlinksJson.metrics?.live),
    referringDomains: toNum(backlinksJson.metrics?.live_refdomains),
    organicTraffic:   toNum(usMetrics?.org_traffic),
    organicKeywords:  toNum(usMetrics?.org_keywords),
  }
}

function toNum(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}
