import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { AuditResult, AuditFinding } from '@/lib/audit/types'

const C = {
  ink:        '#0f172a',
  slate:      '#1e293b',
  muted:      '#64748b',
  border:     '#e2e8f0',
  bg:         '#f8fafc',
  white:      '#ffffff',
  blue:       '#1d4ed8',
  blueLight:  '#eff6ff',
  blueBorder: '#bfdbfe',
  red:        '#dc2626',
  redLight:   '#fef2f2',
  redBorder:  '#fecaca',
  amber:      '#b45309',
  amberLight: '#fffbeb',
  amberBorder:'#fde68a',
  green:      '#15803d',
  greenLight: '#f0fdf4',
  greenBorder:'#bbf7d0',
  indigo:     '#4f46e5',
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
    paddingTop: 28,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  logo: { width: 36, height: 36 },
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
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 5,
  },
  headerUrl: {
    fontSize: 11,
    color: '#60a5fa',
    marginBottom: 3,
  },
  headerDate: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 20,
  },
  scoresBand: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 32,
    paddingBottom: 24,
    paddingTop: 4,
    gap: 10,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: C.ink,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 6,
    border: '1pt solid #334155',
  },
  scoreLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
  },
  scoreOf: {
    fontSize: 8,
    color: '#475569',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 22,
  },
  summaryCard: {
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 22,
    border: '1pt solid #e2e8f0',
  },
  summaryLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.muted,
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  summaryText: {
    fontSize: 10,
    color: C.slate,
    lineHeight: 1.6,
  },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
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

function findingTheme(severity: string) {
  switch (severity) {
    case 'critical': return { bg: C.redLight,   border: C.redBorder,   dot: C.red,   text: C.red   }
    case 'warning':  return { bg: C.amberLight, border: C.amberBorder, dot: '#f59e0b', text: C.amber }
    case 'info':     return { bg: C.blueLight,  border: C.blueBorder,  dot: C.blue,  text: C.blue  }
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

export function AuditPdfDocument({ result }: { result: AuditResult }) {
  const domain = new URL(result.url).hostname
  const logoSrc = `${window.location.origin}/logo-icon.png`
  const dateStr = new Date(result.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const seoFindings = result.findings.filter(f => f.category === 'seo' && f.severity !== 'pass')
  const aeoFindings = result.findings.filter(f => f.category === 'aeo' && f.severity !== 'pass')
  const geoFindings = result.findings.filter(f => f.category === 'geo' && f.severity !== 'pass')

  return (
    <Document title={`XMS Audit — ${domain}`} author="XMS · Xperience AI Marketing">
      <Page size="A4" style={S.page}>

        {/* ── Dark header ── */}
        <View style={S.header} fixed>
          <View style={S.headerTop}>
            <Image style={S.logo} src={logoSrc} />
            <Text style={S.headerBadge}>SEO · AEO · GEO AUDIT</Text>
          </View>
          <Text style={S.headerTitle}>Website Audit Report</Text>
          <Text style={S.headerUrl}>{domain}</Text>
          <Text style={S.headerDate}>Generated on {dateStr}</Text>
        </View>

        {/* ── Score cards ── */}
        <View style={S.scoresBand} fixed>
          {[
            { label: 'OVERALL', score: result.scores.overall },
            { label: 'SEO',     score: result.scores.seo     },
            { label: 'AEO',     score: result.scores.aeo     },
            { label: 'GEO',     score: result.scores.geo     },
          ].map(({ label, score }) => (
            <View key={label} style={S.scoreItem}>
              <Text style={S.scoreLabel}>{label}</Text>
              <Text style={[S.scoreValue, { color: scoreColor(score) }]}>{score}</Text>
              <Text style={S.scoreOf}>/100</Text>
            </View>
          ))}
        </View>

        {/* ── Content ── */}
        <View style={S.content}>

          {/* Executive Summary */}
          <View style={[S.summaryCard, { marginTop: 4 }]}>
            <Text style={S.summaryLabel}>EXECUTIVE SUMMARY</Text>
            <Text style={S.summaryText}>{result.executiveSummary}</Text>
          </View>

          {/* Critical Issues */}
          {result.criticalIssues.length > 0 && (
            <View style={S.section}>
              <View style={S.sectionHeader}>
                <View style={[S.sectionDot, { backgroundColor: C.red }]} />
                <Text style={S.sectionTitle}>Critical Issues</Text>
                <Text style={S.sectionCount}>({result.criticalIssues.length})</Text>
              </View>
              <FindingBlock findings={result.criticalIssues} emptyText="No critical issues found." />
            </View>
          )}

          {/* Quick Wins */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <View style={[S.sectionDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={S.sectionTitle}>Quick Wins</Text>
              <Text style={S.sectionCount}>({result.quickWins.length})</Text>
            </View>
            <FindingBlock findings={result.quickWins} emptyText="No quick wins identified — site looks healthy!" />
          </View>

          {/* Opportunities */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <View style={[S.sectionDot, { backgroundColor: C.blue }]} />
              <Text style={S.sectionTitle}>Opportunities</Text>
              <Text style={S.sectionCount}>({result.opportunities.length})</Text>
            </View>
            <FindingBlock findings={result.opportunities} emptyText="No additional opportunities at this time." />
          </View>

          {/* All findings by category */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <View style={[S.sectionDot, { backgroundColor: C.indigo }]} />
              <Text style={S.sectionTitle}>Full Technical Findings</Text>
            </View>

            {seoFindings.length > 0 && (
              <>
                <Text style={S.categoryLabel}>SEO ({seoFindings.length})</Text>
                <FindingBlock findings={seoFindings} emptyText="" />
              </>
            )}
            {aeoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>AEO ({aeoFindings.length})</Text>
                <FindingBlock findings={aeoFindings} emptyText="" />
              </>
            )}
            {geoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>GEO ({geoFindings.length})</Text>
                <FindingBlock findings={geoFindings} emptyText="" />
              </>
            )}
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerBrand}>XMS · Xperience AI Marketing</Text>
          <View style={S.footerRight}>
            <Text style={S.footerText}>xperienceusa.com</Text>
            <Text style={S.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </View>

      </Page>
    </Document>
  )
}
