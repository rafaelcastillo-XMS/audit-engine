import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { AuditResult, AuditFinding } from '@/lib/audit/types'

const C = {
  ink:         '#0f172a',
  slate:       '#1e293b',
  muted:       '#64748b',
  border:      '#e2e8f0',
  bg:          '#f8fafc',
  white:       '#ffffff',
  blue:        '#1d4ed8',
  blueLight:   '#eff6ff',
  blueBorder:  '#bfdbfe',
  red:         '#dc2626',
  redDark:     '#991b1b',
  redDeep:     '#450a0a',
  redLight:    '#fff1f2',
  redBorder:   '#fca5a5',
  amber:       '#b45309',
  amberLight:  '#fffbeb',
  amberBorder: '#fde68a',
  green:       '#15803d',
  greenLight:  '#f0fdf4',
  greenBorder: '#bbf7d0',
  indigo:      '#4f46e5',
}

const S = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingBottom: 52,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.slate,
  },
  header: {
    backgroundColor: C.ink,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: { height: 32, width: 130 },
  headerBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#60a5fa',
    backgroundColor: '#172554',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  headerUrl: {
    fontSize: 11,
    color: '#60a5fa',
    marginBottom: 2,
  },
  headerDate: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 18,
  },

  // Scores — page 1 only (no fixed)
  scoresBand: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 32,
    paddingBottom: 22,
    paddingTop: 6,
    gap: 12,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  scoreOf: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 1,
  },
  scoreLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8',
    letterSpacing: 1.2,
  },

  content: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  // Executive summary — consequence-focused
  summaryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 18,
    marginBottom: 20,
    border: '1pt solid #334155',
  },
  summaryLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#60a5fa',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.7,
  },

  // Critical Issues — high alert
  criticalBanner: {
    backgroundColor: C.redDark,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criticalBannerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 1.5,
  },
  criticalWrapper: {
    borderRadius: 6,
    border: `2pt solid ${C.redDark}`,
    marginBottom: 20,
    overflow: 'hidden',
  },
  criticalInner: {
    backgroundColor: C.redLight,
    padding: 12,
    gap: 6,
  },

  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1.5pt solid #e2e8f0',
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
  },
  sectionCount: {
    fontSize: 9,
    color: C.muted,
    marginLeft: 5,
    marginTop: 1,
  },

  finding: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
    gap: 8,
  },
  findingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
    flexShrink: 0,
  },
  findingBody: { flex: 1 },
  findingTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  findingDesc: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#475569',
  },
  impactBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  criticalFinding: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 4,
    marginBottom: 4,
    gap: 8,
    backgroundColor: '#fee2e2',
    border: '1pt solid #fca5a5',
  },

  empty: {
    fontSize: 9,
    color: C.muted,
    paddingVertical: 10,
    textAlign: 'center',
  },
  dividerSmall: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  categoryLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.muted,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: '1pt solid #e2e8f0',
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.blue,
  },
  footerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: C.muted },
})

function scoreColor(n: number) {
  if (n >= 80) return '#22c55e'
  if (n >= 60) return '#f59e0b'
  return '#ef4444'
}

function scoreBg(n: number) {
  if (n >= 80) return '#052e16'
  if (n >= 60) return '#1c1107'
  return '#1f0000'
}

function findingTheme(severity: string) {
  switch (severity) {
    case 'critical': return { bg: '#fee2e2', border: '#fca5a5', dot: C.red,     text: C.redDark }
    case 'warning':  return { bg: C.amberLight, border: C.amberBorder, dot: '#f59e0b', text: C.amber }
    case 'info':     return { bg: C.blueLight,  border: C.blueBorder,  dot: C.blue,   text: C.blue  }
    default:         return { bg: C.greenLight, border: C.greenBorder, dot: '#22c55e', text: C.green }
  }
}

function impactTheme(impact: string) {
  switch (impact) {
    case 'high':   return { bg: '#fef2f2', color: '#dc2626' }
    case 'medium': return { bg: '#fffbeb', color: '#d97706' }
    default:       return { bg: '#f0fdf4', color: '#16a34a' }
  }
}

