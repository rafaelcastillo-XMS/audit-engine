import { useState } from 'react'
import { AlertTriangle, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react'
import type { AuditResult } from '@/lib/audit/types'

interface LeadGateProps {
  result: AuditResult
  onUnlock: () => void
}

export function LeadGate({ result, onUnlock }: LeadGateProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length < 4) return digits
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const criticalCount = result.findings.filter(f => f.severity === 'critical').length
  const warningCount = result.findings.filter(f => f.severity === 'warning').length
  const domain = new URL(result.url).hostname

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    name.trim(),
          phone:   phone.trim(),
          email:   email.trim(),
          website: result.url,
          score:   result.scores.overall,
          critical: criticalCount,
          warnings: warningCount,
        }),
      })
    } catch {
      // don't block the user on a network error
    } finally {
      setLoading(false)
      onUnlock()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md">

        {/* Alert teaser */}
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Scan complete</p>
              <p className="text-sm font-bold text-gray-800 truncate">{domain}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                {criticalCount} critical threat{criticalCount !== 1 ? 's' : ''} found
              </span>
            )}
            {warningCount > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {warningCount} urgent alert{warningCount !== 1 ? 's' : ''}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              Overall score: {result.scores.overall}/100
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            Your full report is ready — including all findings, recommendations, and a PDF export. Enter your info to access it.
          </p>
        </div>

        {/* Lead form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Access your free report</h2>
          <p className="text-xs text-gray-400 mb-5">No spam. One-time use. We may follow up with tips to fix your issues.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 000-0000"
                maxLength={14}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                <>View Full Report <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
