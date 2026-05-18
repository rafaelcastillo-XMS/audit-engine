import { Document, Page, View, Text, Image, StyleSheet, Svg, Circle, Ellipse, Line } from '@react-pdf/renderer'
import type { AuditResult, AuditFinding, AhrefsData } from '@/lib/audit/types'

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
  redLight:    '#fff1f2',
  redBorder:   '#fca5a5',
  amber:       '#b45309',
  amberLight:  '#fffbeb',
  amberBorder: '#fde68a',
  green:       '#15803d',
  greenLight:  '#f0fdf4',
  greenBorder: '#bbf7d0',
  indigo:      '#4f46e5',
  // WCAG-safe muted tones on dark backgrounds
  mutedOnDark: '#94a3b8',  // 6.4:1 on #0f172a ✓
  softOnDark:  '#cbd5e1',  // 9.3:1 on #0f172a ✓
}

const S = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingTop: 20,
    paddingBottom: 56,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.slate,
  },

  // ── Page 1 header (not fixed — only renders on first page) ──
  header: {
    backgroundColor: C.ink,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: -20, // cancel page paddingTop so header bleeds to top edge
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { height: 30, width: 120 },
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
    fontSize: 21,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 9,
    color: C.mutedOnDark,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  headerUrl: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#93c5fd',
  },
  headerDate: {
    fontSize: 9,
    color: C.softOnDark,
    marginBottom: 18,
  },

  // ── Mini brand strip for pages 2+ (fixed, absolute) ──
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: C.ink,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniHeaderText: {
    fontSize: 7,
    color: C.mutedOnDark,
    letterSpacing: 0.5,
  },

  // ── Scores (page 1 only — no fixed prop) ──
  resultsLabel: {
    backgroundColor: C.slate,
    paddingHorizontal: 32,
    paddingTop: 14,
    paddingBottom: 4,
  },
  resultsLabelText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.mutedOnDark,
    letterSpacing: 2,
  },
  scoresBand: {
    flexDirection: 'row',
    backgroundColor: C.slate,
    paddingHorizontal: 32,
    paddingBottom: 22,
    paddingTop: 8,
    gap: 14,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  scoreOf: {
    fontSize: 8,
    color: C.mutedOnDark,
    marginTop: 1,
  },
  scoreLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.softOnDark,
    letterSpacing: 1,
  },

  // ── Content ──
  content: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  // ── Executive summary ──
  summaryCard: {
    backgroundColor: C.ink,
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
    color: C.softOnDark,
    lineHeight: 1.7,
  },

  // ── Critical issues ──
  criticalWrapper: {
    borderRadius: 6,
    border: `2pt solid ${C.redDark}`,
    marginBottom: 20,
    overflow: 'hidden',
  },
  criticalBanner: {
    backgroundColor: C.redDark,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  criticalBannerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 1.5,
  },
  criticalInner: {
    backgroundColor: C.redLight,
    padding: 12,
    gap: 6,
  },
  criticalFinding: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 4,
    marginBottom: 4,
    gap: 8,
    backgroundColor: '#ffe4e6',
    border: `1pt solid ${C.redBorder}`,
  },

  // ── Generic section ──
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

  // ── Finding card ──
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
    lineHeight: 1.55,
    color: '#374151',  // 9.7:1 on white ✓ WCAG AA
  },
  impactBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 5,
  },

  // ── Ahrefs metrics ──
  ahrefsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  ahrefsCard: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 6,
    border: '1pt solid #e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  ahrefsCardLabel: {
    fontSize: 7,
    color: C.muted,
    marginBottom: 4,
    textAlign: 'center',
  },
  ahrefsCardValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
  },
  ahrefsSource: {
    fontSize: 7,
    color: C.muted,
    textAlign: 'right',
    marginTop: -14,
    marginBottom: 20,
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
    color: '#374151',   // 9.7:1 on white ✓
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },

  // ── Footer ──
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
  footerText: { fontSize: 8, color: C.muted },  // #64748b on white = 4.75:1 ✓
})

function scoreColor(n: number) {
  if (n >= 80) return '#16a34a'   // green-600: high contrast on dark
  if (n >= 60) return '#d97706'   // amber-600: readable on dark
  return '#dc2626'                 // red-600
}

