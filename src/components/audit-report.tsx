import { useState } from 'react'
import { ExternalLink, AlertCircle, TrendingUp, Link2, Wrench, Check, ArrowUpRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LeadModal } from '@/components/lead-modal'
import { AuditPdfTemplate } from '@/components/audit-pdf-template'
import PdfExportButton from '@/components/pdf-export-button'
import type { AuditResult, AuditFinding, PageSpeedResult, AhrefsData } from '@/lib/audit/types'
import { scoreLabel } from '@/lib/utils'

interface AuditReportProps {
  result: AuditResult
  mode?: 'public' | 'internal'
  onBack?: () => void
  backLabel?: string
  inline?: boolean
}

// ── Score helpers ────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-500'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

const scoreBorder = (s: number) =>
  s >= 80 ? 'border-green-400' : s >= 60 ? 'border-yellow-400' : s >= 40 ? 'border-orange-400' : 'border-red-400'

const scoreGlow = (s: number) =>
  s >= 80 ? 'score-glow-green' : s >= 60 ? 'score-glow-yellow' : s >= 40 ? 'score-glow-orange' : 'score-glow-red'

function ScoreBlock({ label, score, large }: { label: string; score: number; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={`rounded-full border-4 ${scoreBorder(score)} ${scoreGlow(score)} flex items-center justify-center transition-shadow duration-300 ${large ? 'w-24 h-24' : 'w-16 h-16'}`}>
        <span className={`font-black tabular-nums leading-none ${large ? 'text-4xl' : 'text-2xl'} ${getScoreColor(score)}`}>
          {Math.round(score)}
        </span>
      </div>
      <div>
        <div className={`font-bold ${large ? 'text-base' : 'text-sm'} text-gray-900 dark:text-white`}>{label}</div>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{scoreLabel(score)}</div>
      </div>
    </div>
  )
}

// ── Core Web Vitals ──────────────────────────────────────
function cwvStatus(metric: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb', value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = { lcp: { good: 2500, poor: 4000 }, cls: { good: 0.1, poor: 0.25 }, inp: { good: 200, poor: 500 }, fcp: { good: 1800, poor: 3000 }, ttfb: { good: 800, poor: 1800 } }
  const t = thresholds[metric]
  if (value <= t.good) return 'good'
  if (value <= t.poor) return 'needs-improvement'
  return 'poor'
}
const cwvColors = {
  good: 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-700/40',
  'needs-improvement': 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-700/40',
  poor: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700/40',
}

