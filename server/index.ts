import express from 'express'
import cors from 'cors'
import { fetchSite } from './audit/fetch-site'
import { analyzeHtml } from './audit/analyze-html'
import { calculateScores } from './audit/scoring'
import { generateFindings, buildExecutiveSummary } from './audit/recommendations'
import type { AuditResult } from './audit/types'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() })
})

app.post('/api/audit', async (req, res) => {
  const { url } = req.body as { url?: string }

  if (!url || typeof url !== 'string') {
    res.status(400).json({ message: 'url is required' })
    return
  }

  let normalized = url.trim()
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`
  }

  try {
    new URL(normalized)
  } catch {
    res.status(400).json({ message: 'Invalid URL provided' })
    return
  }

  try {
    const fetched = await fetchSite(normalized)
    if (!fetched.ok) {
      res.status(422).json({ message: `Could not fetch page: ${fetched.error ?? 'Unknown error'}` })
      return
    }

    const rawData = await analyzeHtml(fetched.html, fetched.finalUrl)
    const scores = calculateScores(rawData)
    const findings = generateFindings(rawData)
    const executiveSummary = buildExecutiveSummary(rawData, scores)

    const criticalIssues = findings.filter(f => f.severity === 'critical')
    const quickWins = findings.filter(f => f.severity === 'warning' && f.impact !== 'low').slice(0, 5)
    const opportunities = findings.filter(f => f.severity === 'info').slice(0, 5)

    const result: AuditResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: fetched.finalUrl,
      createdAt: new Date().toISOString(),
      scores,
      findings,
      executiveSummary,
      criticalIssues,
      quickWins,
      opportunities,
      rawData,
    }

    res.json(result)
  } catch (err) {
    console.error('[audit error]', err)
    res.status(500).json({ message: 'Internal server error during audit' })
  }
})

app.listen(PORT, () => {
  console.log(`[XMS Audit Server] Running on http://localhost:${PORT}`)
})
