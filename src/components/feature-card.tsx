import { Zap, BarChart3, Lightbulb, AlertCircle, Trophy, FileDown } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Fast Website Scan',
    description: 'Get a complete audit in under 10 seconds — no browser extension, no crawl delay, no sign-up.',
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
  },
  {
    icon: BarChart3,
    title: 'SEO · AEO · GEO Scores',
    description: 'Three distinct scores mapped to traditional search, answer engines, and AI model visibility.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Recommendations',
    description: 'Every finding comes with a plain-English explanation and a concrete fix — no vague advice.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-100 dark:border-purple-500/20',
  },
  {
    icon: AlertCircle,
    title: 'Critical Issues First',
    description: 'We rank problems by impact so you focus on what actually hurts your LLM visibility first.',
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-100 dark:border-red-500/20',
  },
  {
    icon: Trophy,
    title: 'Quick Wins Highlighted',
    description: 'Low-effort fixes that move the needle fast — identified automatically and listed separately.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
  },
  {
    icon: FileDown,
    title: 'Export-ready Report',
    description: 'Download a clean PDF or copy findings to share with clients and stakeholders instantly.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-100 dark:border-cyan-500/20',
  },
]

export function KeyFeatures() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white dark:bg-[#0c1120]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/60 dark:bg-blue-800/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-100/50 dark:bg-purple-900/15 blur-[90px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            Everything You Need for a Fast Audit
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-base">
            Built for agency speed — not academic perfection.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-6 hover:bg-white/80 dark:hover:bg-white/[0.06] hover:shadow-lg hover:shadow-gray-100/80 dark:hover:shadow-none transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
