import { PDFDownloadLink } from '@react-pdf/renderer'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuditPdfDocument } from '@/components/audit-pdf'
import type { AuditResult } from '@/lib/audit/types'

interface PdfExportButtonProps {
  result: AuditResult
  className?: string
  variant?: 'outline' | 'default' | 'ghost' | 'secondary'
  size?: 'sm' | 'default' | 'lg' | 'icon'
}

export default function PdfExportButton({
  result,
  className = '',
  variant = 'outline',
  size = 'sm',
}: PdfExportButtonProps) {
  const domain = new URL(result.url).hostname
  const date = new Date(result.createdAt).toISOString().split('T')[0]
  const fileName = `xms-audit-${domain}-${date}.pdf`

  return (
    <PDFDownloadLink document={<AuditPdfDocument result={result} />} fileName={fileName}>
      {({ loading, error }) => (
        <Button
          variant={variant}
          size={size}
          disabled={loading}
          className={`gap-1.5 cursor-pointer ${className}`}
        >
          <FileDown className="h-3.5 w-3.5" />
          {loading ? 'Generating PDF…' : error ? 'PDF Error' : 'Export PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
