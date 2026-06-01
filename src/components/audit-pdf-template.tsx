import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarDays,
  ChartColumnBig,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe2,
  Lock,
  Link2,
  Search,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PdfExportButton from '@/components/pdf-export-button'
import { scoreLabel } from '@/lib/utils'
import type { AuditFinding, AuditResult } from '@/lib/audit/types'

const scoreIconMap = {
  Overall: ChartColumnBig,
  SEO: Search,
  AEO: Brain,
  GEO: Globe2,
} as const

const summaryIcons = [FileText, Brain, Globe2, Sparkles]

const categoryTone: Record<AuditFinding['category'], string> = {
  seo: 'text-[#0e5bff]',
  aeo: 'text-[#ff6a00]',
  geo: 'text-[#ff9800]',
}

const impactTone: Record<AuditFinding['impact'], string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-orange-50 text-orange-500',
  low: 'bg-slate-100 text-slate-500',
}

function gaugeTone(label: keyof typeof scoreIconMap, score: number) {
  if (score < 60) {
    return {
      accent: '#ef4444',
      card: 'border-[#d9e7ff] bg-white',
      value: 'text-[#d92d20]',
    }
  }

  if (label === 'Overall') {
    return {
      accent: '#2d8cff',
      card: 'border-[#d9e7ff] bg-white',
      value: 'text-[#162b59]',
    }
  }

  if (score >= 80) {
    return {
      accent: '#2d8cff',
      card: 'border-[#d9e7ff] bg-white',
      value: 'text-[#162b59]',
    }
  }

  return {
    accent: '#ffb057',
    card: 'border-[#d9e7ff] bg-white',
    value: 'text-[#162b59]',
  }
}

function scoreLabelTone(score: number) {
  if (score < 60) return 'text-red-600'
  return 'text-[#0f172a]'
}

function Gauge({ score, accent }: { score: number; accent: string }) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)))
  const radius = 48
  const circumference = Math.PI * radius
  const dashOffset = circumference * (1 - normalized / 100)

  return (
    <svg viewBox="0 0 132 84" className="h-[78px] w-[132px]">
      <path
        d="M 18 56 A 48 48 0 0 1 114 56"
        fill="none"
        stroke="#e8eefb"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 18 56 A 48 48 0 0 1 114 56"
        fill="none"
        stroke={accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
      />
    </svg>
  )
}

function ScoreGaugeCard({
  label,
  score,
  helper,
}: {
  label: keyof typeof scoreIconMap
  score: number
  helper: string
}) {
  const Icon = scoreIconMap[label]
  const tone = gaugeTone(label, score)
  const benchmark = Math.min(100, Math.max(Math.round(score) + (label === 'Overall' ? 14 : 10), Math.round(score)))
  const title = label === 'Overall' ? 'Site Health' : `${label} Health`

  return (
    <article className={`report-avoid-break flex min-h-[295px] flex-col border px-4 py-4 ${tone.card}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[15px] font-bold leading-tight text-[#1b2f5d]">{title}</div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f7fd]">
          <Icon className="h-4 w-4 text-[#8fa1c7]" />
        </div>
      </div>

      <div className="relative mb-4 mt-2 flex justify-center">
        <Gauge score={score} accent={tone.accent} />
        <div className="absolute inset-x-0 top-[38px] text-center">
          <div className={`text-[30px] font-bold leading-none tracking-[-0.03em] ${tone.value}`}>{Math.round(score)}%</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#8c9ab8]">{helper}</div>
        </div>
      </div>

      <div className="space-y-2.5 text-[12px]">
        <div className="flex items-center justify-between gap-3 text-[#42557f]">
          <span className="inline-flex items-center gap-2 leading-none">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone.accent }} />
            Your site
          </span>
          <span className="font-semibold text-[#1a2d5a]">{Math.round(score)}%</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[#7a8aa9]">
          <span className="inline-flex items-center gap-2 leading-none">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d5deef]" />
            Target benchmark
          </span>
          <span>{benchmark}%</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.max(8, Math.min(100, Math.round(score)))}%`, backgroundColor: tone.accent }}
          />
        </div>
        <div className={`border-t border-[#eef3fb] pt-3 text-[14px] font-semibold ${scoreLabelTone(score)}`}>
          {scoreLabel(score)}
        </div>
      </div>
    </article>
  )
}

