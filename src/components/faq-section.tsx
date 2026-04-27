import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'What is SEO, AEO and GEO?',
    a: 'SEO (Search Engine Optimization) is the practice of optimizing your site for traditional search rankings. AEO (Answer Engine Optimization) focuses on capturing featured snippets and voice search results by structuring content to directly answer questions. GEO (Generative Engine Optimization) is an emerging discipline aimed at making your site visible in AI-generated answers from tools like ChatGPT, Perplexity, and Claude.',
  },
  {
    q: 'How accurate is this audit?',
    a: 'This tool performs real-time checks directly on the page you submit — title tags, meta data, schema markup, headings, links, robots.txt, sitemaps, and more. Scores are deterministic and based on measurable signals. It is a fast diagnostic tool, not a replacement for a full manual audit.',
  },
  {
    q: 'Does this replace a full SEO audit?',
    a: 'No — it is a rapid diagnostic for prospecting and quick wins. A full audit typically includes keyword analysis, competitor benchmarking, Core Web Vitals testing, log file analysis, and content gap research. This tool is the first step.',
  },
  {
    q: 'Can we connect Ahrefs, Screaming Frog or GSC later?',
    a: 'Yes. The server architecture includes placeholder adapters for Ahrefs, Screaming Frog, Google PageSpeed Insights, and Google Search Console. These can be wired up with your API credentials without changing the UI.',
  },
  {
    q: 'Can this be used for client prospecting?',
    a: 'Absolutely. Run a quick audit on a prospect\'s domain before a call — you\'ll have their scores and top issues ready to discuss in under a minute. The report can be copied or exported for presentations.',
  },
]

export function FaqSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-gray-900 font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
