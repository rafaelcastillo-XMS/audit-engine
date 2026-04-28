import type { RawData, AuditFinding, PageSpeedResult } from './types'

let _id = 0
const id = (prefix: string) => `${prefix}-${++_id}`

export function generateFindings(data: RawData): AuditFinding[] {
  _id = 0
  const findings: AuditFinding[] = []

  // ─── SEO ──────────────────────────────────────────────────────────────────

  if (!data.title) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Missing Title Tag',
      description: 'No <title> tag found on this page.',
      recommendation: 'Add a descriptive title tag between 30–60 characters that includes your primary keyword.',
      impact: 'high',
    })
  } else if (data.title.length < 30) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Title Tag Too Short',
      description: `Title is only ${data.title.length} characters. Google typically shows 50–60 characters.`,
      recommendation: 'Expand your title to include the main keyword and brand name (50–60 chars).',
      impact: 'medium',
    })
  } else if (data.title.length > 70) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Title Tag Too Long',
      description: `Title is ${data.title.length} characters and may be truncated in SERPs.`,
      recommendation: 'Shorten your title to under 60 characters while keeping the main keyword.',
      impact: 'low',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Title Tag Found', description: `Title: "${data.title}"`, impact: 'high' })
  }

  if (!data.metaDescription) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Missing Meta Description',
      description: 'No meta description found. This tag is a key click-through-rate driver in search results.',
      recommendation: 'Add a compelling meta description (120–160 chars) with your primary keyword and a CTA.',
      impact: 'high',
    })
  } else {
    const len = data.metaDescription.length
    if (len < 120 || len > 160) {
      findings.push({
        id: id('seo'),
        category: 'seo',
        severity: 'warning',
        title: 'Meta Description Length Off',
        description: `Meta description is ${len} characters (ideal: 120–160).`,
        recommendation: len < 120 ? 'Expand to describe the page value more completely.' : 'Trim to avoid truncation in search results.',
        impact: 'medium',
      })
    } else {
      findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Meta Description OK', description: `${len} characters — within ideal range.`, impact: 'medium' })
    }
  }

  if (data.h1s.length === 0) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Missing H1 Tag',
      description: 'No H1 heading found. Every page should have exactly one H1.',
      recommendation: 'Add a single H1 that clearly describes the page topic and includes the primary keyword.',
      impact: 'high',
    })
  } else if (data.h1s.length > 1) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Multiple H1 Tags',
      description: `Found ${data.h1s.length} H1 tags. Best practice is exactly one.`,
      recommendation: 'Consolidate to one H1. Use H2–H6 for subheadings.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Single H1 Found', description: `"${data.h1s[0]}"`, impact: 'high' })
  }

  if (!data.canonical) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'No Canonical Tag',
      description: 'Missing canonical URL. This can cause duplicate content issues.',
      recommendation: 'Add <link rel="canonical" href="…"> pointing to the preferred URL for this page.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Canonical Tag Present', description: data.canonical, impact: 'medium' })
  }

  if (data.robotsMeta && (data.robotsMeta.includes('noindex') || data.robotsMeta.includes('none'))) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Page Blocked from Indexing',
      description: `robots meta tag contains "${data.robotsMeta}" — this page will not be indexed.`,
      recommendation: 'Remove noindex if this page should appear in search results.',
      impact: 'high',
    })
  }

  if (!data.isHttps) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Not Served Over HTTPS',
      description: 'The page is using HTTP, which is a ranking factor and user trust issue.',
      recommendation: 'Install an SSL certificate and force HTTPS site-wide.',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'HTTPS Enabled', description: 'Page is securely served.', impact: 'high' })
  }

  if (!data.hasSitemap) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'No XML Sitemap Found',
      description: 'Could not find sitemap.xml at the root. This helps search engines discover all pages.',
      recommendation: 'Generate and submit an XML sitemap to Google Search Console.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Sitemap Found', description: 'XML sitemap detected.', impact: 'medium' })
  }

  if (!data.hasRobotsTxt) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'info',
      title: 'No robots.txt Found',
      description: 'A robots.txt file could not be located.',
      recommendation: 'Create a robots.txt file to guide crawlers and reference your sitemap.',
      impact: 'low',
    })
  }

  if (data.wordCount < 300) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Low Word Count',
      description: `Only ~${data.wordCount} words detected. Thin content may rank poorly.`,
      recommendation: 'Expand the page with useful, keyword-relevant content (aim for 500+ words).',
      impact: 'medium',
    })
  }

  // ─── AEO ──────────────────────────────────────────────────────────────────

  if (!data.hasFaqSchema) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'warning',
      title: 'No FAQ Schema Markup',
      description: 'FAQ structured data was not found. This is a key AEO signal for featured snippets.',
      recommendation: 'Add FAQPage JSON-LD schema to any page with Q&A content.',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('aeo'), category: 'aeo', severity: 'pass', title: 'FAQ Schema Detected', description: 'FAQPage structured data found.', impact: 'high' })
  }

  if (data.questionHeadings.length === 0) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'warning',
      title: 'No Question-Based Headings',
      description: 'No headings phrased as questions. These are prime featured-snippet candidates.',
      recommendation: 'Rewrite some H2/H3 tags as questions users actually search (e.g. "How does X work?").',
      impact: 'high',
    })
  } else {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'pass',
      title: `${data.questionHeadings.length} Question Heading(s) Found`,
      description: data.questionHeadings.slice(0, 3).join(' · '),
      impact: 'high',
    })
  }

  if (data.schemas.length === 0) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'warning',
      title: 'No Structured Data at All',
      description: 'No JSON-LD or schema markup found. Structured data dramatically improves AEO.',
      recommendation: 'Add at minimum: Organization, WebPage, and BreadcrumbList schemas.',
      impact: 'high',
    })
  }

  if (data.h2s.length < 2) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'info',
      title: 'Low Content Hierarchy',
      description: `Only ${data.h2s.length} H2 headings detected. Clear structure aids AEO and readability.`,
      recommendation: 'Break content into clear sections with descriptive H2/H3 headings.',
      impact: 'medium',
    })
  }

  // ─── GEO ──────────────────────────────────────────────────────────────────

  if (!data.hasLlmsTxt) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No llms.txt File',
      description: 'llms.txt is an emerging standard that helps LLMs understand your site. Not found.',
      recommendation: 'Create a /llms.txt file describing your brand, offerings, and preferred citation format.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('geo'), category: 'geo', severity: 'pass', title: 'llms.txt Found', description: 'AI readiness signal present.', impact: 'medium' })
  }

  if (data.aiCrawlerBlocked) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'critical',
      title: 'AI Crawlers Blocked in robots.txt',
      description: 'One or more AI crawlers (GPTBot, ClaudeBot, etc.) appear to be blocked.',
      recommendation: 'Review robots.txt and allow major AI crawlers if you want to appear in AI-generated answers.',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('geo'), category: 'geo', severity: 'pass', title: 'AI Crawlers Accessible', description: 'No AI crawler blocks detected.', impact: 'high' })
  }

  if (!data.hasAuthorInfo) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No Author Attribution',
      description: 'No author information detected. Trust signals matter for AI citation ranking.',
      recommendation: 'Add author bylines, bios, and link to author profiles.',
      impact: 'medium',
    })
  }

  if (!data.hasContactPage) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No Contact Page Detected',
      description: 'Contact page link not found. This is a basic trust signal for AI and search.',
      recommendation: 'Ensure a Contact page is linked in your main navigation.',
      impact: 'low',
    })
  }

  if (!data.hasAboutPage) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No About Page Detected',
      description: 'About page link not found. Brand entity clarity is key for GEO.',
      recommendation: 'Add an About page that clearly describes your brand, team, and mission.',
      impact: 'medium',
    })
  }

  if (data.externalLinks < 2) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'Few External Citations',
      description: `Only ${data.externalLinks} outbound links found. Citing authoritative sources increases citation-worthiness.`,
      recommendation: 'Link to authoritative external sources to signal credibility to AI models.',
      impact: 'low',
    })
  }

  if (data.schemas.length > 0 && !data.hasFaqSchema) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'Schema Present But No FAQ',
      description: 'Some structured data found, but FAQPage schema is missing.',
      recommendation: 'Add FAQPage schema to pages with Q&A content for better AI answer extraction.',
      impact: 'medium',
    })
  }

  return findings
}

