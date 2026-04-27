import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-400'
  if (score >= 40) return 'bg-orange-400'
  return 'bg-red-500'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Good'
  if (score >= 60) return 'Needs Work'
  if (score >= 40) return 'Poor'
  return 'Critical'
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-200'
    case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'info': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'pass': return 'bg-green-100 text-green-700 border-green-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function impactBadge(impact: string): string {
  switch (impact) {
    case 'high': return 'bg-red-50 text-red-600'
    case 'medium': return 'bg-orange-50 text-orange-600'
    case 'low': return 'bg-gray-50 text-gray-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function normalizeUrl(url: string): string {
  let normalized = url.trim()
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`
  }
  return normalized
}