function scoreBg(n: number) {
  if (n >= 80) return '#052e16'
  if (n >= 60) return '#1c0f03'
  return '#1f0303'
}

function findingTheme(severity: string) {
  switch (severity) {
    case 'critical': return { bg: '#fff1f2', border: '#fca5a5', dot: C.red,    text: C.redDark }
    case 'warning':  return { bg: C.amberLight, border: C.amberBorder, dot: '#d97706', text: '#92400e' }
    case 'info':     return { bg: C.blueLight,  border: C.blueBorder,  dot: C.blue,   text: '#1e40af' }
    default:         return { bg: C.greenLight, border: C.greenBorder, dot: '#16a34a', text: C.green }
  }
}

function impactTheme(impact: string) {
  switch (impact) {
    case 'high':   return { bg: '#fef2f2', color: '#991b1b' }   // 7.1:1 ✓
    case 'medium': return { bg: '#fffbeb', color: '#92400e' }   // 6.8:1 ✓
    default:       return { bg: '#f0fdf4', color: '#14532d' }   // 8.2:1 ✓
  }
}

function GlobeIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Circle cx={7} cy={7} r={6} stroke="#93c5fd" strokeWidth={1} fill="none" />
      <Ellipse cx={7} cy={7} rx={3} ry={6} stroke="#93c5fd" strokeWidth={0.8} fill="none" />
      <Line x1={1} y1={7} x2={13} y2={7} stroke="#93c5fd" strokeWidth={0.8} />
      <Line x1={2.5} y1={4} x2={11.5} y2={4} stroke="#93c5fd" strokeWidth={0.6} />
      <Line x1={2.5} y1={10} x2={11.5} y2={10} stroke="#93c5fd" strokeWidth={0.6} />
    </Svg>
  )
}

