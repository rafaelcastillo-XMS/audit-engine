import type { AuditResult } from './types'

const STORAGE_KEY = 'xms_audits'
const MAX_STORED = 20

export function saveAudit(result: AuditResult): void {
  try {
    const existing = getAllAudits()
    const updated = [result, ...existing.filter(a => a.id !== result.id)].slice(0, MAX_STORED)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function getAudit(id: string): AuditResult | null {
  return getAllAudits().find(a => a.id === id) ?? null
}

export function getAllAudits(): AuditResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuditResult[]) : []
  } catch {
    return []
  }
}

export function clearAudits(): void {
  localStorage.removeItem(STORAGE_KEY)
}
