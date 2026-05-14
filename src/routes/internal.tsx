import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'

export const Route = createFileRoute('/internal')({
  component: InternalPage,
})

function InternalPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center px-4 py-16">
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
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Generate Client Reports
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Analyze any website and export a branded PDF with all findings and recommendations to share with your client.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-lg shadow-gray-100/50">
          <AuditUrlForm
            onNavigate={(id) =>
              navigate({
                to: '/audit/$auditId',
                params: { auditId: id },
                search: { mode: 'internal' },
              })
            }
          />
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Results include full recommendations · PDF export available after analysis
        </p>

      </div>
    </div>
  )
}
