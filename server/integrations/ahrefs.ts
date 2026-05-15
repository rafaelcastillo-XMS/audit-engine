// Ahrefs API integration placeholder
// Docs: https://docs.ahrefs.com/
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AhrefsConfig {
  apiKey: string
}

export interface AhrefsDomainData {
  domainRating: number
  backlinks: number
  referringDomains: number
  organicTraffic: number
}

export async function getAhrefsDomainData(
  _domain: string,
  _config: AhrefsConfig
): Promise<AhrefsDomainData> {
  throw new Error('Ahrefs integration not configured. Set AHREFS_API_KEY.')
}
