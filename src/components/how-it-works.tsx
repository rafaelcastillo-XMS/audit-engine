import { ArrowRight } from 'lucide-react'

const steps = [
  {
    image: '/HowItWorks-01-analysis_free.png',
    step: 'Step 1',
    title: 'Enter Your URL',
    description: 'Paste any website URL — homepage, landing page, or blog post. No account, no credit card. Your full audit is up and running in seconds.',
  },
  {
    image: '/HowItWorks-02-reults.png',
    step: 'Step 2',
    title: 'Get Your Score & Error List',
    description: 'Receive an overall grade plus a prioritized list of critical errors and individual scores for SEO, AEO, and GEO — know exactly where you stand in AI-powered search, right now.',
  },
  {
    image: '/HowItWorks-03-complete.png',
    step: 'Step 3',
    title: 'Fix It & Rise to the Top',
    description: 'Our marketing and SEO experts tackle every issue on your list, elevate your rankings, and position your business to be found and recommended by ChatGPT, Claude, and Gemini.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-[#0c1120]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 block">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A fast three-step process that surfaces actionable insights for any website.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 relative">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2 block">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/3 -right-2 z-10 transform -translate-y-1/2">
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
