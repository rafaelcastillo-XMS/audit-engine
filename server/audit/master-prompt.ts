// Source of truth for all scoring, findings, and output logic: docs/agent-prompt.md
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const MASTER_PROMPT_PATH = resolve(__dirname, '../../docs/agent-prompt.md')

export function getMasterPrompt(): string {
  return readFileSync(MASTER_PROMPT_PATH, 'utf-8')
}
