import { Document, Page, View, Text, Image, StyleSheet, Svg, Path, Circle, Rect } from '@react-pdf/renderer'
import type { AuditResult, AuditFinding } from '@/lib/audit/types'
import { scoreLabel } from '@/lib/utils'

// Color Tokens matching HTML template
const C = {
  bg:          '#fafaf7', // cream page background
  white:       '#ffffff',
  headerBg:    '#fffdfa', // warm white header background
  ink:         '#1a2d5a', // dark blue text
  primary:     '#1557ff', // primary blue
  border:      '#dce7fb', // light blue border
  muted:       '#7d8cab', // slate muted text
  lightBg:     '#f4f7fd', // very light blue bg
  green:       '#17a667', // success green
  greenLight:  '#cfeee3',
  red:         '#d92d20', // error red
  redLight:    '#fef2f2',
  orange:      '#ffb057', // warning orange
  orangeLight: '#fffbeb',
}

const S = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#0f172a',
  },

  // ── Mini brand strip for pages 2+ (fixed, absolute) ──
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#0f172a',
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniHeaderText: {
    fontSize: 7,
    color: '#cbd5e1',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },

  // ── Header (Page 1 - Edge to Edge) ──
  header: {
    backgroundColor: C.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 0,
    marginBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoHorizontal: { height: 26, width: 85, objectFit: 'contain' },
  headerBadgeContainer: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#f7faff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    letterSpacing: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeftCol: {
    flex: 1.2,
    paddingRight: 15,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
    lineHeight: 1.15,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#304975',
    marginTop: 6,
    marginBottom: 16,
  },
  urlSearchBox: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 14,
    gap: 6,
  },
  urlSearchText: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1f3767',
  },
  headerDate: {
    fontSize: 8.5,
    color: '#4d628d',
  },
  headerRightCol: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: 160,
  },
  heroBadge: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    borderRadius: 2,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#233865',
  },

  // ── Scores (Gauges) ──
  scoreCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  scoreCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d9e7ff',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 2,
    minHeight: 175,
  },
  scoreCardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1b2f5d',
  },
  scoreGaugeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    marginBottom: 8,
    marginTop: 6,
  },
  scoreGaugeTextCenter: {
    position: 'absolute',
    top: 17,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scoreGaugePercent: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  scoreGaugeHelper: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#8c9ab8',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  scoreCardMetrics: {
    gap: 4,
    marginBottom: 8,
  },
  scoreCardMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreMetricDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  scoreMetricLabel: {
    fontSize: 7,
    color: '#42557f',
  },
  scoreMetricValue: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2d5a',
  },
  scoreCardProgressContainer: {
    height: 3,
    backgroundColor: '#edf2fb',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  scoreCardProgressBar: {
    height: '100%',
    width: '100%',
  },
  scoreCardProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  scoreCardStatusText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 1,
    borderTopColor: '#eef3fb',
    paddingTop: 5,
  },

  // ── AI Search Access ──
  aiSearchCard: {
    borderWidth: 1,
    borderColor: '#d9e7ff',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 2,
    marginBottom: 16,
  },
  aiSearchHeader: {
    marginBottom: 6,
  },
  aiSearchTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1b2f5d',
  },
  aiSearchSubtitle: {
    fontSize: 7.5,
    color: '#7d8cab',
    marginTop: 2,
  },
  aiSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  aiSearchLogo: {
    height: 11,
    width: 11,
    objectFit: 'contain',
  },
  aiSearchLabel: {
    fontSize: 8,
    marginLeft: 2,
  },
  aiSearchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiProgressBarContainer: {
    width: 36,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  aiProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  aiStatusIndicator: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  aiFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  aiFooterText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Ahrefs Band ──
  ahrefsBand: {
    backgroundColor: '#0f172a',
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  ahrefsBandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  ahrefsBandTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  ahrefsBandSub: {
    fontSize: 7.5,
    color: '#a1a1aa',
  },
  ahrefsBandGrid: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 1.5,
  },
  ahrefsMetricCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRightColor: '#edf2fb',
  },
  ahrefsMetricLabel: {
    fontSize: 7,
    color: '#3c4e76',
    textAlign: 'center',
    marginBottom: 4,
    height: 16,
  },
  ahrefsMetricValue: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#142a57',
  },

  // ── Section Title ──
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitleText: {
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1557ff',
    letterSpacing: 0.5,
  },
  sectionTitleMeta: {
    fontSize: 8.5,
    color: '#8b96b3',
  },

  // ── Executive Summary ──
  summaryContainer: {
    borderWidth: 1,
    borderColor: '#dce7fb',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomColor: '#edf2fb',
    gap: 10,
  },
  summaryIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1560ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  summaryRowText: {
    fontSize: 8.5,
    color: '#24395f',
    lineHeight: 1.55,
    flex: 1,
  },

  // ── Untapped Growth Opportunities ──
  opportunityContainer: {
    borderWidth: 1,
    borderColor: '#dce7fb',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  opportunityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomColor: '#edf2fb',
    gap: 10,
  },
  opportunityIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1560ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  opportunityRowTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#172a58',
  },
  opportunityRowDesc: {
    fontSize: 8.5,
    color: '#31466f',
    lineHeight: 1.45,
    marginTop: 3,
  },
  opportunityRowRec: {
    fontSize: 8,
    color: '#607399',
    marginTop: 5,
    lineHeight: 1.45,
  },
  opportunityImpactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  opportunityImpactText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Detailed Findings ──
  categoryTitleText: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  findingCardContainer: {
    gap: 6,
    marginBottom: 10,
  },
  findingCard: {
    borderWidth: 1,
    borderColor: '#dce7fb',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 2,
  },
  findingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  findingCardTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#172a58',
    flex: 1,
  },
  findingCardDesc: {
    fontSize: 8.5,
    color: '#31466f',
    lineHeight: 1.4,
  },

  // ── Bottom CTA ──
  ctaSection: {
    backgroundColor: '#155fff',
    borderRadius: 2,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  ctaHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  ctaParagraph: {
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  ctaButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ctaButtonText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerBrand: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#6d7ea5',
  },
  footerUrl: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
})

