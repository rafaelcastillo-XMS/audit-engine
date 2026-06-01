import { google } from 'googleapis'

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '1YL0197EwttjI-fVHujUaoDRbYFVpDrNJfb05h6g4KNk'
const RANGE   = 'Sheet1!A1'

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey  = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) return null

  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function appendLeadToSheet(data: {
  name:    string
  phone:   string
  email:   string
  website: string
}) {
  const auth = getAuth()
  if (!auth) {
    console.warn('[sheets] Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY — skipping sheet write')
    return
  }

  const sheets = google.sheets({ version: 'v4', auth })

  // Columns: DATE | URL | NAME | Phone | EMAIL
  const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        date,
        data.website,
        data.name,
        data.phone,
        data.email,
      ]],
    },
  })

  console.log(`[sheets] Lead saved: ${data.email} — ${data.website}`)
}
