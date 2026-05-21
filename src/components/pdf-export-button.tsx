import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PdfExportButton() {
  const [isPrinting, setIsPrinting] = useState(false)

  const handleExport = () => {
    setIsPrinting(true)
    window.requestAnimationFrame(() => {
      window.print()
      window.setTimeout(() => setIsPrinting(false), 300)
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isPrinting} className="gap-1.5">
      <FileDown className="h-3.5 w-3.5" />
      {isPrinting ? 'Preparing PDF…' : 'Export PDF'}
    </Button>
  )
}
