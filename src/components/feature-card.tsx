import { Zap, BarChart3, Lightbulb, AlertCircle, Trophy, FileDown } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Fast Website Scan',
    description: 'Get a complete audit in seconds — no browser extension, no crawl delay.',
  },
  {
    icon: BarChart3,
    title: 'SEO / AEO / GEO Scores',
    description: 'Three distinct scores mapped to traditional search, answer engines, and AI visibility.',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Recommendations',
    description: 'Deterministic findings with clear steps — no vague advice.',
  },
  {
    icon: AlertCircle,
    title: 'Critical Issues First',
    description: 'We surface what matters most so you can fix the biggest problems immediately.',
  },
  {
    icon: Trophy,
    title: 'Quick Wins',
    description: 'Easy improvements that can move the needle fast — identified automatically.',
  },
  {
    icon: FileDown,
    title: 'Export-ready Report',
    description: 'Copy the full report or export it for client presentations.',
  },
]

export function KeyFeatures() {
  return (
    <section className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for a Fast Audit
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Built for agency speed — not for academic perfection.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-4.5 h-4.5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