function buildConsequenceSummary(result: AuditResult): string {
  const { scores, criticalIssues, findings } = result
  const critCount = criticalIssues.length
  const totalIssues = findings.filter(f => f.severity !== 'pass').length
  const lines: string[] = []

  if (critCount > 0) {
    lines.push(
      `This assessment has uncovered ${critCount} critical vulnerabilit${critCount > 1 ? 'ies' : 'y'} and ${totalIssues} total optimization failures that are actively suppressing this site's reach, authority, and revenue — each one compounding in cost every day it remains unresolved.`
    )
  } else {
    lines.push(
      `This assessment has identified ${totalIssues} optimization gaps quietly limiting this site's competitive position across search, AI discovery, and brand authority channels.`
    )
  }

  if (scores.seo < 70) {
    lines.push(
      `An SEO score of ${scores.seo}/100 means search engines are failing to fully index and rank this content — sending high-intent visitors directly to competitors with stronger technical foundations, day after day.`
    )
  }

  if (scores.aeo < 70) {
    lines.push(
      `With an AEO score of ${scores.aeo}/100, this site is absent from AI-generated answers on ChatGPT, Perplexity, and Google AI Overviews — platforms that now influence a growing share of purchase decisions before a user ever visits a website.`
    )
  }

  if (scores.geo < 70) {
    lines.push(
      `A GEO score of ${scores.geo}/100 confirms that AI language models are not citing or recommending this business when users ask relevant questions — a critical blind spot as AI-generated responses increasingly shape buying behavior.`
    )
  }

  lines.push(
    `Every competitor that closes these gaps today captures market share that becomes significantly harder to reclaim tomorrow. Delay is not neutral — it is a strategic concession.`
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
    <View style={S.criticalWrapper}>
      <View style={S.criticalBanner}>
        <Text style={S.criticalBannerText}>CRITICAL VULNERABILITIES — IMMEDIATE ACTION REQUIRED</Text>
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

function AhrefsBlock({ data }: { data: AhrefsData }) {
  const metrics = [
    { label: 'Domain Rating',    value: `${data.domainRating}/100` },
    { label: 'Ahrefs Rank',      value: `#${data.ahrefsRank.toLocaleString()}` },
    { label: 'Backlinks',        value: data.backlinks.toLocaleString() },
    { label: 'Ref. Domains',     value: data.referringDomains.toLocaleString() },
    { label: 'Organic Traffic',  value: data.organicTraffic.toLocaleString() },
    { label: 'Organic Keywords', value: data.organicKeywords.toLocaleString() },
  ]
  return (
    <View style={S.section}>
      <View style={S.sectionHeader}>
        <View style={[S.sectionDot, { backgroundColor: '#6366f1' }]} />
        <Text style={S.sectionTitle}>Domain Authority</Text>
        <Text style={[S.sectionCount, { color: '#6366f1' }]}>  Powered by Ahrefs</Text>
      </View>
      <View style={S.ahrefsRow}>
        {metrics.map(({ label, value }) => (
          <View key={label} style={S.ahrefsCard}>
            <Text style={S.ahrefsCardLabel}>{label}</Text>
            <Text style={S.ahrefsCardValue}>{value}</Text>
          </View>
        ))}
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

        {/* ── Mini brand strip for pages 2+ (fixed, absolute) ── */}
        <View fixed style={S.miniHeader}>
          <Text style={S.miniHeaderText} render={({ pageNumber }) =>
            pageNumber > 1 ? 'XMS · AI VISIBILITY REPORT' : ''
          } />
          <Text style={S.miniHeaderText} render={({ pageNumber }) =>
            pageNumber > 1 ? domain : ''
          } />
        </View>

        {/* ── Full dark header — page 1 only (no fixed prop) ── */}
        <View style={S.header}>
          <View style={S.headerTop}>
            <Image style={S.logo} src={logoSrc} />
            <Text style={S.headerBadge}>CONFIDENTIAL · AI VISIBILITY AUDIT</Text>
          </View>
          <Text style={S.headerTitle}>AI Search & Digital Visibility Report</Text>
          <Text style={S.headerSubtitle}>SEO · AEO · GEO Intelligence Assessment</Text>
          <View style={S.urlRow}>
            <GlobeIcon />
            <Text style={S.headerUrl}>{domain}</Text>
          </View>
          <Text style={S.headerDate}>Prepared on {dateStr} · For internal use only</Text>
        </View>

        {/* ── RESULTS label + Score circles — page 1 only ── */}
        <View style={S.resultsLabel}>
          <Text style={S.resultsLabelText}>AUDIT RESULTS</Text>
        </View>
        <View style={S.scoresBand}>
          {([
            { label: 'OVERALL', score: result.scores.overall },
            { label: 'SEO',     score: result.scores.seo     },
            { label: 'AEO',     score: result.scores.aeo     },
            { label: 'GEO',     score: result.scores.geo     },
          ] as const).map(({ label, score }) => {
            const color = scoreColor(score)
            const bg    = scoreBg(score)
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

          {/* Executive Summary */}
          <View style={[S.summaryCard, { marginTop: 4 }]}>
            <Text style={S.summaryLabel}>EXECUTIVE SUMMARY</Text>
            <Text style={S.summaryText}>{consequenceSummary}</Text>
          </View>

          {/* Domain Authority (Ahrefs) */}
          {result.ahrefs && <AhrefsBlock data={result.ahrefs} />}

          {/* Critical Issues */}
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
              <FindingBlock findings={result.opportunities} emptyText="No additional opportunities identified." />
            </View>
          )}

          {/* Full Technical Findings */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <View style={[S.sectionDot, { backgroundColor: C.indigo }]} />
              <Text style={S.sectionTitle}>Complete Technical Assessment</Text>
            </View>
            {seoFindings.length > 0 && (
              <>
                <Text style={S.categoryLabel}>SEO — Search Engine Optimization  ({seoFindings.length} issues)</Text>
                <FindingBlock findings={seoFindings} emptyText="" />
              </>
            )}
            {aeoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>AEO — Answer Engine Optimization  ({aeoFindings.length} issues)</Text>
                <FindingBlock findings={aeoFindings} emptyText="" />
              </>
            )}
            {geoFindings.length > 0 && (
              <>
                <View style={S.dividerSmall} />
                <Text style={S.categoryLabel}>GEO — Generative Engine Optimization  ({geoFindings.length} issues)</Text>
                <FindingBlock findings={geoFindings} emptyText="" />
              </>
            )}
          </View>

        </View>

        {/* ── Footer (fixed — every page) ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerBrand}>XMS · Xperience AI Marketing Solutions</Text>
          <View style={S.footerRight}>
            <Text style={S.footerText}>xperienceusa.com</Text>
            <Text style={S.footerText} render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            } />
          </View>
        </View>

      </Page>
    </Document>
  )
}
