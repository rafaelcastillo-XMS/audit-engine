import { useState, lazy, Suspense } from 'react'
import { FileDown, ExternalLink, AlertCircle, Lightbulb, TrendingUp, Info, Wrench, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreCard } from '@/components/score-card'
import { LeadModal } from '@/components/lead-modal'
import type { AuditResult, AuditFinding, PageSpeedResult } from '@/lib/audit/types'
import { severityColor, impactBadge } from '@/lib/utils'

const PdfExportButton = lazy(() => import('@/components/pdf-export-button'))

interface AuditReportProps {
  result: AuditResult
  mode?: 'public' | 'internal'
}

// Google CWV thresholds
function cwvStatus(metric: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb', value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    lcp:  { good: 2500, poor: 4000 },
    cls:  { good: 0.1,  poor: 0.25 },
    inp:  { good: 200,  poor: 500  },
    fcp:  { good: 1800, poor: 3000 },
    ttfb: { good: 800,  poor: 1800 },
  }
  const t = thresholds[metric]
  if (value <= t.good) return 'good'
  if (value <= t.poor) return 'needs-improvement'
  return 'poor'
}

const cwvColors = {
  good:               'text-green-600 dark:text-green-400 bg-green-50 border-green-200 dark:border-green-800/40',
  'needs-improvement':'text-amber-600 dark:text-amber-400 bg-amber-50 border-amber-200 dark:border-amber-800/40',
  poor:               'text-red-600 dark:text-red-400 bg-red-50 border-red-200 dark:border-red-800/40',
}

