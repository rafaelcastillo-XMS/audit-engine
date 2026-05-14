const cards = [
  {
    cols: 'col-span-12 lg:col-span-7',
    label: 'SEO',
    labelColor: 'text-blue-500',
    imgBg: 'bg-blue-50',
    title: 'Technical SEO',
    description: 'Core signals that determine how search engines crawl, index, and rank your pages.',
    image: '/card-seo.svg',
  },
  {
    cols: 'col-span-12 lg:col-span-5',
    label: 'AEO',
    labelColor: 'text-purple-500',
    imgBg: 'bg-purple-50',
    title: 'Answer Engine',
    description: 'Optimized for featured snippets, voice results, and AI-generated summaries.',
    image: '/card-aeo.svg',
  },
  {
    cols: 'col-span-12 md:col-span-6 lg:col-span-4',
    label: 'GEO',
    labelColor: 'text-amber-500',
    imgBg: 'bg-amber-50',
    title: 'AI Visibility',
    description: 'How well ChatGPT, Claude, and Gemini can find and recommend your business.',
    image: '/card-geo.svg',
  },
  {
    cols: 'col-span-12 md:col-span-6 lg:col-span-4',
    label: 'Schema',
    labelColor: 'text-emerald-500',
    imgBg: 'bg-emerald-50',
    title: 'Structured Data',
    description: 'Markup that AI models read directly.',
    image: '/card-schema.svg',
  },
  {
    cols: 'col-span-12 md:col-span-12 lg:col-span-4',
    label: 'Report',
    labelColor: 'text-cyan-600',
    imgBg: 'bg-cyan-50',
    title: 'Full Audit Report',
    description: 'SEO, AEO & GEO in one unified score with prioritized fixes, in seconds.',
    image: '/card-report.svg',
  },
]

export function WhatWeAnalyze() {
  return (
    <section id="analyze" className="py-24 px-4 bg-slate-50 dark:bg-[#060d20]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 block">
              Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What We Analyze
            </h2>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm sm:text-right">
            Five dimensions of visibility — from traditional search to AI-generated answers.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`${card.cols} bg-white dark:bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col`}
            >
              <div className={`${card.imgBg} w-full`}>
                <img src={card.image} alt={card.title} className="w-full" />
              </div>

              <div className="px-6 py-5">
                <span className={`text-xs font-semibold uppercase tracking-widest block mb-1.5 ${card.labelColor}`}>
                  {card.label}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