function buildConsequenceSummary(result: AuditResult): string {
  const { scores, criticalIssues, findings } = result
  const critCount = criticalIssues.length
  const totalIssues = findings.filter(f => f.severity !== 'pass').length

  const lines: string[] = []

  if (critCount > 0) {
    lines.push(
      `This assessment has uncovered ${critCount} critical vulnerability${critCount > 1 ? 'ies' : 'y'} and ${totalIssues} total optimization failures that are silently suppressing this site's reach, authority, and revenue potential — each one compounding in cost the longer it remains unresolved.`
    )
  } else {
    lines.push(
      `This assessment has identified ${totalIssues} optimization gaps that are quietly limiting this site's competitive position across search, AI discovery, and brand authority channels.`
    )
  }

  if (scores.seo < 70) {
    lines.push(
      `An SEO score of ${scores.seo}/100 means search engines are not fully indexing or trusting this site. Competitors with stronger technical foundations are capturing this audience — and retaining them.`
    )
  }

  if (scores.aeo < 70) {
    lines.push(
      `With an AEO score of ${scores.aeo}/100, this site is absent from AI-generated answers on ChatGPT, Perplexity, and Google AI Overviews — platforms now responsible for influencing a growing share of purchase decisions before a user ever visits a website.`
    )
  }

  if (scores.geo < 70) {
    lines.push(
      `A GEO score of ${scores.geo}/100 confirms that AI language models are not citing, referencing, or recommending this business. In a landscape where AI-generated responses increasingly shape buyer behavior, invisibility at this level translates directly to lost market share.`
    )
  }

  lines.push(
    `The organizations that close these gaps today will define the competitive landscape of tomorrow. Delay is not neutral — it is a decision to concede ground.`
  )

  return lines.join('\n\n')
}

