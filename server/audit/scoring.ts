import type { RawData, AuditScores } from './types'

export function calculateScores(data: RawData): AuditScores {
  const seo = calcSeoScore(data)
  const aeo = calcAeoScore(data)
  const geo = calcGeoScore(data)
  const overall = Math.round(seo * 0.4 + aeo * 0.3 + geo * 0.3)

  return { seo, aeo, geo, overall }
}

function calcSeoScore(d: RawData): number {
  let score = 0

  // Title (20 pts)
  if (d.title) {
    score += 10
    const len = d.title.length
    if (len >= 30 && len <= 60) score += 10
    else if (len > 0) score += 5
  }

  // Meta description (15 pts)
  if (d.metaDescription) {
    score += 8
    const len = d.metaDescription.length
    if (len >= 120 && len <= 160) score += 7
    else if (len > 0) score += 3
  }

  // H1 (10 pts)
  if (d.h1s.length === 1) score += 10
  else if (d.h1s.length > 1) score += 5

  // Canonical (10 pts)
  if (d.canonical) score += 10

  // Indexable (10 pts)
  if (!d.robotsMeta || (!d.robotsMeta.includes('noindex') && !d.robotsMeta.includes('none'))) score += 10

  // HTTPS (10 pts)
  if (d.isHttps) score += 10

  // Sitemap (10 pts)
  if (d.hasSitemap) score += 10

  // Robots.txt (5 pts)
  if (d.hasRobotsTxt) score += 5

  // Links (5 pts)
  if (d.internalLinks >= 3) score += 3
  if (d.externalLinks >= 1) score += 2

  // Word count (5 pts)
  if (d.wordCount >= 300) score += 3
  if (d.wordCount >= 700) score += 2

  return Math.min(100, score)
}

function calcAeoScore(d: RawData): number {
  let score = 0

  // FAQ schema (25 pts)
  if (d.hasFaqSchema) score += 25

  // Question headings (20 pts)
  if (d.questionHeadings.length >= 3) score += 20
  else if (d.questionHeadings.length >= 1) score += 10

  // Any schema markup (15 pts)
  if (d.schemas.length > 0) score += 15

  // Content length suggests detailed answers (15 pts)
  if (d.wordCount >= 500) score += 10
  if (d.wordCount >= 1000) score += 5

  // H2s suggest structure (10 pts)
  if (d.h2s.length >= 3) score += 10
  else if (d.h2s.length >= 1) score += 5

  // Open Graph (content clarity signal) (15 pts)
  if (d.openGraph['title']) score += 5
  if (d.openGraph['description']) score += 5
  if (d.openGraph['type']) score += 5

  return Math.min(100, score)
}

function calcGeoScore(d: RawData): number {
  let score = 0

  // llms.txt (20 pts)
  if (d.hasLlmsTxt) score += 20

  // AI crawler accessibility (15 pts)
  if (!d.aiCrawlerBlocked) score += 15

  // Schema presence (20 pts)
  if (d.schemas.length > 0) score += 15
  if (d.hasFaqSchema) score += 5

  // Trust signals (20 pts)
  if (d.hasAuthorInfo) score += 7
  if (d.hasContactPage) score += 7
  if (d.hasAboutPage) score += 6

  // Outbound citations (10 pts)
  if (d.externalLinks >= 3) score += 10
  else if (d.externalLinks >= 1) score += 5

  // Entity/brand clarity via OG (15 pts)
  if (d.openGraph['site_name']) score += 5
  if (d.openGraph['title'] && d.openGraph['description']) score += 10

  return Math.min(100, score)
}