function CoreWebVitals({ ps }: { ps: PageSpeedResult }) {
  const metrics: { key: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb'; label: string; value: string }[] = [
    { key: 'lcp',  label: 'LCP',  value: `${(ps.lcp / 1000).toFixed(1)}s` },
    { key: 'cls',  label: 'CLS',  value: `${ps.cls}` },
    { key: 'inp',  label: 'INP',  value: `${ps.inp}ms` },
    { key: 'fcp',  label: 'FCP',  value: `${(ps.fcp / 1000).toFixed(1)}s` },
    { key: 'ttfb', label: 'TTFB', value: `${ps.ttfb}ms` },
  ]
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Core Web Vitals
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${
            ps.performanceScore >= 90 ? cwvColors.good :
            ps.performanceScore >= 50 ? cwvColors['needs-improvement'] :
            cwvColors.poor
          }`}>{ps.performanceScore}/100</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {metrics.map(({ key, label, value }) => {
            const status = cwvStatus(key, key === 'cls' ? ps.cls : Number(value.replace(/[^0-9.]/g, '')))
            return (
              <div key={key} className={`rounded-lg border p-3 text-center ${cwvColors[status]}`}>
                <div className="text-xs font-semibold opacity-70 mb-1">{label}</div>
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs mt-0.5 capitalize">{status.replace('-', ' ')}</div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">Measured on mobile · Powered by Google PageSpeed Insights</p>
      </CardContent>
    </Card>
  )
}

const severityIcon = {
  critical: AlertCircle,
  warning: AlertCircle,
  info: Info,
  pass: Check,
}

function FindingRow({ finding, showRecommendation = false }: { finding: AuditFinding; showRecommendation?: boolean }) {
  const Icon = severityIcon[finding.severity]
  return (
    <div className={`flex gap-3 p-3 rounded-lg border text-sm ${severityColor(finding.severity)}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-medium">{finding.title}</div>
        <div className="text-xs mt-0.5 opacity-80">{finding.description}</div>
        {showRecommendation && finding.recommendation && finding.severity !== 'pass' && (
          <div className="mt-2 flex gap-1.5 items-start rounded-md bg-white/60 dark:bg-black/20 border border-current/10 px-2.5 py-2">
            <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
            <span className="text-xs font-medium">{finding.recommendation}</span>
          </div>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold self-start flex-shrink-0 ${impactBadge(finding.impact)}`}>
        {finding.impact}
      </span>
    </div>
  )
}

function FindingsList({ findings, emptyLabel, showRecommendation }: { findings: AuditFinding[]; emptyLabel: string; showRecommendation?: boolean }) {
  if (findings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        <Check className="w-8 h-8 mx-auto mb-2 text-green-400" />
        {emptyLabel}
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {findings.map(f => <FindingRow key={f.id} finding={f} showRecommendation={showRecommendation} />)}
    </div>
  )
}

export function AuditReport({ result, mode = 'public' }: AuditReportProps) {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const { scores, rawData } = result
  const domain = new URL(result.url).hostname
  const showRecommendation = mode === 'internal'

  const seoFindings = result.findings.filter(f => f.category === 'seo')
  const aeoFindings = result.findings.filter(f => f.category === 'aeo')
  const geoFindings = result.findings.filter(f => f.category === 'geo')

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Audit Report</h1>
            {mode === 'internal' && (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 border border-blue-200 dark:border-blue-800/50 px-2 py-0.5 rounded-full">
                Internal
              </span>
            )}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
          >
            {domain}
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="text-xs text-gray-400 mt-0.5">
            {new Date(result.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === 'public' && (
            <Button
              size="sm"
              onClick={() => setShowLeadModal(true)}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5" />
              Fix My Site
            </Button>
          )}
          {mode === 'internal' && (
            <Suspense fallback={
              <Button variant="outline" size="sm" disabled className="gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                Preparing PDF…
              </Button>
            }>
              <PdfExportButton result={result} />
            </Suspense>
          )}
        </div>
      </div>

      {showLeadModal && (
        <LeadModal result={result} onClose={() => setShowLeadModal(false)} />
      )}

      {/* Overall Score + Sub Scores */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Overall */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Overall Score</div>
              <ScoreCard label="" score={scores.overall} size="lg" />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-32 bg-white/10" />
            <Separator className="md:hidden bg-white/10 w-20" />
            {/* Sub scores */}
            <div className="flex gap-10 md:gap-16 justify-center">
              <ScoreCard label="SEO" score={scores.seo} size="md" />
              <ScoreCard label="AEO" score={scores.aeo} size="md" />
              <ScoreCard label="GEO" score={scores.geo} size="md" />
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <p className="text-gray-700 text-sm leading-relaxed">{result.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      {result.pageSpeed && <CoreWebVitals ps={result.pageSpeed} />}

      {/* Critical Issues */}
      {result.criticalIssues.length > 0 && (
        <Card className="border-red-100 dark:border-red-900/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4.5 h-4.5" />
              Critical Issues ({result.criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FindingsList findings={result.criticalIssues} emptyLabel="No critical issues found." showRecommendation={showRecommendation} />
          </CardContent>
        </Card>
      )}

      {/* Quick Wins */}
      <Card className="border-amber-100 dark:border-amber-900/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Lightbulb className="w-4.5 h-4.5" />
            Quick Wins ({result.quickWins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FindingsList findings={result.quickWins} emptyLabel="No quick wins identified — good job!" showRecommendation={showRecommendation} />
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="border-blue-100 dark:border-blue-900/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-4.5 h-4.5" />
            Opportunities ({result.opportunities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FindingsList findings={result.opportunities} emptyLabel="No additional opportunities at this time." showRecommendation={showRecommendation} />
        </CardContent>
      </Card>

      {/* Technical Findings by Category */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Technical Findings</h2>
        <Tabs defaultValue="seo">
          <TabsList className="mb-4">
            <TabsTrigger value="seo">SEO ({seoFindings.length})</TabsTrigger>
            <TabsTrigger value="aeo">AEO ({aeoFindings.length})</TabsTrigger>
            <TabsTrigger value="geo">GEO ({geoFindings.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="seo">
            <div className="space-y-2">
              {seoFindings.map(f => <FindingRow key={f.id} finding={f} showRecommendation={showRecommendation} />)}
            </div>
          </TabsContent>
          <TabsContent value="aeo">
            <div className="space-y-2">
              {aeoFindings.map(f => <FindingRow key={f.id} finding={f} showRecommendation={showRecommendation} />)}
            </div>
          </TabsContent>
          <TabsContent value="geo">
            <div className="space-y-2">
              {geoFindings.map(f => <FindingRow key={f.id} finding={f} showRecommendation={showRecommendation} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Raw Data Accordion */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-gray-600">Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="raw">
              <AccordionTrigger className="text-sm font-medium text-gray-700">
                View raw audit data
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-50 dark:bg-gray-900/60 border border-gray-100 rounded-lg p-4 overflow-auto max-h-80 text-gray-600 dark:text-gray-400">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
