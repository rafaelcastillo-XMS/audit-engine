// Google PageSpeed Insights integration placeholder
// API: https://developers.google.com/speed/docs/insights/v5/get-started

export interface PageSpeedConfig {
  apiKey: string
}

export interface PageSpeedResult {
  performanceScore: number
  lcp: number // ms
  cls: number
  fid: number // ms
  fcp: number // ms
  ttfb: number // ms
}

export async function getPageSpeed(
  url: string,
  config: PageSpeedConfig
): Promise<PageSpeedResult> {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${config.apiKey}&strategy=mobile`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`PageSpeed API error: ${res.status}`)
  const data = await res.json() as { lighthouseResult?: { categories?: { performance?: { score?: number } } } }
  const score = (data.lighthouseResult?.categories?.performance?.score ?? 0) * 100
  return { performanceScore: score, lcp: 0, cls: 0, fid: 0, fcp: 0, ttfb: 0 }
}
