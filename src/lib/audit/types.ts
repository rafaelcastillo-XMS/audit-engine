export type Severity = 'critical' | 'warning' | 'info' | 'pass'

export interface AuditFinding {
  id: string
  category: 'seo' | 'aeo' | 'geo'
  severity: Severity
  title: string
  description: string
  recommendation?: string
  impact: 'high' | 'medium' | 'low'
}

export interface AuditScores {
  seo: number
  aeo: number
  geo: number
  overall: number
}

export interface RawData {
  title: string | null
  metaDescription: string | null
  h1s: string[]
  h2s: string[]
  canonical: string | null
  robotsMeta: string | null
  schemas: string[]
  openGraph: Record<string, string>
  wordCount: number
  internalLinks: number
  externalLinks: number
  hasRobotsTxt: boolean
  hasSitemap: boolean
  isHttps: boolean
  hasFaqSchema: boolean
  hasLlmsTxt: boolean
  aiCrawlerBlocked: boolean
  hasAuthorInfo: boolean
  hasContactPage: boolean
  hasAboutPage: boolean
  questionHeadings: string[]
  url: string
}

export interface PageSpeedResult {
  performanceScore: number
  lcp: number
  cls: number
  inp: number
  fcp: number
  ttfb: number
}

export interface AhrefsData {
  domainRating: number
  ahrefsRank: number
  backlinks: number
  referringDomains: number
  organicTraffic: number
  organicKeywords: number
}

export interface AuditResult {
  id: string
  url: string
  createdAt: string
  scores: AuditScores
  findings: AuditFinding[]
  executiveSummary: string
  criticalIssues: AuditFinding[]
  quickWins: AuditFinding[]
  opportunities: AuditFinding[]
  rawData: RawData
  pageSpeed?: PageSpeedResult
  ahrefs?: AhrefsData
}

export interface AuditRequest {
  url: string
}

export interface AuditProgress {
  step: number
  total: number
  label: string
}

export const AUDIT_STEPS = [
  'Fetching website',
  'Checking SEO basics',
  'Analyzing AEO signals',
  'Reviewing GEO readiness',
  'Generating report',
] as const
