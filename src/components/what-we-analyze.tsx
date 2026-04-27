import { Search, MessageSquare, Globe } from 'lucide-react'

const categories = [
  {
    icon: Search,
    label: 'SEO',
    color: 'blue',
    title: 'Technical SEO',
    subtitle: 'Foundation for search visibility',
    items: [
      'Title tag & meta description',
      'Heading structure (H1–H6)',
      'Canonical tags',
      'Indexability & robots meta',
      'HTTPS & security',
      'XML sitemap & robots.txt',
      'Internal & external links',
      'Word count & content depth',
    ],
  },
  {
    icon: MessageSquare,
    label: 'AEO',
    color: 'purple',
    title: 'Answer Engine Optimization',
    subtitle: 'Built for featured snippets & voice',
    items: [
      'FAQ schema markup',
      'Question-based headings',
      'Concise answer paragraphs',
      'Featured snippet potential',
      'Structured data presence',
      'Content hierarchy clarity',
      'Q&A content patterns',
      'Open Graph completeness',
    ],
  },
  {
    icon: Globe,
    label: 'GEO',
    color: 'amber',
    title: 'Generative Engine Optimization',
    subtitle: 'Optimized for AI-generated answers',
    items: [
      'llms.txt file detection',
      'AI crawler accessibility',
      'Schema & structured data',
      'Author & brand trust signals',
      'Outbound citation links',
      'Entity & brand clarity',
      'Contact & About pages',
      'AI search readiness',
    ],
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; dot: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    icon: 'bg-blue-100 text-blue-600',
    dot: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    icon: 'bg-purple-100 text-purple-600',
    dot: 'bg-purple-500',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    icon: 'bg-amber-100 text-amber-600',
    dot: 'bg-amber-500',
  },
}

export function WhatWeAnalyze() {
  return (
    <section id="analyze" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Coverage
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Analyze
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three dimensions of visibility — traditional search, answer engines, and AI-generated results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            const c = colorMap[cat.color]
            return (
              <div
                key={cat.label}
                className={`rounded-xl border ${c.border} ${c.bg} p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{cat.label}</span>
                    <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                  </div>
                </div>
                <p className={`text-xs font-medium ${c.text} mb-4`}>{cat.subtitle}</p>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