function FindingBlock({ findings, emptyText }: { findings: AuditFinding[]; emptyText: string }) {
  if (findings.length === 0) return <Text style={S.empty}>{emptyText}</Text>
  return (
    <View>
      {findings.filter(f => f.severity !== 'pass').map((f) => {
        const t = findingTheme(f.severity)
        const imp = impactTheme(f.impact)
        return (
          <View key={f.id} wrap={false} style={[S.finding, { backgroundColor: t.bg, border: `1pt solid ${t.border}` }]}>
            <View style={[S.findingDot, { backgroundColor: t.dot }]} />
            <View style={S.findingBody}>
              <Text style={[S.findingTitle, { color: t.text }]}>{f.title}</Text>
              <Text style={S.findingDesc}>{f.description}</Text>
              <View style={[S.impactBadge, { backgroundColor: imp.bg }]}>
                <Text style={{ color: imp.color, fontSize: 7, fontFamily: 'Helvetica-Bold' }}>
                  {f.impact.toUpperCase()} IMPACT
                </Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

function CriticalBlock({ findings }: { findings: AuditFinding[] }) {
  if (findings.length === 0) return null
  return (
    <View style={S.criticalWrapper} wrap={false}>
      <View style={S.criticalBanner}>
        <Text style={S.criticalBannerText}>
          CRITICAL VULNERABILITIES — IMMEDIATE ACTION REQUIRED
        </Text>
      </View>
      <View style={S.criticalInner}>
        {findings.map((f) => {
          const imp = impactTheme(f.impact)
          return (
            <View key={f.id} wrap={false} style={S.criticalFinding}>
              <View style={[S.findingDot, { backgroundColor: C.red, marginTop: 4 }]} />
              <View style={S.findingBody}>
                <Text style={[S.findingTitle, { color: C.redDark }]}>{f.title}</Text>
                <Text style={S.findingDesc}>{f.description}</Text>
                <View style={[S.impactBadge, { backgroundColor: imp.bg }]}>
                  <Text style={{ color: imp.color, fontSize: 7, fontFamily: 'Helvetica-Bold' }}>
                    {f.impact.toUpperCase()} IMPACT
                  </Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export function AuditPdfDocument({ result }: { result: AuditResult }) {
  const domain = new URL(result.url).hostname
  const logoSrc = `${window.location.origin}/${encodeURIComponent('LOGO - BLACK BACKGROUND.webp')}`
  const dateStr = new Date(result.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const seoFindings = result.findings.filter(f => f.category === 'seo' && f.severity !== 'pass')
  const aeoFindings = result.findings.filter(f => f.category === 'aeo' && f.severity !== 'pass')
  const geoFindings = result.findings.filter(f => f.category === 'geo' && f.severity !== 'pass')
  const consequenceSummary = buildConsequenceSummary(result)

  return (
    <Document title={`XMS AI Visibility Audit — ${domain}`} author="XMS · Xperience AI Marketing">
      <Page size="A4" style={S.page}>

        {/* ── Dark header (fixed — appears on every page) ── */}
        <View style={S.header} fixed>
          <View style={S.headerTop}>
            <Image style={S.logo} src={logoSrc} />
            <Text style={S.headerBadge}>CONFIDENTIAL · AI VISIBILITY AUDIT</Text>
          </View>
          <Text style={S.headerTitle}>AI Search & Digital Visibility Report</Text>
          <Text style={S.headerSubtitle}>SEO · AEO · GEO Intelligence Assessment</Text>
          <Text style={S.headerUrl}>{domain}</Text>
          <Text style={S.headerDate}>Prepared on {dateStr} · For internal use only</Text>
        </View>

        {/* ── Score circles (page 1 only — no fixed prop) ── */}
        <View style={S.scoresBand}>
          {[
            { label: 'OVERALL', score: result.scores.overall },
            { label: 'SEO',     score: result.scores.seo     },
            { label: 'AEO',     score: result.scores.aeo     },
            { label: 'GEO',     score: result.scores.geo     },
          ].map(({ label, score }) => {
            const color = scoreColor(score)
            const bg = scoreBg(score)
            return (
              <View key={label} style={S.scoreItem}>
                <View style={[S.scoreCircle, { borderColor: color, backgroundColor: bg }]}>
                  <Text style={[S.scoreValue, { color }]}>{score}</Text>
                  <Text style={S.scoreOf}>/100</Text>
                </View>
                <Text style={S.scoreLabel}>{label}</Text>
              </View>
            )
          })}
        </View>

        {/* ── Content ── */}
        <View style={S.content}>

          {/* Executive Summary — consequence-focused */}
          <View style={[S.summaryCard, { marginTop: 4 }]}>
            <Text style={S.summaryLabel}>EXECUTIVE SUMMARY</Text>
            <Text style={S.summaryText}>{consequenceSummary}</Text>
          </View>

          {/* Critical Issues — high alert */}
          {result.criticalIssues.length > 0 && (
            <View style={S.section}>
              <CriticalBlock findings={result.criticalIssues} />
            </View>
          )}

          {/* Opportunities */}
          {result.opportunities.length > 0 && (
            <View style={S.section}>
              <View style={S.sectionHeader}>
                <View style={[S.sectionDot, { backgroundColor: C.blue }]} />
                <Text style={S.sectionTitle}>Untapped Growth Opportunities</Text>
                <Text style={S.sectionCount}>({result.opportunities.length})</Text>
              </View>
              <FindingBlock findings={result.opportunities} emptyText="No additional opportunities at this time." />
            </View>
          )}

          {/* Full Technical Findings by category */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <View style={[S.sectionDot, { backgroundColor: C.indigo }]} />
              <Text style={S.sectionTitle}>Complete Technical Assessment</Text>
            </View>

            {seoFindings.length > 0 && (
              <>
                <Text style={S.categoryLabel}>SEO — Search Engine Optimization ({seoFindings.length})</Text>
                <FindingBlock findings={seoFindings} emptyText="" />
              </>
            )}
            {aeoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>AEO — Answer Engine Optimization ({aeoFindings.length})</Text>
                <FindingBlock findings={aeoFindings} emptyText="" />
              </>
            )}
            {geoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>GEO — Generative Engine Optimization ({geoFindings.length})</Text>
                <FindingBlock findings={geoFindings} emptyText="" />
              </>
            )}
          </View>

        </View>

        {/* ── Footer (fixed) ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerBrand}>XMS · Xperience AI Marketing Solutions</Text>
          <View style={S.footerRight}>
            <Text style={S.footerText}>xperienceusa.com</Text>
            <Text style={S.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </View>

      </Page>
    </Document>
  )
}
