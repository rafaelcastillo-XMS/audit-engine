import { useState } from 'react'
import { LeadModal } from '@/components/lead-modal'
import { AuditPdfTemplate } from '@/components/audit-pdf-template'
import type { AuditResult } from '@/lib/audit/types'

interface AuditReportProps {
  result: AuditResult
  mode?: 'public' | 'internal'
  onBack?: () => void
  backLabel?: string
  inline?: boolean
}

export function AuditReport({
  result,
  mode = 'public',
  onBack,
  backLabel = 'Back to home',
  inline = false,
}: AuditReportProps) {
  const [showLeadModal, setShowLeadModal] = useState(false)

  return (
    <div className="w-full">
      <div className={inline ? 'border-t border-gray-100 dark:border-white/[0.07]' : 'pt-6 pb-12'}>
        <AuditPdfTemplate
          result={result}
          mode={mode}
          showExport={true}
          onBack={onBack}
          backLabel={backLabel}
          onCtaClick={() => setShowLeadModal(true)}
        />
      </div>

      {showLeadModal && (
        <LeadModal result={result} onClose={() => setShowLeadModal(false)} />
      )}
    </div>
  )
}