function AiSearchCard({ result }: { result: AuditResult }) {
  const aiAccessible = !result.rawData.aiCrawlerBlocked
  const hasLlms = result.rawData.hasLlmsTxt
  const hasAuthor = result.rawData.hasAuthorInfo
  const hasSchema = result.rawData.schemas.length > 0

  const rows = [
    { label: 'ChatGPT-User', ok: aiAccessible && hasLlms, logo: '/logos/chatgpt.png' },
    { label: 'ChatGPT-SearchBot', ok: aiAccessible, logo: '/logos/chatgpt.png' },
    { label: 'Gemini', ok: aiAccessible && hasSchema, logo: '/logos/gemini.png' },
    { label: 'Perplexity', ok: aiAccessible && (hasAuthor || hasSchema), logo: '/logos/perplexity.webp' },
  ]

  return (
    <article className="report-avoid-break border border-[#d9e7ff] bg-white px-5 py-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[16px] font-bold text-[#1b2f5d]">AI Search Access</div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f7fd]">
          <Lock className="h-4 w-4 text-[#93a6cf]" />
        </div>
      </div>

      <div className="mb-5 max-w-[620px] text-[13px] leading-6 text-[#7d8cab]">
        Signals that influence how AI platforms can crawl, interpret, and cite this site.
      </div>

      <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
        {rows.map(({ label, ok, logo }) => (
          <div key={label} className="grid grid-cols-[28px_minmax(0,1fr)_96px] items-center gap-3 text-[13px]">
            <img src={logo} alt={label} className="h-5 w-5 object-contain" />
            <span className={`truncate ${ok ? 'text-[#42557f]' : 'font-semibold text-red-600'}`}>{label}</span>
            <div className="flex items-center justify-end gap-2">
              <span className={`h-3 w-20 overflow-hidden rounded-full ${ok ? 'bg-[#eef3fb]' : 'bg-red-100'}`}>
                <span className={`block h-full rounded-full ${ok ? 'bg-[#cfeee3]' : 'bg-red-500'}`} style={{ width: ok ? '78%' : '28%' }} />
              </span>
              {ok ? (
                <CheckCircle2 className="h-4 w-4 text-[#17a667]" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-5 border-t pt-3 text-[12px] font-semibold ${aiAccessible ? 'border-[#eef3fb] text-[#7d8cab]' : 'border-red-100 text-red-600'}`}>
        {aiAccessible ? 'Accessible to major AI crawlers' : 'Urgent: some AI crawler access is restricted'}
      </div>
    </article>
  )
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

function SectionTitle({
  title,
  meta,
  titleClassName = 'text-[#1557ff]',
  metaClassName = 'text-[#8b96b3]',
}: {
  title: string
  meta?: string
  titleClassName?: string
  metaClassName?: string
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className={`text-[19px] font-bold uppercase tracking-[0.04em] ${titleClassName}`}>{title}</h2>
      {meta && <span className={`pb-0.5 text-sm text-right ${metaClassName}`}>{meta}</span>}
    </div>
  )
}

function SummaryRows({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="overflow-hidden border border-[#dce7fb] bg-white">
      {paragraphs.map((paragraph, index) => {
        const Icon = summaryIcons[index % summaryIcons.length]
        return (
          <div
            key={paragraph}
            className={`report-avoid-break grid grid-cols-[56px_1fr] items-start gap-4 px-6 py-5 ${index < paragraphs.length - 1 ? 'border-b border-[#edf2fb]' : ''}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1560ff] text-white shadow-[0_10px_24px_rgba(21,96,255,0.18)]">
              <Icon className="h-6 w-6" />
            </div>
            <p className="pt-1 text-[15px] leading-8 text-[#24395f]">{paragraph}</p>
          </div>
        )
      })}
    </div>
  )
}