// Trigonometric exact vector arc drawing for gauges
function getArcPath(score: number) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)))
  if (normalized === 0) return 'M 18 62'
  const angle = 180 - normalized * 1.8 // angle in degrees
  const rad = (angle * Math.PI) / 180
  const x = 66 + 48 * Math.cos(rad)
  const y = 62 - 48 * Math.sin(rad)
  return `M 18 62 A 48 48 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`
}

function PdfGauge({ score, accent }: { score: number; accent: string }) {
  const arcPath = getArcPath(score)

  return (
    <Svg width={110} height={70} viewBox="0 0 132 84">
      {/* Background Arc */}
      <Path
        d="M 18 62 A 48 48 0 0 1 114 62"
        fill="none"
        stroke="#e8eefb"
        strokeWidth={8}
        strokeLinecap="round"
      />
      {/* Foreground Accent Arc */}
      <Path
        d={arcPath}
        fill="none"
        stroke={accent}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </Svg>
  )
}

// Custom Vector SVG Icons matching Lucide-React
const SearchIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} fill="none" />
    <Path d="m21 21-4.3-4.3" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const BrainIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
)

const GlobeIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M2 12h20" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
)

const ChartIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
)

const FileTextIcon = ({ size = 12, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const SparklesIcon = ({ size = 12, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
)

const LockIcon = ({ size = 12, color = C.muted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
)

const CheckCircleIcon = ({ size = 12, color = C.green }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="m9 12 2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const XCircleIcon = ({ size = 12, color = C.red }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="m15 9-6 6M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const CalendarIcon = ({ size = 12, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const ShieldIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const LinkIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M8 12h8" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const UsersIcon = ({ size = 12, color = C.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

const ArrowRightIcon = ({ size = 12, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
  </Svg>
)

function gaugeTone(label: string, score: number) {
  if (score < 60) {
    return { accent: '#ef4444', value: '#d92d20' }
  }
  if (label === 'Overall' || score >= 80) {
    return { accent: '#2d8cff', value: '#162b59' }
  }
  return { accent: '#ffb057', value: '#162b59' }
}

function scoreLabelToneColor(score: number) {
  if (score < 60) return '#dc2626'
  return '#0f172a'
}

function buildSummaryParagraphs(result: AuditResult) {
  const lines: string[] = []
  const activeIssues = result.findings.filter((finding) => finding.severity !== 'pass').length

  lines.push(
    `This assessment has identified ${activeIssues} optimization gap${activeIssues === 1 ? '' : 's'} quietly limiting this site's competitive position across search, AI discovery, and brand authority channels.`
  )

  if (result.scores.aeo < 70) {
    lines.push(
      `With an AEO score of ${result.scores.aeo}/100, this site is still underprepared for AI-generated answers across ChatGPT, Perplexity, and Google AI Overviews.`
    )
  }

  if (result.scores.geo < 70) {
    lines.push(
      `A GEO score of ${result.scores.geo}/100 suggests AI language models do not yet have enough trust and citation signals to recommend this business confidently.`
    )
  }

  lines.push(
    'Every competitor that closes these gaps sooner improves its odds of being discovered first in both classic search and AI-assisted buying journeys.'
  )

  return lines
}

function buildOpportunityItems(result: AuditResult) {
  const merged = [...result.quickWins, ...result.opportunities]
  const deduped = new Map<string, AuditFinding>()

  for (const item of merged) {
    if (!deduped.has(item.id)) deduped.set(item.id, item)
  }

  return Array.from(deduped.values())
}

function PdfDetailedList({ title, items, color }: { title: string; items: AuditFinding[]; color: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[S.categoryTitleText, { color }]}>{title}</Text>
      <View style={S.findingCardContainer}>
        {items.map((item) => (
          <View key={item.id} wrap={false} style={S.findingCard}>
            <View style={S.findingCardHeader}>
              <Text style={S.findingCardTitle}>{item.title}</Text>
              <View style={[S.opportunityImpactBadge, { backgroundColor: item.impact === 'high' ? '#fee2e2' : item.impact === 'medium' ? '#ffedd5' : '#f1f5f9' }]}>
                <Text style={[S.opportunityImpactText, { color: item.impact === 'high' ? '#dc2626' : item.impact === 'medium' ? '#ea580c' : '#64748b' }]}>
                  {item.impact.toUpperCase()} IMPACT
                </Text>
              </View>
            </View>
            <Text style={S.findingCardDesc}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export function AuditPdfDocument({ result }: { result: AuditResult }) {
  const domain = new URL(result.url).hostname
  const logoIconSrc = `${window.location.origin}/logo-icon.png`
  const heroAnalystPhoneSrc = `${window.location.origin}/hero-analyst-phone.png`

  const dateStr = new Date(result.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // AI Accessible signals
  const aiAccessible = !result.rawData.aiCrawlerBlocked
  const hasLlms = result.rawData.hasLlmsTxt
  const hasAuthor = result.rawData.hasAuthorInfo
  const hasSchema = result.rawData.schemas.length > 0

  const aiSearchRows = [
    { label: 'ChatGPT-User', ok: aiAccessible && hasLlms, logoSrc: `${window.location.origin}/logos/chatgpt.png` },
    { label: 'ChatGPT-SearchBot', ok: aiAccessible, logoSrc: `${window.location.origin}/logos/chatgpt.png` },
    { label: 'Gemini', ok: aiAccessible && hasSchema, logoSrc: `${window.location.origin}/logos/gemini.png` },
    { label: 'Perplexity', ok: aiAccessible && (hasAuthor || hasSchema), logoSrc: `${window.location.origin}/logos/perplexity.webp` },
  ]

  // Scores Card list
  const scoreCards = [
    { label: 'Overall', value: result.scores.overall, helper: 'overall status' },
    { label: 'SEO', value: result.scores.seo, helper: 'search readiness' },
    { label: 'AEO', value: result.scores.aeo, helper: 'answer engines' },
    { label: 'GEO', value: result.scores.geo, helper: 'AI citation health' },
  ] as const

  // Ahrefs metrics
  const ahrefsMetrics = result.ahrefs
    ? [
        { label: 'Domain Rating', value: `${result.ahrefs.domainRating}/100` },
        { label: 'Ahrefs Rank', value: `#${result.ahrefs.ahrefsRank.toLocaleString()}` },
        { label: 'Backlinks', value: result.ahrefs.backlinks.toLocaleString() },
        { label: 'Ref. Domains', value: result.ahrefs.referringDomains.toLocaleString() },
        { label: 'Organic Traffic', value: result.ahrefs.organicTraffic.toLocaleString() },
        { label: 'Organic Keywords', value: result.ahrefs.organicKeywords.toLocaleString() },
      ]
    : []

  const activeFindings = result.findings
    .filter((finding) => finding.severity !== 'pass')
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, pass: 3 }
      return (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
    })

  const seoFindings = activeFindings.filter((finding) => finding.category === 'seo')
  const aeoFindings = activeFindings.filter((finding) => finding.category === 'aeo')
  const geoFindings = activeFindings.filter((finding) => finding.category === 'geo')
  
  const summaryParagraphs = buildSummaryParagraphs(result)
  const opportunityItems = buildOpportunityItems(result)

  return (
    <Document title={`XMS AI Visibility Audit — ${domain}`} author="XMS Ai">
      
      {/* PAGE 1: Header, Scores (Gauges), AI Search Access, Ahrefs */}
      <Page size="A4" style={S.page}>
        {/* Header Banner */}
        <View style={S.header}>
          <View style={S.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Image style={{ width: 22, height: 22, objectFit: 'contain' }} src={logoIconSrc} />
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.ink }}>XMS Ai</Text>
            </View>
            <View style={S.headerBadgeContainer}>
              <SparklesIcon size={9} color={C.primary} />
              <Text style={S.headerBadgeText}>AI VISIBILITY AUDIT REPORT</Text>
            </View>
          </View>

          <View style={S.headerContent}>
            {/* Left Column */}
            <View style={S.headerLeftCol}>
              <Text style={S.headerTitle}>{'AI Search & Digital\nVisibility Audit'}</Text>
              <Text style={S.headerSubtitle}>SEO · AEO · GEO Intelligence Assessment</Text>
              <Text style={S.headerDate}>Prepared on {dateStr}  ·  For internal use only</Text>
            </View>

            {/* Right Column (Hero & Styled Badges) */}
            <View style={S.headerRightCol}>
              <Image style={{ height: 160, objectFit: 'contain' }} src={heroAnalystPhoneSrc} />
              <View style={{ flexDirection: 'column', gap: 6, marginLeft: 12, marginBottom: 24 }}>
                <View style={S.heroBadge}>
                  <SearchIcon size={14} color={C.primary} />
                  <Text style={S.heroBadgeText}>SEO</Text>
                </View>
                <View style={S.heroBadge}>
                  <BrainIcon size={14} color={C.primary} />
                  <Text style={S.heroBadgeText}>AEO</Text>
                </View>
                <View style={S.heroBadge}>
                  <GlobeIcon size={14} color={C.primary} />
                  <Text style={S.heroBadgeText}>GEO</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content Wrapper for Page 1 */}
        <View style={{ paddingHorizontal: 40, paddingTop: 16, paddingBottom: 24 }}>
          {/* Audit Results Title */}
          <View style={S.sectionTitleRow}>
            <Text style={[S.sectionTitleText, { color: C.ink }]}>AUDIT RESULTS</Text>
          </View>

          {/* Score cards (Gauges) */}
          <View style={S.scoreCardsRow}>
            {scoreCards.map((card) => {
              const tone = gaugeTone(card.label, card.value)
              const benchmark = Math.min(100, Math.max(Math.round(card.value) + (card.label === 'Overall' ? 14 : 10), Math.round(card.value)))
              return (
                <View key={card.label} style={S.scoreCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={S.scoreCardTitle}>{card.label === 'Overall' ? 'Site Health' : `${card.label} Health`}</Text>
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#f4f7fd', alignItems: 'center', justifyContent: 'center' }}>
                      {card.label === 'Overall' && <ChartIcon size={9} color="#8fa1c7" />}
                      {card.label === 'SEO' && <SearchIcon size={9} color="#8fa1c7" />}
                      {card.label === 'AEO' && <BrainIcon size={9} color="#8fa1c7" />}
                      {card.label === 'GEO' && <GlobeIcon size={9} color="#8fa1c7" />}
                    </View>
                  </View>
                  <View style={S.scoreGaugeWrapper}>
                    <PdfGauge score={card.value} accent={tone.accent} />
                    <View style={S.scoreGaugeTextCenter}>
                      <Text style={[S.scoreGaugePercent, { color: tone.value }]}>{Math.round(card.value)}%</Text>
                      <Text style={S.scoreGaugeHelper}>{card.helper.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={S.scoreCardMetrics}>
                    <View style={S.scoreCardMetricRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={[S.scoreMetricDot, { backgroundColor: tone.accent }]} />
                        <Text style={S.scoreMetricLabel}>Your site</Text>
                      </View>
                      <Text style={S.scoreMetricValue}>{Math.round(card.value)}%</Text>
                    </View>
                    <View style={S.scoreCardMetricRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={[S.scoreMetricDot, { backgroundColor: '#d5deef' }]} />
                        <Text style={S.scoreMetricLabel}>Target benchmark</Text>
                      </View>
                      <Text style={[S.scoreMetricValue, { color: '#7a8aa9' }]}>{benchmark}%</Text>
                    </View>
                  </View>
                  <View style={S.scoreCardProgressContainer}>
                    <View style={S.scoreCardProgressBar}>
                      <View style={[S.scoreCardProgressFill, { width: `${Math.max(8, Math.min(100, Math.round(card.value)))}%`, backgroundColor: tone.accent }]} />
                    </View>
                  </View>
                  <Text style={[S.scoreCardStatusText, { color: scoreLabelToneColor(card.value) }]}>
                    {scoreLabel(card.value)}
                  </Text>
                </View>
              )
            })}
          </View>

          {/* AI Search Access */}
          <View style={S.aiSearchCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={S.aiSearchTitle}>AI Search Access</Text>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#f4f7fd', alignItems: 'center', justifyContent: 'center' }}>
                <LockIcon size={9} color="#93a6cf" />
              </View>
            </View>
            <Text style={S.aiSearchSubtitle}>Signals that influence how AI platforms can crawl, interpret, and cite this site.</Text>
            
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
              {/* Left Column */}
              <View style={{ flex: 1, gap: 4 }}>
                {aiSearchRows.slice(0, 2).map(({ label, ok, logoSrc }) => (
                  <View key={label} style={S.aiSearchRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Image style={S.aiSearchLogo} src={logoSrc} />
                      <Text style={[S.aiSearchLabel, { color: ok ? '#42557f' : C.red, fontFamily: ok ? 'Helvetica' : 'Helvetica-Bold' }]}>{label}</Text>
                    </View>
                    <View style={S.aiSearchStatus}>
                      <View style={[S.aiProgressBarContainer, { backgroundColor: ok ? '#eef3fb' : C.redLight }]}>
                        <View style={[S.aiProgressBarFill, { width: ok ? '78%' : '28%', backgroundColor: ok ? '#cfeee3' : C.red }]} />
                      </View>
                      <View style={{ marginLeft: 4 }}>
                        {ok ? <CheckCircleIcon size={11} color={C.green} /> : <XCircleIcon size={11} color={C.red} />}
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Right Column */}
              <View style={{ flex: 1, gap: 4 }}>
                {aiSearchRows.slice(2, 4).map(({ label, ok, logoSrc }) => (
                  <View key={label} style={S.aiSearchRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Image style={S.aiSearchLogo} src={logoSrc} />
                      <Text style={[S.aiSearchLabel, { color: ok ? '#42557f' : C.red, fontFamily: ok ? 'Helvetica' : 'Helvetica-Bold' }]}>{label}</Text>
                    </View>
                    <View style={S.aiSearchStatus}>
                      <View style={[S.aiProgressBarContainer, { backgroundColor: ok ? '#eef3fb' : C.redLight }]}>
                        <View style={[S.aiProgressBarFill, { width: ok ? '78%' : '28%', backgroundColor: ok ? '#cfeee3' : C.red }]} />
                      </View>
                      <View style={{ marginLeft: 4 }}>
                        {ok ? <CheckCircleIcon size={11} color={C.green} /> : <XCircleIcon size={11} color={C.red} />}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[S.aiFooter, { borderTopColor: aiAccessible ? '#eef3fb' : C.redLight }]}>
              <Text style={[S.aiFooterText, { color: aiAccessible ? '#7d8cab' : C.red }]}>
                {aiAccessible ? 'Accessible to major AI crawlers' : 'Urgent: some AI crawler access is restricted'}
              </Text>
            </View>
          </View>

          {/* Ahrefs metrics */}
          {result.ahrefs && (
            <View style={S.ahrefsBand}>
              <View style={S.ahrefsBandHeader}>
                <View>
                  <Text style={S.ahrefsBandTitle}>INITIAL AUDIT RESULTS</Text>
                  <Text style={S.ahrefsBandSub}>Powered by Ahrefs</Text>
                </View>
                <Image style={{ height: 16, width: 48, objectFit: 'contain' }} src={`${window.location.origin}/logos/ahrefs.png`} />
              </View>
              <View style={S.ahrefsBandGrid}>
                {ahrefsMetrics.map((metric, index) => (
                  <View key={metric.label} style={[S.ahrefsMetricCard, { borderRightWidth: index < ahrefsMetrics.length - 1 ? 1 : 0 }]}>
                    <View style={{ marginBottom: 4 }}>
                      {metric.label === 'Domain Rating' && <ShieldIcon size={13} color={C.primary} />}
                      {metric.label === 'Ahrefs Rank' && <ChartIcon size={13} color={C.primary} />}
                      {metric.label === 'Backlinks' && <LinkIcon size={13} color={C.primary} />}
                      {metric.label === 'Ref. Domains' && <UsersIcon size={13} color={C.primary} />}
                      {metric.label === 'Organic Traffic' && <ArrowRightIcon size={13} color={C.primary} />}
                      {metric.label === 'Organic Keywords' && <SearchIcon size={13} color={C.primary} />}
                    </View>
                    <Text style={S.ahrefsMetricLabel}>{metric.label}</Text>
                    <Text style={S.ahrefsMetricValue}>{metric.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Footer (every page) */}
        <View style={S.footer} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image style={{ width: 8, height: 8, objectFit: 'contain' }} src={logoIconSrc} />
            <Text style={S.footerBrand}>XMS Ai</Text>
          </View>
          <Text style={S.footerBrand}>xperienceusa.com</Text>
        </View>
      </Page>

      {/* PAGE 2: Executive Summary & Untapped Opportunities */}
      <Page size="A4" style={[S.page, { paddingTop: 24 }]}>
        <View style={{ paddingHorizontal: 40, paddingTop: 16, paddingBottom: 24 }}>
          {/* Executive Summary */}
          <View style={{ marginTop: 6 }}>
            <Text style={S.sectionTitleText}>EXECUTIVE SUMMARY</Text>
          </View>
          <View style={S.summaryContainer}>
            {summaryParagraphs.map((paragraph, index) => (
              <View key={index} style={[S.summaryRow, { borderBottomWidth: index < summaryParagraphs.length - 1 ? 1 : 0 }]}>
                <View style={S.summaryIconCircle}>
                  {index % 4 === 0 && <FileTextIcon size={11} color="#ffffff" />}
                  {index % 4 === 1 && <BrainIcon size={11} color="#ffffff" />}
                  {index % 4 === 2 && <GlobeIcon size={11} color="#ffffff" />}
                  {index % 4 === 3 && <SparklesIcon size={11} color="#ffffff" />}
                </View>
                <Text style={S.summaryRowText}>{paragraph}</Text>
              </View>
            ))}
          </View>

          {/* Growth Opportunities */}
          {opportunityItems.length > 0 && (
            <View>
              <View style={S.sectionTitleRow}>
                <Text style={S.sectionTitleText}>UNTAPPED GROWTH OPPORTUNITIES</Text>
                <Text style={S.sectionTitleMeta}>({opportunityItems.length})</Text>
              </View>
              <View style={S.opportunityContainer}>
                {opportunityItems.map((item, index) => (
                  <View key={item.id} wrap={false} style={[S.opportunityRow, { borderBottomWidth: index < opportunityItems.length - 1 ? 1 : 0 }]}>
                    <View style={S.opportunityIconCircle}>
                      {item.category === 'seo' && <SearchIcon size={11} color="#ffffff" />}
                      {item.category === 'aeo' && <BrainIcon size={11} color="#ffffff" />}
                      {item.category === 'geo' && <GlobeIcon size={11} color="#ffffff" />}
                    </View>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={S.opportunityRowTitle}>{item.title}</Text>
                      <Text style={S.opportunityRowDesc}>{item.description}</Text>
                      {item.recommendation && (
                        <Text style={S.opportunityRowRec}>
                          <Text style={{ fontFamily: 'Helvetica-Bold', color: '#203867' }}>Recommendation: </Text>
                          {item.recommendation}
                        </Text>
                      )}
                    </View>
                    <View style={[S.opportunityImpactBadge, { backgroundColor: item.impact === 'high' ? '#fee2e2' : item.impact === 'medium' ? '#ffedd5' : '#f1f5f9' }]}>
                      <Text style={[S.opportunityImpactText, { color: item.impact === 'high' ? '#dc2626' : item.impact === 'medium' ? '#ea580c' : '#64748b' }]}>
                        {item.impact.toUpperCase()} IMPACT
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={S.footer} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image style={{ width: 8, height: 8, objectFit: 'contain' }} src={logoIconSrc} />
            <Text style={S.footerBrand}>XMS Ai</Text>
          </View>
          <Text style={S.footerBrand}>xperienceusa.com</Text>
        </View>
      </Page>

      {/* PAGE 3: Initial Technical Assessment & CTA Banner */}
      <Page size="A4" style={[S.page, { paddingTop: 24 }]}>
        <View style={{ paddingHorizontal: 40, paddingTop: 16, paddingBottom: 24 }}>
          {/* Technical findings */}
          <View style={S.sectionTitleRow}>
            <Text style={[S.sectionTitleText, { color: '#111111' }]}>INITIAL TECHNICAL ASSESSMENT</Text>
            <Text style={S.sectionTitleMeta}>{seoFindings.length + aeoFindings.length + geoFindings.length} active findings</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            {seoFindings.length > 0 && <PdfDetailedList title="SEO" items={seoFindings} color="#0e5bff" />}
            {aeoFindings.length > 0 && <PdfDetailedList title="AEO" items={aeoFindings} color="#ff6a00" />}
            {geoFindings.length > 0 && <PdfDetailedList title="GEO" items={geoFindings} color="#ff9800" />}
          </View>

          {/* Bottom CTA block */}
          <View style={S.ctaSection} wrap={false}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 }}>
              <CalendarIcon size={12} color="#ffffff" />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={S.ctaHeading}>Let's turn these insights into growth.</Text>
              <Text style={S.ctaParagraph}>Schedule a free strategy call to unlock your full AI visibility potential.</Text>
            </View>
            <View style={S.ctaButton}>
              <Text style={S.ctaButtonText}>Phone: (772) 905-3005</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={S.footer} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image style={{ width: 8, height: 8, objectFit: 'contain' }} src={logoIconSrc} />
            <Text style={S.footerBrand}>XMS Ai</Text>
          </View>
          <Text style={S.footerBrand}>xperienceusa.com</Text>
        </View>
      </Page>
    </Document>
  )
}
