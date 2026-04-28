// Google PageSpeed Insights API v5
// https://developers.google.com/speed/docs/insights/v5/get-started

export interface PageSpeedResult {
  performanceScore: number  // 0–100
  lcp: number   // Largest Contentful Paint (ms)
  cls: number   // Cumulative Layout Shift (score)
  inp: number   // Interaction to Next Paint (ms)
  fcp: number   // First Contentful Paint (ms)
  ttfb: number  // Time to First Byte (ms)
}

interface PSIResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number }
    }
    audits?: {
      'largest-contentful-paint'?: { numericValue?: number }
      'cumulative-layout-shift'?: { numericValue?: number }
      'interaction-to-next-paint'?: { numericValue?: number }
      'first-contentful-paint'?: { numericValue?: number }
      'server-response-time'?: { numericValue?: number }
    }
  }
}

export async function getPageSpeed(url: string, apiKey: string): Promise<PageSpeedResult> {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`PageSpeed API error: ${res.status}`)

  const data = await res.json() as PSIResponse
  const audits = data.lighthouseResult?.audits ?? {}
  const score = (data.lighthouseResult?.categories?.performance?.score ?? 0) * 100

  return {
    performanceScore: Math.round(score),
    lcp:  Math.round(audits['largest-contentful-paint']?.numericValue ?? 0),
    cls:  Math.round((audits['cumulative-layout-shift']?.numericValue ?? 0) * 1000) / 1000,
    inp:  Math.round(audits['interaction-to-next-paint']?.numericValue ?? 0),
    fcp:  Math.round(audits['first-contentful-paint']?.numericValue ?? 0),
    ttfb: Math.round(audits['server-response-time']?.numericValue ?? 0),
  }
}
