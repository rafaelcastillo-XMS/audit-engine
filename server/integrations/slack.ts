// Slack webhook integration placeholder

export interface SlackConfig {
  webhookUrl: string
}

export async function sendSlackNotification(
  message: string,
  config: SlackConfig
): Promise<void> {
  const res = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  })
  if (!res.ok) throw new Error(`Slack webhook failed: ${res.status}`)
}

export async function notifyAuditComplete(
  url: string,
  overallScore: number
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return
  await sendSlackNotification(
    `🔍 XMS Audit complete for *${url}* — Overall score: *${overallScore}/100*`,
    { webhookUrl }
  )
}
