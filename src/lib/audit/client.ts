import type { AuditResult, AuditRequest } from './types'

const API_BASE = '/api'

export async function runAudit(request: AuditRequest): Promise<AuditResult> {
  const response = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Audit failed' }))
    throw new Error((error as { message?: string }).message ?? 'Audit failed')
  }

  return response.json() as Promise<AuditResult>
}
