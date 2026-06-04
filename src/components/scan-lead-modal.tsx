import { useEffect, useRef, useState } from 'react'
import { Clock, Loader2, ArrowRight, X, ShieldAlert, AlertTriangle } from 'lucide-react'
import { runAudit } from '@/lib/audit/client'
import { saveAudit } from '@/lib/audit/storage'
import type { AuditResult } from '@/lib/audit/types'

interface ScanLeadModalProps {
  url: string
  onClose: () => void
  onAuditComplete: (result: AuditResult) => void
  onNavigate: (id: string) => void
}

export function ScanLeadModal({ url, onClose, onAuditComplete, onNavigate }: ScanLeadModalProps) {
  const [progress, setProgress] = useState(0)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const pendingNavigate = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const domain = (() => { try { return new URL(url).hostname } catch { return url } })()

  // Animate progress bar to ~90% over 5 seconds
  useEffect(() => {
    const tickMs = 50
    const step = (90 / 5000) * tickMs

    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(intervalRef.current!)
          return 90
        }
        return Math.min(p + step, 90)
      })
    }, tickMs)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // Complete progress bar when audit finishes
  useEffect(() => {
    if (auditResult) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setProgress(100)
    }
  }, [auditResult])

  // Run the real audit in the background
  useEffect(() => {
    runAudit({ url })
      .then(result => {
        saveAudit(result)
        setAuditResult(result)
        onAuditComplete(result)
        if (pendingNavigate.current) onNavigate(result.id)
      })
      .catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length < 4) return digits
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website: url,
          consent,
          score: auditResult?.scores.overall,
          critical: auditResult?.findings.filter(f => f.severity === 'critical').length ?? 0,
          warnings: auditResult?.findings.filter(f => f.severity === 'warning').length ?? 0,
        }),
      })
    } catch { /* don't block the user */ } finally {
      setLoading(false)
      if (auditResult) {
        onNavigate(auditResult.id)
      } else {
        pendingNavigate.current = true
      }
    }
  }

  const criticalCount = auditResult?.findings.filter(f => f.severity === 'critical').length ?? 0
  const warningCount = auditResult?.findings.filter(f => f.severity === 'warning').length ?? 0
  const scanning = progress < 100

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto">
      {/* Blue top banner */}
      <div className="bg-blue-500 text-center py-5 px-4 flex-shrink-0">
        <p className="text-white/90 text-sm">Your scan results are being generated…</p>
        <p className="text-white font-bold text-lg mt-0.5">{domain}</p>
      </div>

      {/* Backdrop — click outside card to close */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm flex items-start justify-center px-4 py-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="p-8">

            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {scanning ? 'Preparing data…' : 'Scan complete!'}
                </h2>
                {!scanning && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criticalCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        {criticalCount} critical
                      </span>
                    )}
                    {warningCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <ShieldAlert className="w-3 h-3" />
                        {warningCount} warnings
                      </span>
                    )}
                    {auditResult && (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                        ⚡ Act Now — Your Rankings Are at Risk
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {scanning
                  ? 'Usually your results will be ready in less than 10 seconds.'
                  : 'Your results are ready. Enter your details below to access them.'}
              </span>
            </div>

            {/* Lead form */}
            <p className="text-gray-700 text-sm mb-4">
              Enter your email address to access and view your results. A copy of the scan results will be sent by email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 000-0000"
                maxLength={14}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              {/* Single consent + newsletter checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-700">I accept the use of my data</strong> and I subscribe to the newsletter to receive exclusive tips, offers, and updates from XMS Audit Lab. I can unsubscribe at any time.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !email.trim() || !consent}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                ) : (
                  <>Get Results <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-3">
              No spam. We'll only reach out about your site.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
