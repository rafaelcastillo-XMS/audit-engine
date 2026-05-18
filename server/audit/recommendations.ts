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
      description: 'No <title> tag was detected on this page. The title tag is the single most important on-page SEO element — it is the primary signal search engines use to understand a page\'s topic and the first thing users see in search results. Without it, Google will generate an arbitrary title that may be misleading or irrelevant, resulting in dramatically lower click-through rates and weakened ranking potential across all target keywords.',
      recommendation: 'Add a descriptive title tag between 50–60 characters that leads with the primary keyword and ends with the brand name.',
      impact: 'high',
    })
  } else if (data.title.length < 30) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Title Tag Too Short',
      description: `The page title is only ${data.title.length} characters long — well below Google's ideal range of 50–60 characters. A short title fails to fully communicate the page's value proposition to both search engines and users. This leaves ranking potential on the table, as the title cannot incorporate secondary keywords or a compelling hook that drives clicks from the search results page.`,
      recommendation: 'Expand your title to 50–60 characters, incorporating the primary keyword, a secondary modifier, and the brand name.',
      impact: 'medium',
    })
  } else if (data.title.length > 70) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Title Tag Too Long',
      description: `The page title is ${data.title.length} characters — longer than Google's ~60-character display limit. Titles that exceed this threshold are truncated in search results with an ellipsis ("…"), cutting off key information and making the listing look incomplete. This reduces user confidence and click-through rates, as users cannot read the full context of what the page offers before deciding to visit.`,
      recommendation: 'Shorten the title to under 60 characters. Prioritize the primary keyword at the start and remove filler words.',
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
      description: 'No meta description was found on this page. While not a direct ranking factor, the meta description is the primary copy shown beneath the title in search results — it is a critical driver of click-through rate (CTR). Without it, Google auto-generates a snippet from whatever text it finds on the page, which is often irrelevant and fails to convert searchers into visitors. A well-crafted meta description can increase organic CTR by 5–10%, directly impacting traffic without any ranking change.',
      recommendation: 'Write a compelling meta description of 120–160 characters that includes the primary keyword, communicates a clear value proposition, and ends with a call to action.',
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
        description: `The meta description is ${len} characters, outside the ideal 120–160 character range. ${len < 120 ? 'A description this short leaves valuable space unused — it fails to fully sell the page\'s content to the user and may result in Google replacing it with auto-generated text. More persuasive copy could measurably improve click-through rates from search results.' : 'A description this long will be truncated by Google, cutting off the message mid-sentence and potentially leaving the listing looking unprofessional or confusing to searchers.'}`,
        recommendation: len < 120 ? 'Expand the description to clearly articulate the page\'s unique value, include the primary keyword, and end with a CTA.' : 'Trim the description to under 160 characters, front-loading the most important information.',
        impact: 'medium',
      })
    } else {
      findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Meta Description OK', description: `${len} characters — within the ideal range.`, impact: 'medium' })
    }
  }

  if (data.h1s.length === 0) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Missing H1 Tag',
      description: 'No H1 heading was found on this page. The H1 is the most semantically important heading on a page — it tells search engines and users what the primary topic is. Pages without an H1 are consistently outranked by competitors who use one correctly, because search algorithms interpret the absence as a signal of poor structure and low content authority. Screen readers also rely on H1 for navigation, making this an accessibility issue as well.',
      recommendation: 'Add exactly one H1 tag that clearly states the page\'s primary topic, includes the target keyword, and appears near the top of the page.',
      impact: 'high',
    })
  } else if (data.h1s.length > 1) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Multiple H1 Tags',
      description: `${data.h1s.length} H1 headings were found on this page — best practice is exactly one. Multiple H1 tags dilute the topical signal you send to search engines, making it harder for them to determine the page's primary subject. This can weaken rankings for your target keyword and create confusion for screen readers navigating the page, which may also impact accessibility compliance scores.`,
      recommendation: 'Keep only the most important H1 that reflects the page\'s core topic. Convert remaining H1s to H2 or H3 tags.',
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
      description: 'This page does not specify a canonical URL. Without a canonical tag, search engines may independently discover multiple URLs serving similar or identical content (e.g., with/without trailing slashes, query parameters, or HTTP/HTTPS variations) and split ranking signals across them. This "link equity dilution" weakens the authority of the page you actually want to rank, and can result in the wrong version appearing in search results.',
      recommendation: 'Add <link rel="canonical" href="[preferred-url]"> in the <head> of every page, pointing to the definitive version of that URL.',
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
      description: `A robots meta tag containing "${data.robotsMeta}" was detected on this page. This directive explicitly tells search engines not to index this page — meaning it will not appear in search results under any circumstances. If this is unintentional, it is causing this page to receive zero organic traffic regardless of how well-optimized the content is. This is one of the most damaging SEO errors a site can have, and it is invisible to users browsing the site.`,
      recommendation: 'If this page should appear in search results, remove the noindex directive immediately. If intentional, ensure it is only applied to pages that should genuinely remain private.',
      impact: 'high',
    })
  }

  if (!data.isHttps) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'critical',
      title: 'Not Served Over HTTPS',
      description: 'This page is being served over HTTP rather than HTTPS. Google has used HTTPS as a confirmed ranking signal since 2014, giving a measurable edge to secure sites. Beyond rankings, modern browsers label HTTP sites as "Not Secure," which erodes user trust and dramatically increases bounce rates — particularly on pages that handle any form submission, login, or payment. This is a fundamental technical requirement that affects both credibility and SEO performance.',
      recommendation: 'Install an SSL/TLS certificate (free via Let\'s Encrypt) and configure the server to redirect all HTTP traffic to HTTPS permanently (301 redirect).',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'HTTPS Enabled', description: 'The page is securely served over HTTPS — a confirmed Google ranking signal.', impact: 'high' })
  }

  if (!data.hasSitemap) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'No XML Sitemap Found',
      description: 'No sitemap.xml file was detected at the root of this domain. An XML sitemap is the primary mechanism by which you communicate your site\'s full content inventory to search engine crawlers. Without one, Googlebot must discover all pages through link-following alone — a process that frequently misses newer content, orphaned pages, or pages with few internal links. This means valuable pages may never be indexed or may take significantly longer to appear in search results.',
      recommendation: 'Generate an XML sitemap that includes all indexable URLs and submit it to Google Search Console and Bing Webmaster Tools.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('seo'), category: 'seo', severity: 'pass', title: 'Sitemap Found', description: 'An XML sitemap was detected — helping search engines discover and index all pages efficiently.', impact: 'medium' })
  }

  if (!data.hasRobotsTxt) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'info',
      title: 'No robots.txt Found',
      description: 'A robots.txt file could not be located. While not strictly required, robots.txt provides explicit instructions to search engine crawlers about which sections of the site to crawl and which to skip. Without it, crawlers use their defaults, which may waste crawl budget on low-value pages (admin areas, duplicate URL patterns) at the expense of high-value content pages that need to be indexed quickly.',
      recommendation: 'Create a robots.txt file at the root of the domain. Reference your sitemap URL and disallow crawling of any non-public directories.',
      impact: 'low',
    })
  }

  if (data.wordCount < 300) {
    findings.push({
      id: id('seo'),
      category: 'seo',
      severity: 'warning',
      title: 'Low Word Count — Thin Content',
      description: `Only approximately ${data.wordCount} words were detected on this page. Search engines categorize pages with fewer than 300 words as "thin content" — a pattern historically associated with low-quality sites. Thin pages receive less authority, rank for fewer keyword variations, and are far less likely to earn backlinks or social shares. In competitive niches, pages with 1,000–2,000+ words on well-researched topics consistently outrank shorter alternatives, as depth signals expertise and comprehensiveness to both algorithms and readers.`,
      recommendation: 'Substantially expand the page content with useful, keyword-relevant information. Aim for at least 500 words, ideally 800+, covering the topic with genuine depth.',
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
      description: 'FAQPage structured data was not found on this page. FAQ schema is one of the most powerful AEO signals available — it directly tells AI answer engines and Google\'s Featured Snippets system the exact questions your page answers. Without it, even well-written Q&A content is frequently overlooked by AI systems that prefer explicitly structured data. Competitors using FAQ schema have a significant advantage in appearing in voice search results, AI overviews, and rich answer boxes.',
      recommendation: 'Implement FAQPage JSON-LD schema on any page containing question-and-answer content. Ensure questions match actual user search queries.',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('aeo'), category: 'aeo', severity: 'pass', title: 'FAQ Schema Detected', description: 'FAQPage structured data is present — a strong signal for featured snippets and AI-generated answers.', impact: 'high' })
  }

  if (data.questionHeadings.length === 0) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'warning',
      title: 'No Question-Based Headings',
      description: 'No headings phrased as direct questions were detected on this page. Question-format headings (H2/H3 starting with "What," "How," "Why," "When," etc.) are prime candidates for Google Featured Snippets and AI answer extraction. Answer engines like ChatGPT and Perplexity specifically look for content structured around questions to source their responses. Pages without question headings are almost never selected as the source for an AI-generated answer, regardless of how relevant their content is.',
      recommendation: 'Restructure 3–5 key headings as the actual questions your target audience searches. Follow each with a direct, concise answer in the first 1–2 sentences beneath it.',
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
      title: 'No Structured Data Found',
      description: 'No JSON-LD or schema markup of any kind was detected on this page. Structured data is the universal language that bridges the gap between your content and how AI systems understand it. Without schema, AI models must guess at the context of your content, frequently misinterpreting or ignoring it. Sites with comprehensive structured data (Organization, WebPage, BreadcrumbList, Product, FAQ, etc.) are consistently better represented in AI-generated answers, knowledge panels, and rich search results.',
      recommendation: 'Implement at minimum: Organization schema (brand details), WebPage schema (page context), and BreadcrumbList schema (site hierarchy). Add entity-specific schemas as relevant.',
      impact: 'high',
    })
  }

  if (data.h2s.length < 2) {
    findings.push({
      id: id('aeo'),
      category: 'aeo',
      severity: 'info',
      title: 'Weak Content Hierarchy',
      description: `Only ${data.h2s.length} H2 heading${data.h2s.length === 1 ? ' was' : 's were'} detected on this page. A clear heading hierarchy (H1 → H2 → H3) is critical for both AEO and readability. AI systems use heading structure to understand how content is organized and to extract specific answers to specific questions. Pages with well-segmented content are significantly more likely to be selected as sources for AI-generated responses, as they make it easy for the system to locate and cite the relevant section.`,
      recommendation: 'Organize content into clearly titled sections using H2 and H3 headings. Each section should address a distinct subtopic or question relevant to the page\'s main theme.',
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
      description: 'No llms.txt file was found at the root of this domain. This emerging standard (modeled after robots.txt) allows website owners to explicitly guide how AI language models should interpret, cite, and interact with their content. Early adoption signals forward-thinking AI readiness and ensures your brand narrative is presented to AI systems on your own terms, rather than being constructed from fragmented page data. As this standard gains adoption, its absence will increasingly disadvantage sites in AI-driven discovery channels.',
      recommendation: 'Create a /llms.txt file describing your brand, core offerings, preferred citation format, and key pages. Keep it concise and structured for machine consumption.',
      impact: 'medium',
    })
  } else {
    findings.push({ id: id('geo'), category: 'geo', severity: 'pass', title: 'llms.txt Found', description: 'An llms.txt file is present — a positive AI readiness signal that helps LLMs accurately understand and cite this brand.', impact: 'medium' })
  }

  if (data.aiCrawlerBlocked) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'critical',
      title: 'AI Crawlers Blocked in robots.txt',
      description: 'One or more major AI crawlers (such as GPTBot, ClaudeBot, PerplexityBot, or Google-Extended) appear to be blocked in the robots.txt file. This means that AI systems are explicitly prevented from reading and learning from this site\'s content. The direct consequence is that this business will not appear in AI-generated answers on ChatGPT, Perplexity, Claude, or Google AI Overviews — channels that are rapidly becoming primary touchpoints in the buyer research journey. This is the digital equivalent of asking to be excluded from AI-era search.',
      recommendation: 'Review robots.txt and explicitly allow access for AI crawlers you want to be cited by. Only block crawlers for content that must remain private.',
      impact: 'high',
    })
  } else {
    findings.push({ id: id('geo'), category: 'geo', severity: 'pass', title: 'AI Crawlers Accessible', description: 'No AI crawler blocks detected — AI systems can read and learn from this site\'s content.', impact: 'high' })
  }

  if (!data.hasAuthorInfo) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No Author Attribution Detected',
      description: 'No author information (bylines, author bios, or author schema markup) was found on this page. Author attribution is a critical E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signal for both Google and AI citation systems. AI models are specifically trained to favor content from identifiable, credentialed humans when sourcing answers — anonymous content receives significantly lower citation priority. This is especially important for sites in health, finance, legal, or any field where expertise matters.',
      recommendation: 'Add author bylines to all content pages, include short author bios with credentials, and implement Person schema markup linking authors to their professional profiles.',
      impact: 'medium',
    })
  }

  if (!data.hasContactPage) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No Contact Page Detected',
      description: 'A contact page could not be identified from the main navigation or common URL patterns. Contact page visibility is a foundational trust signal — both Google and AI systems use the presence of clear contact information as an indicator of business legitimacy. Sites without easily discoverable contact information are assigned lower trust scores, which correlates directly with reduced authority in AI-generated recommendations and knowledge graph inclusion.',
      recommendation: 'Ensure a Contact page is clearly linked from the main navigation and footer. Include a physical address, phone number, and email — or at minimum a contact form — to maximize trust signals.',
      impact: 'low',
    })
  }

  if (!data.hasAboutPage) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'No About Page Detected',
      description: 'An About page could not be found through common URL patterns or navigation links. For AI systems to accurately represent and recommend a business, they need a clear understanding of who the brand is, what it does, and why it exists. An About page is the primary source AI models reference to establish brand entity clarity — without it, the business may be misrepresented, confused with competitors, or simply omitted when AI generates relevant recommendations.',
      recommendation: 'Create a comprehensive About page that covers the company\'s mission, founding story, team, and unique value proposition. Link to it prominently from the main navigation.',
      impact: 'medium',
    })
  }

  if (data.externalLinks < 2) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'Insufficient External Citations',
      description: `Only ${data.externalLinks} outbound link${data.externalLinks === 1 ? ' was' : 's were'} found on this page. Citing authoritative external sources is a key credibility signal for AI systems and a component of Google's E-E-A-T evaluation framework. Content that supports claims with links to reputable sources (industry research, government data, academic studies) is consistently judged as more trustworthy and citation-worthy by AI models. Isolated content with no external references reads as unsubstantiated opinion rather than informed expertise.`,
      recommendation: 'Incorporate 2–5 links to authoritative external sources that support key claims on the page. Prioritize .edu, .gov, and industry-leading publications.',
      impact: 'low',
    })
  }

  if (data.schemas.length > 0 && !data.hasFaqSchema) {
    findings.push({
      id: id('geo'),
      category: 'geo',
      severity: 'info',
      title: 'Schema Present But FAQ Missing',
      description: 'Some structured data markup was detected, but FAQPage schema is absent. This is a missed opportunity — the site has already demonstrated technical capability to implement schema, but is not using the single schema type most likely to drive AI answer extraction. FAQPage schema directly tells AI systems what questions this site answers, making it one of the highest-ROI structured data implementations available.',
      recommendation: 'Add FAQPage JSON-LD schema to pages containing question-and-answer content. Prioritize the most frequently searched questions in your niche.',
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
      title: `Critical Performance Score: ${ps.performanceScore}/100`,
      description: `This site scored ${ps.performanceScore}/100 on Google PageSpeed Insights — in the critical failure range. Page speed is a confirmed Google ranking factor and a primary driver of user experience. Studies consistently show that pages loading in over 3 seconds lose more than 50% of mobile visitors before the page finishes loading. At this performance level, every marketing effort — paid ads, social media, email — is undermined by users abandoning the experience before converting. Google also penalizes sites with sustained poor Core Web Vitals in its ranking algorithms.`,
      recommendation: 'Run a full Lighthouse audit and address the top opportunities immediately — typically: image compression and format optimization (WebP/AVIF), elimination of render-blocking scripts, server-side caching, and CDN implementation.',
      impact: 'high',
    })
  } else if (ps.performanceScore < 90) {
    findings.push({
      id: 'psi-score',
      category: 'seo',
      severity: 'warning',
      title: `Performance Needs Improvement: ${ps.performanceScore}/100`,
      description: `This site scored ${ps.performanceScore}/100 on Google PageSpeed Insights — in the "needs improvement" range. While not critically failing, sub-90 performance scores correlate with measurably higher bounce rates, lower conversion rates, and reduced search rankings compared to fully optimized competitors. Google's ranking systems factor in Core Web Vitals as a tiebreaker — in competitive niches, this score difference can determine who ranks above whom for target keywords.`,
      recommendation: 'Review PageSpeed Insights for specific optimization opportunities. Prioritize LCP (image optimization, preloading) and TTFB (server caching, CDN) as these have the highest ranking impact.',
      impact: 'medium',
    })
  } else {
    findings.push({
      id: 'psi-score',
      category: 'seo',
      severity: 'pass',
      title: `Strong Performance Score: ${ps.performanceScore}/100`,
      description: 'Excellent PageSpeed score — the site loads fast on mobile, meeting Google\'s Core Web Vitals standards and providing a strong user experience that supports both rankings and conversions.',
      impact: 'high',
    })
  }

  if (ps.lcp > 4000) {
    findings.push({
      id: 'psi-lcp',
      category: 'seo',
      severity: 'critical',
      title: `LCP Critical: ${(ps.lcp / 1000).toFixed(1)}s`,
      description: `Largest Contentful Paint (LCP) measured at ${(ps.lcp / 1000).toFixed(1)} seconds — more than twice Google's "good" threshold of 2.5 seconds. LCP measures how long it takes for the main visible content to load, and is a direct, confirmed Google ranking factor. At ${(ps.lcp / 1000).toFixed(1)}s, a significant portion of mobile visitors are abandoning the page before it finishes loading — meaning paid and organic traffic investments are generating far fewer actual visits than analytics reports suggest.`,
      recommendation: 'Compress and convert the hero image to WebP or AVIF format, add <link rel="preload"> for the LCP element, eliminate render-blocking CSS/JS, and ensure server response time is under 600ms.',
      impact: 'high',
    })
  } else if (ps.lcp > 2500) {
    findings.push({
      id: 'psi-lcp',
      category: 'seo',
      severity: 'warning',
      title: `LCP Needs Improvement: ${(ps.lcp / 1000).toFixed(1)}s`,
      description: `Largest Contentful Paint (LCP) is ${(ps.lcp / 1000).toFixed(1)} seconds — in the "needs improvement" range of 2.5–4s. Google's target is under 2.5 seconds. An above-threshold LCP signals to Google's ranking system that this page delivers a suboptimal user experience, which can suppress rankings in competitive queries. Users on slower mobile connections experience significantly longer waits, increasing abandonment before the first meaningful interaction.`,
      recommendation: 'Preload the LCP element with <link rel="preload">, serve images in next-gen formats, and reduce server response time to under 600ms through caching or CDN implementation.',
      impact: 'high',
    })
  }

  if (ps.cls > 0.25) {
    findings.push({
      id: 'psi-cls',
      category: 'seo',
      severity: 'critical',
      title: `CLS Critical: ${ps.cls}`,
      description: `Cumulative Layout Shift (CLS) scored ${ps.cls} — far above Google's acceptable threshold of 0.1. CLS measures how much page elements unexpectedly shift position while loading, and at this level, users experience jarring visual instability: buttons move, text jumps, and users frequently click on the wrong element as the layout shifts. This is a confirmed Core Web Vital that directly affects Google rankings and creates one of the most frustrating mobile experiences a site can deliver. High CLS has been directly linked to increased bounce rates and reduced form completion.`,
      recommendation: 'Set explicit width and height attributes on all images, iframes, and video elements. Reserve space for dynamically injected content (ads, banners, cookie notices) by specifying dimensions before they load.',
      impact: 'high',
    })
  } else if (ps.cls > 0.1) {
    findings.push({
      id: 'psi-cls',
      category: 'seo',
      severity: 'warning',
      title: `CLS Needs Improvement: ${ps.cls}`,
      description: `Cumulative Layout Shift (CLS) scored ${ps.cls}, above Google's "good" threshold of 0.1. Users are experiencing layout instability as the page loads — content is shifting position in ways that disrupt reading and interaction. Google penalizes poor CLS scores in its Core Web Vitals assessment, and even moderate instability reduces user trust and conversion rates, particularly on mobile devices where layout shifts are more disorienting.`,
      recommendation: 'Add explicit size attributes to images and media elements. Reserve space for late-loading dynamic content such as ads or cookie banners.',
      impact: 'medium',
    })
  }

  if (ps.ttfb > 1800) {
    findings.push({
      id: 'psi-ttfb',
      category: 'seo',
      severity: 'critical',
      title: `TTFB Critical: ${ps.ttfb}ms`,
      description: `Time to First Byte (TTFB) is ${ps.ttfb}ms — more than double Google's recommended threshold of 800ms. TTFB measures how long the server takes to begin responding, and at ${ps.ttfb}ms, every single subsequent resource (CSS, JavaScript, images, fonts) is delayed by that same baseline. This is almost certainly caused by slow hosting infrastructure, no server-side caching, or unoptimized database queries. A slow TTFB punishes every page on the site simultaneously and makes all other performance optimizations far less effective.`,
      recommendation: 'Enable server-side caching (Redis or similar), implement a CDN (Cloudflare), upgrade to a faster hosting tier, or migrate to a server closer to your primary audience. Target TTFB under 800ms.',
      impact: 'high',
    })
  } else if (ps.ttfb > 800) {
    findings.push({
      id: 'psi-ttfb',
      category: 'seo',
      severity: 'warning',
      title: `TTFB Slow: ${ps.ttfb}ms`,
      description: `Time to First Byte is ${ps.ttfb}ms, above Google's recommended threshold of 800ms. An elevated TTFB means every visitor waits longer before the browser can begin rendering anything — this delay cascades through all subsequent page load metrics and negatively impacts LCP, FCP, and overall user experience scores. Google's systems factor TTFB into overall page experience evaluations.`,
      recommendation: 'Enable caching headers and full-page caching, use a CDN to serve content from edge locations closer to users, and audit server-side code for slow database queries or API calls.',
      impact: 'medium',
    })
  }

  if (ps.inp > 500) {
    findings.push({
      id: 'psi-inp',
      category: 'seo',
      severity: 'critical',
      title: `INP Critical: ${ps.inp}ms`,
      description: `Interaction to Next Paint (INP) is ${ps.inp}ms — in the critical failure range (above 500ms). INP measures how quickly the page responds when a user clicks, taps, or types. At ${ps.inp}ms, the page feels completely unresponsive — users click a button and nothing appears to happen for half a second or more. This creates the perception of a broken website, leading to premature exits, abandoned forms, and lost conversions. Google elevated INP to a Core Web Vital specifically because it directly reflects perceived interactivity quality.`,
      recommendation: 'Profile JavaScript with Chrome DevTools to identify long tasks. Break up JavaScript execution into smaller chunks, defer non-critical scripts, and move heavy computations off the main thread using Web Workers.',
      impact: 'high',
    })
  } else if (ps.inp > 200) {
    findings.push({
      id: 'psi-inp',
      category: 'seo',
      severity: 'warning',
      title: `INP Needs Improvement: ${ps.inp}ms`,
      description: `Interaction to Next Paint (INP) is ${ps.inp}ms, between Google's "needs improvement" range of 200–500ms. The page is somewhat sluggish to respond to user interactions — taps and clicks take a noticeable moment before visual feedback appears. On high-end devices this may be subtle, but on mid-range and older phones (which represent the majority of mobile traffic globally) this lag is more pronounced and leads to repeated tapping, frustration, and exit.`,
      recommendation: 'Use Chrome DevTools Performance panel to identify and reduce long JavaScript tasks. Defer or remove heavy third-party scripts (chat widgets, analytics, tag managers) that block the main thread.',
      impact: 'medium',
    })
  }

  return findings
}