function CoreWebVitals({ ps }: { ps: PageSpeedResult }) {
  const metrics: { key: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb'; label: string; value: string }[] = [
    { key: 'lcp', label: 'LCP', value: `${(ps.lcp / 1000).toFixed(1)}s` },
    { key: 'cls', label: 'CLS', value: `${ps.cls}` },
    { key: 'inp', label: 'INP', value: `${ps.inp}ms` },
    { key: 'fcp', label: 'FCP', value: `${(ps.fcp / 1000).toFixed(1)}s` },
    { key: 'ttfb', label: 'TTFB', value: `${ps.ttfb}ms` },
  ]
  return (
    <div className="border-t border-gray-100 dark:border-white/[0.06] px-4 md:px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-gray-800 dark:text-white text-sm">Core Web Vitals</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${ps.performanceScore >= 90 ? cwvColors.good : ps.performanceScore >= 50 ? cwvColors['needs-improvement'] : cwvColors.poor
          }`}>{ps.performanceScore}/100</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {metrics.map(({ key, label, value }) => {
          const status = cwvStatus(key, key === 'cls' ? ps.cls : Number(value.replace(/[^0-9.]/g, '')))
          return (
            <div key={key} className={`rounded-xl border p-3 text-center ${cwvColors[status]}`}>
              <div className="text-xs font-semibold opacity-70 mb-1">{label}</div>
              <div className="text-base font-bold">{value}</div>
              <div className="text-[10px] mt-0.5 capitalize">{status.replace('-', ' ')}</div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Measured on mobile · Powered by Google PageSpeed Insights</p>
    </div>
  )
}

// ── Overview ─────────────────────────────────────────────
function OverviewSection({ summary }: { summary: string }) {
  const paragraphs = summary.split('\n\n').filter(Boolean)
  const [first, ...rest] = paragraphs
  return (
    <div className="px-4 md:px-6 pt-5 pb-5 border-b border-gray-100 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-indigo-500 flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-400">
          Overview
        </span>
      </div>
      {first && (
        <p className="text-gray-900 dark:text-gray-100 text-[15px] font-semibold leading-relaxed mb-3">
          {first}
        </p>
      )}
      {rest.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-2.5 last:mb-0">
          {p}
        </p>
      ))}
    </div>
  )
}

// ── Domain Authority (Ahrefs) ────────────────────────────
function DomainAuthority({ data }: { data: AhrefsData }) {
  const drColor =
    data.domainRating >= 60 ? 'text-green-600 dark:text-green-400'
      : data.domainRating >= 30 ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  const metrics = [
    { label: 'Domain Rating', value: `${data.domainRating}/100`, highlight: true },
    { label: 'Ahrefs Rank', value: `#${data.ahrefsRank.toLocaleString()}`, highlight: false },
    { label: 'Backlinks', value: data.backlinks.toLocaleString(), highlight: false },
    { label: 'Ref. Domains', value: data.referringDomains.toLocaleString(), highlight: false },
    { label: 'Organic Traffic', value: data.organicTraffic.toLocaleString(), highlight: false },
    { label: 'Organic Keywords', value: data.organicKeywords.toLocaleString(), highlight: false },
  ]

  return (
    <div className="px-4 md:px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-gray-800 dark:text-white text-sm">Domain Authority</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 bg-indigo-50 dark:border-indigo-700/40 dark:bg-indigo-900/20 ${drColor}`}>
          DR {data.domainRating}/100
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {metrics.map(({ label, value, highlight }) => (
          <div key={label} className="rounded-xl border border-gray-100 dark:border-white/[0.07] bg-gray-50/60 dark:bg-white/[0.03] p-3 text-center">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">{label}</div>
            <div className={`text-base font-bold ${highlight ? drColor : 'text-gray-900 dark:text-white'}`}>{value}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Powered by Ahrefs</p>
    </div>
  )
}

// ── Finding badges ───────────────────────────────────────
const severityDot: Record<string, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
  pass: 'bg-green-400',
}
const severityBadge: Record<string, string> = {
  critical: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/40',
  warning: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/40',
  info: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/40',
  pass: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/40',
}
const impactBadge: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/40',
  medium: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/40',
  low: 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-white/[0.04] dark:text-gray-400 dark:border-white/10',
}
const categoryBadge: Record<string, string> = {
  seo: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/40',
  aeo: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700/40',
  geo: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-700/40',
}

// ── Finding card (mobile) ────────────────────────────────
function FindingCard({ finding }: { finding: AuditFinding }) {
  return (
    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05] last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors">
      <div className="flex items-start gap-2.5 mb-1">
        <span className={`mt-0.5 block w-2 h-2 rounded-full flex-shrink-0 ${severityDot[finding.severity] ?? 'bg-gray-300'}`} />
        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">{finding.title}</p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 pl-4">{finding.description}</p>
      <div className="flex flex-wrap gap-1.5 pl-4">
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${categoryBadge[finding.category] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
          {finding.category}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${severityBadge[finding.severity] ?? severityBadge.info}`}>
          {finding.severity}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${impactBadge[finding.impact] ?? impactBadge.low}`}>
          {finding.impact}
        </span>
      </div>
    </div>
  )
}

// ── Finding row (desktop table) ──────────────────────────
function FindingRow({ finding }: { finding: AuditFinding }) {
  return (
    <tr className="border-b border-gray-100 dark:border-white/[0.05] last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors">
      <td className="pl-6 pr-3 py-4 w-4 align-top pt-[18px]">
        <span className={`block w-2 h-2 rounded-full flex-shrink-0 ${severityDot[finding.severity] ?? 'bg-gray-300'}`} />
      </td>
      <td className="py-4 pr-4">
        <div className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">{finding.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{finding.description}</div>
      </td>
      <td className="py-4 pr-4 w-16">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap ${categoryBadge[finding.category] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
          {finding.category}
        </span>
      </td>
      <td className="py-4 pr-4 w-20">
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize whitespace-nowrap ${severityBadge[finding.severity] ?? severityBadge.info}`}>
          {finding.severity}
        </span>
      </td>
      <td className="py-4 pr-6 w-20">
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize whitespace-nowrap ${impactBadge[finding.impact] ?? impactBadge.low}`}>
          {finding.impact}
        </span>
      </td>
    </tr>
  )
}

function FindingsTable({ findings, emptyLabel }: { findings: AuditFinding[]; emptyLabel: string }) {
  if (findings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm px-6">
        <Check className="w-7 h-7 mx-auto mb-2 text-green-400" />
        {emptyLabel}
      </div>
    )
  }
  return (
    <>
      {/* Mobile: card list */}
      <div className="md:hidden">
        {findings.map(f => <FindingCard key={f.id} finding={f} />)}
      </div>

      {/* Desktop: table */}
      <table className="hidden md:table w-full table-fixed">
        <colgroup>
          <col className="w-8" />
          <col />
          <col className="w-16" />
          <col className="w-24" />
          <col className="w-20" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100 dark:border-white/[0.06]">
            <th className="pl-6 pr-3 py-3" />
            <th className="py-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Issue</th>
            <th className="py-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Cat.</th>
            <th className="py-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Severity</th>
            <th className="py-3 pr-6 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Impact</th>
          </tr>
        </thead>
        <tbody>
          {findings.map(f => <FindingRow key={f.id} finding={f} />)}
        </tbody>
      </table>
    </>
  )
}

// ── Commercial pitch ─────────────────────────────────────
function CriticalPitch({ count, domain }: { count: number; domain: string }) {
  if (count === 0) return null
  return (
    <div className="mx-4 md:mx-6 mb-2 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/10 border border-red-100 dark:border-red-700/30 px-4 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {count} critical {count === 1 ? 'issue' : 'issues'} found on {domain}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            These issues are actively blocking ChatGPT, Claude, and Gemini from finding and recommending your business. Every day they go unfixed, your competitors capture that AI-driven traffic instead.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Scores section ───────────────────────────────────────
function ScoresSection({ scores }: { scores: AuditResult['scores'] }) {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 border-b border-gray-100 dark:border-white/[0.06]">
      {/* Mobile: Overall on top, SEO/AEO/GEO below */}
      <div className="md:hidden space-y-6">
        <div className="flex justify-center">
          <ScoreBlock label="Overall" score={scores.overall} large />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ScoreBlock label="SEO" score={scores.seo} />
          <ScoreBlock label="AEO" score={scores.aeo} />
          <ScoreBlock label="GEO" score={scores.geo} />
        </div>
      </div>
      {/* Desktop: all in one row */}
      <div className="hidden md:flex items-center justify-center gap-12">
        <ScoreBlock label="Overall" score={scores.overall} large />
        <div className="w-px h-16 bg-gray-200 dark:bg-white/10 self-center" />
        <ScoreBlock label="SEO" score={scores.seo} />
        <ScoreBlock label="AEO" score={scores.aeo} />
        <ScoreBlock label="GEO" score={scores.geo} />
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────
export function AuditReport({ result, mode = 'public', onBack, backLabel = 'Back to home', inline = false }: AuditReportProps) {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const { scores } = result
  const domain = new URL(result.url).hostname

  const severityOrder = { critical: 0, warning: 1, info: 2, pass: 3 }
  const allFindings = [...result.findings]
    .filter(f => f.severity !== 'pass')
    .sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9))
  const seoFindings = allFindings.filter(f => f.category === 'seo')
  const aeoFindings = allFindings.filter(f => f.category === 'aeo')
  const geoFindings = allFindings.filter(f => f.category === 'geo')

  if (mode === 'internal') {
    return (
      <div className="w-full">
        <div className={inline ? 'border-t border-gray-100 dark:border-white/[0.07]' : 'pt-6 pb-12'}>
          <AuditPdfTemplate result={result} showExport />
        </div>
      </div>
    )
  }

  if (inline) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
            >
              {domain}
              <ExternalLink className="w-4 h-4 opacity-50" />
            </a>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(result.createdAt).toLocaleString()}</p>
          </div>
          <PdfExportButton />
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <ScoresSection scores={scores} />
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <OverviewSection summary={result.executiveSummary} />
        </div>

        <CriticalPitch count={result.criticalIssues.length} domain={domain} />

        {result.pageSpeed && (
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-2xl overflow-hidden">
            <CoreWebVitals ps={result.pageSpeed} />
          </div>
        )}

        {result.ahrefs && (
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-2xl overflow-hidden">
            <DomainAuthority data={result.ahrefs} />
          </div>
        )}

        <div>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Findings</span>
              <div className="overflow-x-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2.5 h-7">All ({allFindings.length})</TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs px-2.5 h-7">SEO ({seoFindings.length})</TabsTrigger>
                  <TabsTrigger value="aeo" className="text-xs px-2.5 h-7">AEO ({aeoFindings.length})</TabsTrigger>
                  <TabsTrigger value="geo" className="text-xs px-2.5 h-7">GEO ({geoFindings.length})</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-2xl overflow-hidden">
              {(['all', 'seo', 'aeo', 'geo'] as const).map(cat => (
                <TabsContent key={cat} value={cat} className="mt-0">
                  <FindingsTable
                    findings={cat === 'all' ? allFindings : cat === 'seo' ? seoFindings : cat === 'aeo' ? aeoFindings : geoFindings}
                    emptyLabel={`No ${cat === 'all' ? '' : cat.toUpperCase() + ' '}findings.`}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* ── Dark hero header ── */}
      <div className="relative overflow-hidden bg-[#060d20] pb-24 md:pb-28">
        <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-700/[0.18] rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-40 w-[500px] h-[500px] bg-purple-700/[0.13] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 hero-dots opacity-50" />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-24 text-center">
          <div className="flex justify-center mb-6 md:mb-8">
            <img src="/LOGO - BLACK BACKGROUND.webp" alt="XMS Audit Lab" className="h-10 md:h-12 w-auto" />
          </div>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-xl md:text-3xl font-bold hover:text-blue-100 transition-colors mb-2 break-all"
          >
            {domain}
            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 opacity-60 flex-shrink-0" />
          </a>
          <h1 className="text-sm md:text-lg font-semibold text-blue-200/70 tracking-wide mb-3">
            SEO · AEO · GEO Report
          </h1>
          <p className="text-blue-200/50 text-xs mb-6 md:mb-8">{new Date(result.createdAt).toLocaleString()}</p>

          {mode === 'public' && (
            <button
              onClick={() => setShowLeadModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white font-bold px-5 py-3 rounded-xl cursor-pointer transition-all border-2 border-white/50 dark:border-blue-500/50 shadow-lg shadow-black/20 dark:shadow-blue-900/40 text-sm"
            >
              <Wrench className="w-6 h-6" />
              Fix My Site
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Card overlapping hero ── */}
      <div className="max-w-5xl mx-auto px-3 md:px-4 -mt-16 md:-mt-20 pb-12 relative z-10">

        <div className="flex items-center justify-between mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </button>
          )}
          <span className="ml-auto text-xs font-semibold uppercase tracking-widest text-white/40">
            Website Audit Report
          </span>
        </div>

        <div className="bg-white dark:bg-[#0c1120] shadow-2xl shadow-blue-950/20 dark:shadow-black/40 overflow-hidden border border-gray-100 dark:border-white/[0.07] rounded-2xl">

          {/* Scores */}
          <ScoresSection scores={scores} />

          {/* Executive summary */}
          <OverviewSection summary={result.executiveSummary} />

          {/* Commercial pitch (public only) */}
          {mode === 'public' && (
            <div className="pt-4">
              <CriticalPitch count={result.criticalIssues.length} domain={domain} />
            </div>
          )}

          {/* Core Web Vitals */}
          {result.pageSpeed && <CoreWebVitals ps={result.pageSpeed} />}

          {/* Findings */}
          <div className="px-3 md:px-6 pt-5 pb-2">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between mb-4 gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">Findings</span>
                <div className="overflow-x-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs px-2.5 h-7">All ({allFindings.length})</TabsTrigger>
                    <TabsTrigger value="seo" className="text-xs px-2.5 h-7">SEO ({seoFindings.length})</TabsTrigger>
                    <TabsTrigger value="aeo" className="text-xs px-2.5 h-7">AEO ({aeoFindings.length})</TabsTrigger>
                    <TabsTrigger value="geo" className="text-xs px-2.5 h-7">GEO ({geoFindings.length})</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-white/[0.07] overflow-hidden">
                <TabsContent value="all" className="mt-0">
                  <FindingsTable findings={allFindings} emptyLabel="No findings." />
                </TabsContent>
                <TabsContent value="seo" className="mt-0">
                  <FindingsTable findings={seoFindings} emptyLabel="No SEO findings." />
                </TabsContent>
                <TabsContent value="aeo" className="mt-0">
                  <FindingsTable findings={aeoFindings} emptyLabel="No AEO findings." />
                </TabsContent>
                <TabsContent value="geo" className="mt-0">
                  <FindingsTable findings={geoFindings} emptyLabel="No GEO findings." />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Bottom CTA (public only) */}
          {mode === 'public' && (
            <div className="mx-3 md:mx-6 mt-4 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-center text-white">
              <Sparkles className="w-5 h-5 mx-auto mb-2 text-amber-300" />
              <p className="font-bold text-base mb-1">Ready to fix these issues?</p>
              <p className="text-blue-100 text-xs mb-4 max-w-sm mx-auto leading-relaxed">
                Our team handles every fix — from technical SEO to schema markup to AI visibility — so you don't have to.
              </p>
              <button
                onClick={() => setShowLeadModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3 rounded-xl cursor-pointer transition-colors text-sm"
              >
                <Wrench className="w-4 h-4" />
                Get a Free Strategy Call
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Domain Authority — standalone card outside main report card */}
      {result.ahrefs && (
        <div className="max-w-5xl mx-auto px-3 md:px-4 pb-4">
          <div className="bg-white dark:bg-[#0c1120] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
            <DomainAuthority data={result.ahrefs} />
          </div>
        </div>
      )}

      {showLeadModal && (
        <LeadModal result={result} onClose={() => setShowLeadModal(false)} />
      )}
    </div>
  )
}
