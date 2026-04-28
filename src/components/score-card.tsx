import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { cn, scoreLabel } from '@/lib/utils'

function getScoreColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

interface ScoreCardProps {
  label: string
  score: number
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreCard({ label, score, description, size = 'md' }: ScoreCardProps) {
  const dim = size === 'lg' ? 140 : size === 'md' ? 110 : 80
  const innerRadius = size === 'lg' ? 48 : size === 'md' ? 36 : 26
  const outerRadius = size === 'lg' ? 62 : size === 'md' ? 48 : 35
  const fontSize = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
  const color = getScoreColor(score)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <RadialBarChart
          width={dim}
          height={dim}
          cx={dim / 2}
          cy={dim / 2}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          data={[{ value: score, fill: color }]}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          {/* Track */}
          <RadialBar
            dataKey="value"
            data={[{ value: 100, fill: 'rgba(255,255,255,0.08)' }]}
            cornerRadius={10}
            background={false}
          />
          {/* Fill */}
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={false}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold tabular-nums', getScoreTextColor(score), fontSize)}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      <div className="text-center">
        {label && (
          <div className={cn('font-bold text-white', size === 'lg' ? 'text-base' : 'text-sm')}>
            {label}
          </div>
        )}
        <div className={cn('font-medium text-xs', getScoreTextColor(score))}>
          {scoreLabel(score)}
        </div>
        {description && <div className="text-xs text-gray-400 mt-0.5">{description}</div>}
      </div>
    </div>
  )
}
