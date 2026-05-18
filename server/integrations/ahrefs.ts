// Ahrefs API v3 — https://docs.ahrefs.com/

export interface AhrefsConfig {
  apiKey: string
}

export interface AhrefsDomainData {
  domainRating: number
  backlinks: number
  referringDomains: number
  organicTraffic: number
}

export async function getAhrefsDomainData(
  domain: string,
  config: AhrefsConfig
): Promise<AhrefsDomainData> {
  const target = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)

  const url = new URL('https://api.ahrefs.com/v3/site-explorer/overview')
  url.searchParams.set('target', target)
  url.searchParams.set('date', today)
  url.searchParams.set('volume_mode', 'monthly')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.apiKey}` },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ahrefs API error ${res.status}: ${text}`)
  }

  const json = await res.json() as Record<string, unknown>

  // v3 returns data nested under the target key or directly at root depending on plan
  const data = (json.domain ?? json) as Record<string, unknown>

  return {
    domainRating:    toNum(data.domain_rating ?? data.dr),
    backlinks:       toNum(data.backlinks),
    referringDomains: toNum(data.ref_domains ?? data.referring_domains ?? data.refdomains),
    organicTraffic:  toNum(data.organic_traffic ?? data.org_traffic),
  }
}

function toNum(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}
