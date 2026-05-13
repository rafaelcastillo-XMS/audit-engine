import * as cheerio from 'cheerio'
import type { RawData } from './types'
import { fetchText } from './fetch-site'

const QUESTION_PATTERN = /^(what|how|why|when|where|who|which|can|does|do|is|are|will|should|could)\b/i

export async function analyzeHtml(html: string, pageUrl: string): Promise<RawData> {
  const $ = cheerio.load(html)
  const origin = new URL(pageUrl).origin

  // Basic meta
  const title = $('title').first().text().trim() || null
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null
  const canonical = $('link[rel="canonical"]').attr('href') || null
  const robotsMeta = $('meta[name="robots"]').attr('content')?.toLowerCase() || null

  // Headings
  const h1s = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean)
  const h2s = $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean)

  // Question headings (AEO signal)
  const allHeadings = [...h1s, ...h2s, ...$('h3').map((_, el) => $(el).text().trim()).get()]
  const questionHeadings = allHeadings.filter(h => QUESTION_PATTERN.test(h.trim()))

  // Open Graph
  const openGraph: Record<string, string> = {}
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr('property')?.replace('og:', '') ?? ''
    const content = $(el).attr('content') ?? ''
    if (prop && content) openGraph[prop] = content
  })

  // Schema JSON-LD
  const schemas: string[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html()?.trim()
    if (raw) schemas.push(raw)
  })

  const hasFaqSchema = schemas.some(s => {
    try { return JSON.stringify(JSON.parse(s)).includes('FAQPage') } catch { return false }
  })

  // Links
  let internalLinks = 0
  let externalLinks = 0
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? ''
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    try {
      const abs = href.startsWith('http') ? href : new URL(href, pageUrl).href
      if (abs.startsWith(origin)) internalLinks++
      else externalLinks++
    } catch {}
  })

  // Word count from body text
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
  const wordCount = bodyText.split(' ').filter(Boolean).length

  // Check robots.txt
  const robotsTxtUrl = `${origin}/robots.txt`
  const robotsTxt = await fetchText(robotsTxtUrl)
  const hasRobotsTxt = robotsTxt !== null && robotsTxt.length > 0

  // Detect AI crawler blocks in robots.txt
  const aiCrawlers = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Bytespider', 'CCBot']
  let aiCrawlerBlocked = false
  if (robotsTxt) {
    const lines = robotsTxt.toLowerCase().split('\n')
    let inDisallowBlock = false
    for (const line of lines) {
      if (aiCrawlers.some(bot => line.includes(`user-agent: ${bot.toLowerCase()}`))) {
        inDisallowBlock = true
      }
      if (inDisallowBlock && line.startsWith('disallow: /')) {
        aiCrawlerBlocked = true
        break
      }
    }
  }

  // Check sitemap
  const sitemapUrls = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`]
  let hasSitemap = false
  for (const sUrl of sitemapUrls) {
    const sm = await fetchText(sUrl)
    if (sm && sm.includes('<urlset') || sm && sm.includes('<sitemapindex')) {
      hasSitemap = true
      break
    }
  }

  // Check llms.txt
  const llmsTxt = await fetchText(`${origin}/llms.txt`)
  const hasLlmsTxt = llmsTxt !== null && llmsTxt.length > 10

  // Trust signals
  const bodyLower = bodyText.toLowerCase()
  const allLinks = $('a[href]').map((_, el) => $(el).attr('href') ?? '').get()
  const hasAuthorInfo = bodyLower.includes('author') || bodyLower.includes('written by') || $('[rel="author"]').length > 0
  const hasContactPage = allLinks.some(h => /contact/i.test(h)) || bodyLower.includes('contact us')
  const hasAboutPage = allLinks.some(h => /about/i.test(h)) || bodyLower.includes('about us')

  return {
    title,
    metaDescription,
    h1s,
    h2s,
    canonical,
    robotsMeta,
    schemas,
    openGraph,
    wordCount,
    internalLinks,
    externalLinks,
    hasRobotsTxt,
    hasSitemap,
    isHttps: pageUrl.startsWith('https://'),
    hasFaqSchema,
    hasLlmsTxt,
    aiCrawlerBlocked,
    hasAuthorInfo,
    hasContactPage,
    hasAboutPage,
    questionHeadings,
    url: pageUrl,
  }
}
