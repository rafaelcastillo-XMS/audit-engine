import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'

export const Route = createFileRoute('/')({
  component: InternalPage,
})

function InternalPage() {
  const navigate = useNavigate()

  return (
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
        <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-full p-4 shadow-lg shadow-gray-100/50 dark:shadow-none">
          <AuditUrlForm
            onNavigate={(id) => navigate({ to: '/audit/$auditId', params: { auditId: id }, search: { mode: 'internal' } })}
          />
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Results include full recommendations · PDF export available after analysis
        </p>
      </div>
    </div>
  )
}