export function buildExecutiveSummary(data: RawData, scores: { seo: number; aeo: number; geo: number; overall: number }): string {
  const domain = new URL(data.url).hostname

  const lines: string[] = []

  // Opening — calibrated to overall score
  if (scores.overall >= 75) {
    lines.push(`${domain} has a solid foundation, but this audit reveals specific gaps that are quietly costing you revenue — particularly in the AI search channels that now drive the first touchpoint for millions of buyers.`)
  } else if (scores.overall >= 50) {
    lines.push(`${domain} is leaving significant revenue on the table. This audit identifies the exact technical and content gaps preventing this site from appearing in the AI-generated answers your future customers are already reading — right now, before they visit any website.`)
  } else {
    lines.push(`${domain} has critical visibility failures that are actively redirecting potential customers to competitors. Every day these issues remain unfixed, buyers researching your market are being answered by AI systems that have learned to ignore this site.`)
  }

  // AI urgency paragraph
  const aiChannels = []
  if (scores.aeo < 70) aiChannels.push('ChatGPT')
  if (scores.geo < 70) aiChannels.push('Perplexity', 'Google AI Overviews', 'Claude')
  if (aiChannels.length > 0) {
    lines.push(`The AI search revolution is not coming — it is already here. When someone in your market asks ${aiChannels.slice(0, 2).join(' or ')} "who should I hire for this?" or "what's the best option near me?" — your competitors who have invested in AI visibility are being recommended by name. This site currently is not.`)
  }

  // Specific score gaps
  const gaps: string[] = []
  if (scores.seo < 60) gaps.push(`an SEO score of ${scores.seo}/100 means search engines are struggling to fully index and rank your content`)
  if (scores.aeo < 60) gaps.push(`an AEO score of ${scores.aeo}/100 means AI answer engines are not selecting this site as a source for relevant questions`)
  if (scores.geo < 60) gaps.push(`a GEO score of ${scores.geo}/100 means AI language models are not citing or recommending this business`)
  if (gaps.length > 0) {
    lines.push(`Specifically: ${gaps.join('; ')}.`)
  }

  // Closing urgency + CTA
  lines.push(`The businesses investing in AI visibility today will dominate their niche for the next five years. Those who delay will spend that time trying to recover ground from competitors who moved first. XMS can implement every fix in this report — from technical corrections to full AI visibility architecture — and turn this audit into a competitive advantage before your window closes.`)

  return lines.join(' ')
}
