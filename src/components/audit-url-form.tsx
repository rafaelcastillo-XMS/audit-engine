import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowRight, Globe, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { runAudit } from '@/lib/audit/client'
import { saveAudit } from '@/lib/audit/storage'
import { normalizeUrl } from '@/lib/utils'
import type { AuditResult } from '@/lib/audit/types'
import { AUDIT_STEPS } from '@/lib/audit/types'

const schema = z.object({
  url: z
    .string()
    .min(1, 'Please enter a URL')
    .transform((v) => normalizeUrl(v))
    .refine((v) => {
      try { new URL(v); return true } catch { return false }
    }, 'Please enter a valid URL'),
})

type FormValues = z.infer<typeof schema>

interface AuditUrlFormProps {
  onResult?: (result: AuditResult) => void
  onNavigate?: (id: string) => void
  compact?: boolean
}

export function AuditUrlForm({ onResult, onNavigate, compact = false }: AuditUrlFormProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const simulateProgress = (stepSetter: (s: number) => void) => {
    let current = 0
    const delays = [400, 800, 700, 900, 500]
    const advance = () => {
      current++
      stepSetter(current)
      if (current < AUDIT_STEPS.length - 1) {
        setTimeout(advance, delays[current] ?? 600)
      }
    }
    setTimeout(advance, delays[0])
  }

  const onSubmit = async (values: FormValues) => {
    setIsRunning(true)
    setError(null)
    setStep(0)
    simulateProgress(setStep)

    try {
      const result = await runAudit({ url: values.url })
      setStep(AUDIT_STEPS.length)
      saveAudit(result)

      await new Promise(r => setTimeout(r, 300))

      if (onResult) onResult(result)
      if (onNavigate) onNavigate(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStep(0)
    } finally {
      setIsRunning(false)
    }
  }

  const progress = isRunning ? Math.round((step / AUDIT_STEPS.length) * 100) : 0

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={`flex gap-2 ${compact ? '' : 'flex-col sm:flex-row'}`}>
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              {...register('url')}
              type="url"
              placeholder="https://yourwebsite.com"
              disabled={isRunning}
              className={`pl-9 ${compact ? 'h-10' : 'h-14 text-base'} border-gray-200 focus-visible:ring-blue-500`}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
          <Button
            type="submit"
            disabled={isRunning}
            size={compact ? 'default' : 'lg'}
            className={`gap-2 ${compact ? 'px-4' : 'px-7 h-14 text-base font-semibold'} whitespace-nowrap`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                Generate Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {errors.url && (
          <p className="mt-2 text-sm text-red-500">{errors.url.message}</p>
        )}
        {error && (
          <div className="mt-3 flex gap-3 items-start rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <ShieldX className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {isRunning && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              {AUDIT_STEPS[Math.min(step, AUDIT_STEPS.length - 1)]}…
            </span>
            <span className="text-gray-400 text-xs">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex gap-1.5">
            {AUDIT_STEPS.map((s, i) => (
              <div
                key={s}
                title={s}
                className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                  i < step ? 'bg-blue-500' : i === step ? 'bg-blue-300' : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
