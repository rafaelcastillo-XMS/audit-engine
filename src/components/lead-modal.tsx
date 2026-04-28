import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AuditResult } from '@/lib/audit/types'

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  message: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface LeadModalProps {
  result: AuditResult
  onClose: () => void
}

function ScorePill({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
        {score}
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

export function LeadModal({ result, onClose }: LeadModalProps) {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          auditUrl: result.url,
          scores: result.scores,
          criticalCount: result.criticalIssues.length,
          executiveSummary: result.executiveSummary,
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
    } catch {
      setServerError('Something went wrong. Please try again or email us directly.')
    }
  }

  const domain = new URL(result.url).hostname

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-gray-950 to-gray-800 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">XMS Audit Lab</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight">
            {result.criticalIssues.length > 0
              ? `Your site has ${result.criticalIssues.length} critical issue${result.criticalIssues.length !== 1 ? 's' : ''}.`
              : 'Your site has room to improve.'}
            <br />
            <span className="text-blue-400">Let us fix it for you.</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">{domain}</p>

          {/* Score pills */}
          <div className="flex gap-4 mt-4">
            <ScorePill label="Overall" score={result.scores.overall} />
            <ScorePill label="SEO" score={result.scores.seo} />
            <ScorePill label="AEO" score={result.scores.aeo} />
            <ScorePill label="GEO" score={result.scores.geo} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg">We got it!</h3>
              <p className="text-gray-500 text-sm mt-1">
                Our team will review your audit and reach out within 24 hours with a game plan.
              </p>
              <Button className="mt-5 w-full" onClick={onClose}>Close</Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Leave your info and we'll reach out with a personalized plan to fix your SEO, AEO, and GEO gaps.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <Input
                    placeholder="Your name"
                    {...register('name')}
                    className={errors.name ? 'border-red-400' : ''}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Work email"
                    {...register('email')}
                    className={errors.email ? 'border-red-400' : ''}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <textarea
                    placeholder="Anything specific you'd like us to focus on? (optional)"
                    {...register('message')}
                    rows={3}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {serverError && (
                  <div className="flex gap-2 items-start text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {serverError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>
                    : '🚀 Get a Free Consultation'}
                </Button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">
                No spam. We'll only reach out about your site.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
