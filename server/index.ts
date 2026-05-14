import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'
import { fetchSite } from './audit/fetch-site'
import { analyzeHtml } from './audit/analyze-html'
import { calculateScores } from './audit/scoring'
import { generateFindings, generatePageSpeedFindings, buildExecutiveSummary } from './audit/recommendations'
import { getPageSpeed } from './integrations/pagespeed'
import type { AuditResult } from './audit/types'

const app = express()
const PORT = process.env.PORT ?? 3001
const isProd = process.env.NODE_ENV === 'production'

const allowedOrigins = isProd
  ? process.env.APP_URL
    ? [process.env.APP_URL]
    : true  // same-origin only (frontend served by same Express)
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(cors({ origin: allowedOrigins }))
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
      const is403 = fetched.error?.includes('403')
      const message = is403
        ? 'This site is blocking automated access (HTTP 403). Sites with active bot protection are also likely blocking AI crawlers like GPTBot, ClaudeBot, and PerplexityBot — which means they may not appear in ChatGPT, Perplexity, or Claude responses.'
        : `Could not fetch page: ${fetched.error ?? 'Unknown error'}`
      res.status(422).json({ message })
      return
    }

    const psiKey = process.env.PAGESPEED_API_KEY

    const [rawData, pageSpeed] = await Promise.all([
      analyzeHtml(fetched.html, fetched.finalUrl),
      psiKey ? getPageSpeed(fetched.finalUrl, psiKey).catch(() => undefined) : Promise.resolve(undefined),
    ])

    const scores = calculateScores(rawData)
    const findings = [
      ...generateFindings(rawData),
      ...(pageSpeed ? generatePageSpeedFindings(pageSpeed) : []),
    ]
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
      pageSpeed,
    }

    res.json(result)
  } catch (err) {
    console.error('[audit error]', err)
    res.status(500).json({ message: 'Internal server error during audit' })
  }
})

interface LeadPayload {
  name: string
  email: string
  message?: string
  auditUrl: string
  scores: { overall: number; seo: number; aeo: number; geo: number }
  criticalCount: number
  executiveSummary: string
}

app.post('/api/lead', async (req, res) => {
  const { name, email, message, auditUrl, scores, criticalCount, executiveSummary } = req.body as LeadPayload

  if (!name || !email || !auditUrl) {
    res.status(400).json({ message: 'name, email and auditUrl are required' })
    return
  }

  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const leadEmail = process.env.LEAD_EMAIL ?? smtpUser

  if (!smtpUser || !smtpPass) {
    // No email configured — log and return success anyway so UX doesn't break
    console.log('[lead]', { name, email, auditUrl, scores })
    res.json({ ok: true })
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  })

  const scoreBar = (label: string, val: number) =>
    `${label}: ${val}/100 ${'█'.repeat(Math.round(val / 10))}${'░'.repeat(10 - Math.round(val / 10))}`

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#111;padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">🚨 New Audit Lead</h1>
        <p style="color:#888;margin:8px 0 0">via XMS Audit Lab</p>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #eee">
        <h2 style="margin:0 0 16px;font-size:16px;color:#111">Contact Info</h2>
        <p style="margin:4px 0"><strong>Name:</strong> ${name}</p>
        <p style="margin:4px 0"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${message ? `<p style="margin:12px 0 4px"><strong>Message:</strong></p><p style="background:#fff;border:1px solid #ddd;padding:12px;border-radius:8px;margin:0">${message}</p>` : ''}

        <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>

        <h2 style="margin:0 0 16px;font-size:16px;color:#111">Audit Results for <a href="${auditUrl}" style="color:#2563eb">${auditUrl}</a></h2>
        <div style="background:#111;color:#fff;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;line-height:2">
          <div>Overall: ${scores.overall}/100</div>
          <div>${scoreBar('SEO', scores.seo)}</div>
          <div>${scoreBar('AEO', scores.aeo)}</div>
          <div>${scoreBar('GEO', scores.geo)}</div>
        </div>
        <p style="margin:16px 0 4px;color:#c00;font-weight:bold">⚠️ ${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''} found</p>
        <p style="margin:0;color:#555;font-size:14px">${executiveSummary}</p>
      </div>
      <div style="background:#f0f0f0;padding:16px;border-radius:0 0 12px 12px;font-size:12px;color:#888;text-align:center">
        XMS Audit Lab · Xperience AI Marketing Solutions
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"XMS Audit Lab" <${smtpUser}>`,
    to: leadEmail,
    replyTo: email,
    subject: `🚨 New lead: ${name} needs help with ${new URL(auditUrl).hostname}`,
    html,
  })

  res.json({ ok: true })
})

// En producción, Express sirve el frontend compilado
if (isProd) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const distPath = path.join(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`[XMS Audit Server] Running on http://localhost:${PORT}`)
})
