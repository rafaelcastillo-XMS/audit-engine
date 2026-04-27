import https from 'https'
import http from 'http'

export interface FetchResult {
  html: string
  finalUrl: string
  statusCode: number
  ok: boolean
  error?: string
}

const USER_AGENT =
  'Mozilla/5.0 (compatible; XMSAuditBot/1.0; +https://xperienceaimarketing.com)'

export async function fetchSite(url: string): Promise<FetchResult> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https://') ? https : http
    const options = { headers: { 'User-Agent': USER_AGENT }, timeout: 15000 }

    const req = protocol.get(url, options, (res) => {
      const statusCode = res.statusCode ?? 0
      let finalUrl = url

      if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
        const location = res.headers.location
        const redirect = location.startsWith('http') ? location : new URL(location, url).href
        fetchSite(redirect).then(resolve).catch(() => resolve({ html: '', finalUrl: url, statusCode, ok: false, error: 'Redirect failed' }))
        req.destroy()
        return
      }

      if (statusCode !== 200) {
        resolve({ html: '', finalUrl, statusCode, ok: false, error: `HTTP ${statusCode}` })
        return
      }

      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        resolve({ html: Buffer.concat(chunks).toString('utf8'), finalUrl, statusCode, ok: true })
      })
      res.on('error', (err: Error) => resolve({ html: '', finalUrl, statusCode: 0, ok: false, error: err.message }))
    })

    req.on('timeout', () => {
      req.destroy()
      resolve({ html: '', finalUrl: url, statusCode: 0, ok: false, error: 'Request timed out' })
    })

    req.on('error', (err: Error) => {
      resolve({ html: '', finalUrl: url, statusCode: 0, ok: false, error: err.message })
    })
  })
}

export async function fetchText(url: string): Promise<string | null> {
  try {
    const result = await fetchSite(url)
    return result.ok ? result.html : null
  } catch {
    return null
  }
}
