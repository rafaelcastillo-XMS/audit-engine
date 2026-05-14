import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { ShieldCheck, RotateCcw } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'
import { AuditReport } from '@/components/audit-report'
import type { AuditResult } from '@/lib/audit/types'

export const Route = createFileRoute('/internal')({
  component: InternalPage,
})

function InternalPage() {
  const [result, setResult] = useState<AuditResult | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleResult = (r: AuditResult) => {
    setResult(r)
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleReset = () => {
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* ── Form section ── */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Internal Sales Tool · Executive Access
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              Generate Client Reports
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Analyze any website and get a full report with findings and recommendations. PDF export available after analysis.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-lg shadow-gray-100/50 dark:shadow-none">
            <AuditUrlForm onResult={handleResult} />
          </div>

          {result && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New Audit
              </button>
            </div>
          )}

          {!result && (
            <p className="mt-4 text-center text-xs text-gray-400">
              Results include full recommendations · PDF export available after analysis
            </p>
          )}
        </div>
      </div>

      {/* ── Inline results ── */}
      {result && (
        <div ref={reportRef} className="border-t border-gray-100 dark:border-white/[0.07]">
          <AuditReport result={result} mode="internal" inline />
        </div>
      )}
    </div>
  )
}
