// Screaming Frog integration placeholder
// Connect to the Screaming Frog SEO Spider API when available
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface ScreamingFrogConfig {
  apiKey: string
  endpoint: string
}

export interface ScreamingFrogCrawlResult {
  urls: Array<{ url: string; statusCode: number; title: string; h1: string }>
  totalUrls: number
}

export async function crawlWithScreamingFrog(
  _domain: string,
  _config: ScreamingFrogConfig
): Promise<ScreamingFrogCrawlResult> {
  throw new Error('Screaming Frog integration not yet configured. Provide SF_API_KEY and SF_ENDPOINT.')
}
