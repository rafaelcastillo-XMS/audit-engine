import { Link2, ScanLine, BarChart3, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    step: '01',
    title: 'Enter a URL',
    description: 'Paste any website URL — homepage, landing page, or blog post. No account needed.',
  },
  {
    icon: ScanLine,
    step: '02',
    title: 'Run the Analysis',
    description: 'We fetch the page and analyze SEO fundamentals, AEO signals, and GEO readiness in seconds.',
  },
  {
    icon: BarChart3,
    step: '03',
    title: 'Review the Report',
    description: 'Get actionable scores, critical issues, quick wins, and prioritized recommendations.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A fast three-step process that surfaces actionable insights for any website.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 relative">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-3xl font-black text-gray-100 select-none">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 z-10 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
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
