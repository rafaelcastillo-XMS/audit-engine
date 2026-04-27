import { cn, scoreLabel } from '@/lib/utils'

interface ScoreCardProps {
  label: string
  score: number
  description?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

function getScoreRingColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

export function ScoreCard({ label, score, description, size = 'md', animated = true }: ScoreCardProps) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const dim = size === 'lg' ? 120 : size === 'md' ? 96 : 72
  const radius = size === 'lg' ? 40 : size === 'md' ? 32 : 24
  const strokeWidth = size === 'lg' ? 6 : 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={getScoreRingColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={animated ? { transition: 'stroke-dashoffset 1s ease-out' } : undefined}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'font-bold tabular-nums',
              getScoreTextColor(score),
              size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'
            )}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className={cn('font-semibold text-gray-900', size === 'lg' ? 'text-base' : 'text-sm')}>
          {label}
        </div>
        <div className={cn('font-medium', getScoreTextColor(score), 'text-xs')}>
          {scoreLabel(score)}
        </div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
    </div>
  )
}

// Inline score ring for use inside cards
export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.35
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={getScoreRingColor(score)}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-sm font-bold', getScoreTextColor(score))}>{Math.round(score)}</span>
      </div>
    </div>
  )
}
