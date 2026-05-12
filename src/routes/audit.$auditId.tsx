import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { z } from 'zod'
import { AuditReport } from '@/components/audit-report'
import { getAudit } from '@/lib/audit/storage'
import { Button } from '@/components/ui/button'

const auditSearch = z.object({
  mode: z.enum(['internal']).optional(),
})

export const Route = createFileRoute('/audit/$auditId')({
  validateSearch: auditSearch,
  component: AuditPage,
})

function AuditPage() {
  const { auditId } = Route.useParams()
  const { mode } = Route.useSearch()
  const navigate = useNavigate()
  const result = getAudit(auditId)

  if (!result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
        <p className="text-gray-500 mb-6 text-sm">
          This audit result may have expired or was cleared from browser storage.
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Run a New Audit
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <button
          onClick={() => navigate({ to: mode === 'internal' ? '/internal' : '/' })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {mode === 'internal' ? 'Back to Internal Tool' : 'Back to home'}
        </button>
      </div>
      <AuditReport result={result} mode={mode ?? 'public'} />
    </div>
  )
}
