import { google } from 'googleapis'

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '1YL0197EwttjI-fVHujUaoDRbYFVpDrNJfb05h6g4KNk'
const RANGE   = 'Sheet1!A1'

function parsePrivateKey(raw: string | undefined): string | null {
  if (!raw) return null
  // Handle both literal \n (from .env files) and actual newlines (from Dokploy/Docker UI)
  return raw.replace(/\\n/g, '\n')
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey  = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY)

  console.log('[sheets] Auth check — email present:', !!clientEmail, '| key present:', !!privateKey)

  if (!clientEmail || !privateKey) {
    console.warn('[sheets] Missing credentials — GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY not set')
    return null
  }

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
  if (!auth) return

  const sheets = google.sheets({ version: 'v4', auth })

  const date = new Date().toLocaleString('en-US')

  console.log('[sheets] Appending row for:', data.email, data.website)

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

  console.log('[sheets] Row appended successfully')
}
