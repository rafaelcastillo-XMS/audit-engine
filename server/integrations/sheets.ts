import { google } from 'googleapis'

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '1YL0197EwttjI-fVHujUaoDRbYFVpDrNJfb05h6g4KNk'
const RANGE   = 'Sheet1!A1'

const HEADERS = ['Date', 'Name', 'Phone', 'Email', 'Website', 'Overall Score', 'Critical Issues', 'Warnings']

function getAuth() {
  const clientEmail  = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey   = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) return null

  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function appendLeadToSheet(data: {
  name:     string
  phone:    string
  email:    string
  website:  string
  score:    number
  critical: number
  warnings: number
}) {
  const auth = getAuth()
  if (!auth) {
    console.warn('[sheets] Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY — skipping sheet write')
    return
  }

  const sheets = google.sheets({ version: 'v4', auth })

  // Insert header row if the sheet is empty
  const existing = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Sheet1!A1:H1' })
  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [HEADERS] },
    })
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('en-US'),
        data.name,
        data.phone,
        data.email,
        data.website,
        data.score,
        data.critical,
        data.warnings,
      ]],
    },
  })

  console.log(`[sheets] Lead saved: ${data.email} — ${data.website}`)
}