function ScoreCards({ result }: { result: AuditResult }) {
  const cards = [
    { label: 'Overall', value: result.scores.overall, helper: 'overall status' },
    { label: 'SEO', value: result.scores.seo, helper: 'search readiness' },
    { label: 'AEO', value: result.scores.aeo, helper: 'answer engines' },
    { label: 'GEO', value: result.scores.geo, helper: 'AI citation health' },
  ] as const

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <ScoreGaugeCard
            key={card.label}
            label={card.label}
            score={card.value}
            helper={card.helper}
          />
        ))}
      </div>
      <AiSearchCard result={result} />
    </div>
  )
}

function AhrefsBand({ result }: { result: AuditResult }) {
  if (!result.ahrefs) return null

  const metrics = [
    { label: 'Domain Rating', value: `${result.ahrefs.domainRating}/100`, icon: Shield },
    { label: 'Ahrefs Rank', value: `#${result.ahrefs.ahrefsRank.toLocaleString()}`, icon: ChartColumnBig },
    { label: 'Backlinks', value: result.ahrefs.backlinks.toLocaleString(), icon: Link2 },
    { label: 'Ref. Domains', value: result.ahrefs.referringDomains.toLocaleString(), icon: Users },
    { label: 'Organic Traffic', value: result.ahrefs.organicTraffic.toLocaleString(), icon: ArrowRight },
    { label: 'Organic Keywords', value: result.ahrefs.organicKeywords.toLocaleString(), icon: Search },
  ]

  return (
    <div className="overflow-hidden border-[3px] border-[#0f172a] bg-[#0f172a]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 text-white">
        <div>
          <div className="text-[18px] font-bold uppercase tracking-[0.04em]">Initial Audit Results</div>
          <div className="mt-1 text-sm text-white/70">Powered by Ahrefs</div>
        </div>
        <img src="/logos/ahrefs.png" alt="Ahrefs" className="h-8 w-auto object-contain" />
      </div>

      <div className="bg-white px-2 py-1">
        <div className="grid md:grid-cols-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={metric.label}
                className={`report-avoid-break flex min-h-[132px] flex-col items-center justify-start px-5 py-5 text-center ${index < metrics.length - 1 ? 'md:border-r md:border-[#edf2fb]' : ''}`}
              >
                <div className="mb-3 flex justify-center text-[#1557ff]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-h-[40px] text-sm leading-5 text-[#3c4e76]">{metric.label}</div>
                <div className="mt-3 text-[18px] font-bold leading-none text-[#142a57]">{metric.value}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OpportunityList({ title, items }: { title: string; items: AuditFinding[] }) {
  if (items.length === 0) return null

  return (
    <section className="mb-8">
      <SectionTitle title={title} meta={items.length > 0 ? `(${items.length})` : undefined} />
      <div className="overflow-hidden border border-[#dce7fb] bg-white">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`report-avoid-break grid grid-cols-[64px_1fr_160px] items-start gap-4 py-5 ${item.severity === 'critical' ? 'pl-5 pr-6 border-l-4 border-l-red-500 bg-red-50/30' : 'px-6'} ${index < items.length - 1 ? 'border-b border-[#edf2fb]' : ''}`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1560ff] text-white shadow-[0_10px_24px_rgba(21,96,255,0.16)]">
              {item.category === 'seo' && <Search className="h-6 w-6" />}
              {item.category === 'aeo' && <Brain className="h-6 w-6" />}
              {item.category === 'geo' && <Globe2 className="h-6 w-6" />}
            </div>

            <div className="min-w-0">
              <h3 className="text-[18px] font-bold text-[#172a58]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#31466f]">{item.description}</p>
              {item.recommendation && (
                <p className="mt-3 text-sm leading-6 text-[#607399]">
                  <span className="font-semibold text-[#203867]">Recommendation:</span> {item.recommendation}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <div className={`mt-1 inline-flex min-w-[120px] items-center justify-center px-4 py-3 text-center text-[15px] font-bold uppercase ${impactTone[item.impact]}`}>
                {item.impact} impact
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function DetailedFindingList({ title, items }: { title: string; items: AuditFinding[] }) {
  if (items.length === 0) return null

  return (
    <div className="mb-6">
      <div className={`mb-3 text-[17px] font-bold uppercase tracking-[0.02em] ${categoryTone[items[0].category]}`}>{title}</div>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className={`report-avoid-break border bg-white px-5 py-4 ${item.severity === 'critical' ? 'border-l-4 border-l-red-500 border-t-[#dce7fb] border-r-[#dce7fb] border-b-[#dce7fb] bg-red-50/40' : 'border-[#dce7fb]'}`}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold text-[#172a58]">{item.title}</h3>
              <div className={`inline-flex px-3 py-2 text-[13px] font-bold uppercase ${impactTone[item.impact]}`}>
                {item.impact} impact
              </div>
            </div>
            <p className="text-[15px] leading-7 text-[#31466f]">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function AuditPdfTemplate({
  result,
  showExport = false,
  mode = 'internal',
  onBack,
  backLabel,
  onCtaClick,
}: {
  result: AuditResult
  showExport?: boolean
  mode?: 'public' | 'internal'
  onBack?: () => void
  backLabel?: string
  onCtaClick?: () => void
}) {
  const domain = new URL(result.url).hostname
  const createdAt = new Date(result.createdAt)
  const dateLabel = createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const activeFindings = result.findings
    .filter((finding) => finding.severity !== 'pass')
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, pass: 3 }
      return (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
    })

  const summaryParagraphs = buildSummaryParagraphs(result)
  const seoFindings = activeFindings.filter((finding) => finding.category === 'seo')
  const aeoFindings = activeFindings.filter((finding) => finding.category === 'aeo')
  const geoFindings = activeFindings.filter((finding) => finding.category === 'geo')
  const growthItems = buildOpportunityItems(result)

  return (
    <div className="report-shell mx-auto w-full max-w-[1100px] px-4 py-8 bg-[#f4f7fd] dark:bg-[#f4f7fd] print:max-w-none print:px-0 print:py-0">
      {showExport && (
        <div className="mb-5 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-4">
            {onBack && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-1.5 text-slate-600 hover:text-slate-950 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Button>
                <div className="h-6 w-px bg-slate-200" />
              </>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {mode === 'internal' ? 'PDF Template Preview' : 'Website Audit Report'}
              </p>
              <p className="text-xs text-slate-500">
                {mode === 'internal'
                  ? 'This internal view mirrors the report layout that will be exported.'
                  : `Report for ${domain}`}
              </p>
            </div>
          </div>
          <PdfExportButton result={result} variant="default" size="default" className="gap-2" />
        </div>
      )}

      <article className="report-page overflow-hidden border border-[#d5e3fb] bg-[#fafaf7] dark:bg-[#fafaf7] dark:border-[#d5e3fb] shadow-[0_24px_70px_rgba(15,23,42,0.10)] print:border-0 print:shadow-none">
        <header className="border-b border-[#dce7fb] bg-[#fffdfa] px-10 pt-10 pb-0">
          <div className="mb-8 flex items-start justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src="/logo-horizontal.webp" alt="XMS" className="h-11 w-auto" />
            </div>
            <div className="inline-flex items-center gap-2 border border-[#dce7fb] bg-[#f7faff] px-5 py-3 text-[13px] font-bold uppercase tracking-[0.03em] text-[#1557ff]">
              <Sparkles className="h-4 w-4" />
              AI Visibility Audit Report
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h1 className="max-w-[580px] text-[54px] font-bold leading-[1.06] tracking-[-0.03em] text-[#1a2d5a] [hyphens:none]">
                AI Search & Digital Visibility Audit
              </h1>
              <p className="mt-4 text-[22px] font-semibold text-[#304975]">SEO · AEO · GEO Intelligence Assessment</p>

              <div className="mt-8 flex max-w-[560px] items-center gap-3 rounded-full border border-[#dce7fb] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <Search className="h-5 w-5 flex-shrink-0 text-[#1557ff]" />
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate text-[18px] font-medium text-[#1f3767] no-underline"
                >
                  {domain}
                </a>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-[#6d80a9]" />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 pb-5 text-[12px] text-[#4d628d]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#1557ff]" />
                  Prepared on {dateLabel}
                </span>
                <span>·</span>
                <span>For internal use only</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative h-[350px] w-full max-w-[440px] overflow-visible">
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-start">
                  <img
                    src="/hero-analyst-phone.png"
                    alt="Analyst holding a phone"
                    className="h-[350px] w-auto max-w-none object-contain object-bottom"
                  />
                </div>
                <div className="absolute right-0 top-10 z-10 flex flex-col gap-4">
                  {[
                    { label: 'SEO', icon: Search },
                    { label: 'AEO', icon: Brain },
                    { label: 'GEO', icon: Globe2 },
                  ].map(({ label, icon: Icon }) => (
                    <div key={label} className="flex w-24 flex-col items-center gap-2 border border-[#dce7fb] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                      <Icon className="h-8 w-8 text-[#1557ff]" />
                      <span className="text-[14px] font-bold text-[#233865]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-10 py-8">
          <section className="mb-8">
            <SectionTitle title="Audit Results" />
            <ScoreCards result={result} />
          </section>

          {result.ahrefs && (
            <section className="mb-8">
              <AhrefsBand result={result} />
            </section>
          )}

          <section className="mb-8">
            <SectionTitle title="Executive Summary" />
            <SummaryRows paragraphs={summaryParagraphs} />
          </section>

          {growthItems.length > 0 && (
            <OpportunityList title="Untapped Growth Opportunities" items={growthItems} />
          )}

          <section className="mb-8">
            <SectionTitle
              title="Initial Technical Assessment"
              meta={`${activeFindings.length} active findings`}
              titleClassName="text-[#111111]"
              metaClassName="text-[#6f7c98]"
            />
            <DetailedFindingList title="SEO" items={seoFindings} />
            <DetailedFindingList title="AEO" items={aeoFindings} />
            <DetailedFindingList title="GEO" items={geoFindings} />
          </section>

          <section className="overflow-hidden bg-gradient-to-r from-[#1257f2] via-[#155fff] to-[#0d53ea] px-6 py-6 text-white shadow-[0_18px_34px_rgba(21,87,255,0.20)]">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center bg-white/12">
                  <CalendarDays className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold">Let's turn these insights into growth.</h3>
                  <p className="mt-1 max-w-[520px] text-[15px] leading-7 text-white/85">
                    Schedule a free strategy call to unlock your full AI visibility potential.
                  </p>
                </div>
              </div>
              <div className="flex justify-start md:justify-end">
                {onCtaClick ? (
                  <button
                    onClick={onCtaClick}
                    className="inline-flex items-center gap-4 rounded-full border-[3px] border-[#2b6bff] bg-white hover:bg-white/95 px-7 py-4 text-[16px] font-bold tracking-[0.02em] text-[#1257f2] cursor-pointer transition-colors shadow-lg"
                  >
                    <span>Get Free Strategy Call</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <a
                    href="tel:+17729053005"
                    className="inline-flex items-center gap-4 rounded-full border-[3px] border-white/45 bg-white/12 px-7 py-4 text-[16px] font-bold tracking-[0.02em] text-white backdrop-blur-sm no-underline hover:bg-white/20 transition-colors"
                  >
                    <span>Phone: (772) 905-3005</span>
                    <ArrowRight className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="flex items-center justify-between gap-4 px-10 py-5 text-[14px] text-[#6d7ea5]">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="XMS" className="h-8 w-8" />
            <span>XMS Ai</span>
          </div>
          <span className="text-[#111111] font-semibold uppercase tracking-wide">Xperience AI Marketing</span>
        </footer>
      </article>
    </div>
  )
}
