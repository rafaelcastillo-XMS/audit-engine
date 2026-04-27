import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, ArrowRight } from 'lucide-react'
import { getAllAudits } from '@/lib/audit/storage'
import { scoreLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/audits')({
  component: AuditsPage,
})

function AuditsPage() {
  const audits = getAllAudits()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Audits</h1>
          <p className="text-sm text-gray-500 mt-1">Stored locally in your browser</p>
        </div>
        <Link to="/">
          <Button size="sm">New Audit</Button>
        </Link>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No audits yet</p>
          <p className="text-sm mt-1">Run your first audit from the home page.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button size="sm" className="mt-4">Go to Home</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map(a => (
            <Link
              key={a.id}
              to="/audit/$auditId"
              params={{ auditId: a.id }}
              className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">{a.url}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{a.scores.overall}</div>
                    <div className="text-xs text-gray-400">{scoreLabel(a.scores.overall)}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