// Google's Core Web Vitals thresholds
// LCP: good <2500ms, poor >4000ms
// CLS: good <0.1,   poor >0.25
// INP: good <200ms, poor >500ms
// FCP: good <1800ms, poor >3000ms
// TTFB: good <800ms, poor >1800ms
export function generatePageSpeedFindings(ps: PageSpeedResult): AuditFinding[] {
  const findings: AuditFinding[] = []

  if (ps.performanceScore < 50) {
    findings.push({
      id: 'psi-score',
      category: 'seo',
      severity: 'critical',
      title: `Poor Performance Score (${ps.performanceScore}/100)`,
      description: 'Google PageSpeed score is critically low. Page speed is a confirmed ranking factor.',
      recommendation: 'Run a full Lighthouse audit and address the top opportunities — typically image optimization, render-blocking scripts, and server response time.',
      impact: 'high',
    })
  } else if (ps.performanceScore < 90) {
    findings.push({
      id: 'psi-score',
      category: 'seo',
      severity: 'warning',
      title: `Performance Needs Improvement (${ps.performanceScore}/100)`,
      description: 'PageSpeed score has room for improvement. Faster pages rank better and convert more.',
      recommendation: 'Review PageSpeed Insights for specific opportunities. Focus on LCP and TTFB first.',
      impact: 'medium',
    })
  } else {
    findings.push({
      id: 'psi-score',
      category: 'seo',
      severity: 'pass',
      title: `Strong Performance Score (${ps.performanceScore}/100)`,
      description: 'Page loads fast on mobile — a positive ranking signal.',
      impact: 'high',
    })
  }

  if (ps.lcp > 4000) {
    findings.push({
      id: 'psi-lcp',
      category: 'seo',
      severity: 'critical',
      title: `LCP Critical: ${(ps.lcp / 1000).toFixed(1)}s`,
      description: 'Largest Contentful Paint is above 4s. This is a Core Web Vital and a direct ranking factor.',
      recommendation: 'Optimize your hero image (use WebP, add preload), reduce server response time, and eliminate render-blocking resources.',
      impact: 'high',
    })
  } else if (ps.lcp > 2500) {
    findings.push({
      id: 'psi-lcp',
      category: 'seo',
      severity: 'warning',
      title: `LCP Needs Improvement: ${(ps.lcp / 1000).toFixed(1)}s`,
      description: 'Largest Contentful Paint is between 2.5s–4s. Google target is under 2.5s.',
      recommendation: 'Preload the LCP image element and ensure your server responds in under 600ms.',
      impact: 'high',
    })
  }

  if (ps.cls > 0.25) {
    findings.push({
      id: 'psi-cls',
      category: 'seo',
      severity: 'critical',
      title: `CLS Critical: ${ps.cls}`,
      description: 'Cumulative Layout Shift is very high — page elements are jumping around as it loads.',
      recommendation: 'Set explicit width/height on images and embeds. Avoid inserting content above existing content after load.',
      impact: 'high',
    })
  } else if (ps.cls > 0.1) {
    findings.push({
      id: 'psi-cls',
      category: 'seo',
      severity: 'warning',
      title: `CLS Needs Improvement: ${ps.cls}`,
      description: 'Layout shifts detected. Google target is CLS under 0.1.',
      recommendation: 'Add size attributes to all images and reserve space for dynamic content (ads, embeds).',
      impact: 'medium',
    })
  }

  if (ps.ttfb > 1800) {
    findings.push({
      id: 'psi-ttfb',
      category: 'seo',
      severity: 'critical',
      title: `TTFB Critical: ${ps.ttfb}ms`,
      description: 'Server is taking over 1.8s to send the first byte. Likely slow hosting or no caching.',
      recommendation: 'Upgrade hosting, enable server-side caching, or use a CDN (Cloudflare). Target is under 800ms.',
      impact: 'high',
    })
  } else if (ps.ttfb > 800) {
    findings.push({
      id: 'psi-ttfb',
      category: 'seo',
      severity: 'warning',
      title: `TTFB Slow: ${ps.ttfb}ms`,
      description: 'Server response time is above 800ms. This delays every other resource on the page.',
      recommendation: 'Enable caching headers, use a CDN, or consider a faster hosting provider.',
      impact: 'medium',
    })
  }

  if (ps.inp > 500) {
    findings.push({
      id: 'psi-inp',
      category: 'seo',
      severity: 'critical',
      title: `INP Critical: ${ps.inp}ms`,
      description: 'Interaction to Next Paint is above 500ms — the page feels unresponsive to user input.',
      recommendation: 'Reduce JavaScript execution time. Break up long tasks and defer non-critical scripts.',
      impact: 'high',
    })
  } else if (ps.inp > 200) {
    findings.push({
      id: 'psi-inp',
      category: 'seo',
      severity: 'warning',
      title: `INP Needs Improvement: ${ps.inp}ms`,
      description: 'Interaction to Next Paint is between 200ms–500ms. Target is under 200ms.',
      recommendation: 'Profile JavaScript with Chrome DevTools and defer or remove heavy scripts.',
      impact: 'medium',
    })
  }

  return findings
}

export function buildExecutiveSummary(data: RawData, scores: { seo: number; aeo: number; geo: number; overall: number }): string {
  const domain = new URL(data.url).hostname
  const level = scores.overall >= 70 ? 'decent' : scores.overall >= 50 ? 'moderate' : 'significant'
  const seoNote = scores.seo < 60 ? 'Technical SEO fundamentals need attention. ' : ''
  const aeoNote = scores.aeo < 60 ? 'AEO optimization is lacking — structured data and Q&A content should be prioritized. ' : ''
  const geoNote = scores.geo < 60 ? 'GEO readiness is low — the site may not be visible in AI-generated answers. ' : ''
  return `${domain} shows ${level} search and AI visibility. ${seoNote}${aeoNote}${geoNote}With targeted improvements, this site can significantly increase its presence in both traditional search and AI-generated responses.`.trim()
}
