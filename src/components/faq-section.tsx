import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Why isn\'t my site showing up in ChatGPT or Google AI answers?',
    a: 'LLMs like ChatGPT, Claude, and Gemini pull from sites that are well-structured, authoritative, and clearly answer specific questions. If your page lacks schema markup, has thin content, or poor heading structure, AI models will skip it in favor of better-optimized competitors. Our audit tells you exactly which signals are missing.',
  },
  {
    q: 'What does the audit actually check?',
    a: 'We run over 35 automated checks across three dimensions: SEO (titles, meta tags, canonicals, headings, internal links, robots.txt, sitemap), AEO (FAQ schema, structured data, question-answer formatting, featured snippet readiness), and GEO (brand authority signals, citation clarity, content depth, and LLM-friendly structure). Each check is flagged as Pass, Warning, or Critical.',
  },
  {
    q: 'What\'s the difference between SEO, AEO, and GEO scores?',
    a: 'SEO measures how well your page ranks in traditional search engines like Google. AEO (Answer Engine Optimization) measures how likely your content is to appear in featured snippets and voice results. GEO (Generative Engine Optimization) measures how well AI models like ChatGPT or Perplexity can understand, trust, and cite your site when users ask related questions.',
  },
  {
    q: 'How long does the audit take?',
    a: 'Under 10 seconds. Paste your URL, hit analyze, and the full report — scores, issue list, and recommendations — is ready instantly. No account needed, no waiting for a scheduled crawl.',
  },
  {
    q: 'I got my scores — what do I do next?',
    a: 'The report prioritizes issues by severity: Critical items hurt your visibility the most and should be fixed first. Each finding includes a plain-English explanation of why it matters for LLM ranking and what to do to fix it. Start with Critical SEO and AEO issues — those have the fastest impact on AI visibility.',
  },
  {
    q: 'Can I use this to audit client sites before a pitch?',
    a: "Yes — that's one of the most common use cases. Run a 10-second audit on a prospect's domain before a call, and you'll walk in knowing their exact weak points: missing schema, poor AEO signals, thin content. The PDF export makes it easy to present findings professionally.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-slate-50 dark:bg-[#0c1120]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-200/50 dark:bg-blue-800/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[80px]" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
            Everything you need to know about scores, accuracy, and how to use this tool.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 backdrop-blur-md
                  ${isOpen
                    ? 'bg-white/80 dark:bg-white/[0.06] border-blue-200 dark:border-blue-500/30 shadow-lg shadow-blue-100/60 dark:shadow-blue-900/30'
                    : 'bg-white/50 dark:bg-white/[0.03] border-white/80 dark:border-white/[0.07] hover:bg-white/70 dark:hover:bg-white/[0.05]'
                  }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                >
                  <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all
                    ${isOpen
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-transparent border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-500 group-hover:border-gray-400 dark:group-hover:border-white/30'
                    }`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="h-px bg-gray-100 dark:bg-white/[0.06] mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
