import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'
import { HowItWorks } from '@/components/how-it-works'
import { WhatWeAnalyze } from '@/components/what-we-analyze'
import { KeyFeatures } from '@/components/feature-card'
import { FaqSection } from '@/components/faq-section'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <section className="relative hero-grid overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            SEO + AEO + GEO Audit
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-5 tracking-tight">
            Audit Your Website for{' '}
            <span className="gradient-text">Search & AI Visibility</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate a fast SEO, AEO and GEO readiness report for any website.
            Identify critical issues, quick wins, and AI search opportunities in seconds.
          </p>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-lg shadow-gray-100/50">
              <AuditUrlForm
                onNavigate={(id) => navigate({ to: '/audit/$auditId', params: { auditId: id } })}
              />
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Internal agency tool · Fast scan · AI-ready recommendations
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
            {[
              { label: 'SEO Signals', value: '20+' },
              { label: 'AEO Checks', value: '8' },
              { label: 'GEO Factors', value: '8' },
              { label: 'Scan Time', value: '<10s' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <HowItWorks />
      <WhatWeAnalyze />
      <KeyFeatures />
      <FaqSection />

      {/* CTA Bottom */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Audit Your First Site?
          </h2>
          <p className="text-blue-100 mb-8">
            Paste a URL and get a full SEO, AEO and GEO report in seconds.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Generate Audit Report
          </a>
        </div>
      </section>
    </>
  )
}
