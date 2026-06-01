import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sparkles, ChevronDown, Check } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'
import { HowItWorks } from '@/components/how-it-works'
import { WhatWeAnalyze } from '@/components/what-we-analyze'
import { FaqSection } from '@/components/faq-section'

export const Route = createFileRoute('/plp')({
  component: PlpPage,
})

const HERO_IMAGES = [
  { src: '/Hero_slide-3.png', alt: 'Laborman usin XMS Audit on phone' },
  { src: '/Hero_slide-4.png', alt: 'Person using XMS Audit Lab on smartphone' },
  { src: '/Hero_slide-2.png', alt: 'Woman using XMS Audit Lab on phone' },
  { src: '/Hero_slide-1.png', alt: 'Laborman usin XMS Audit on phone' },

]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden lg:block relative overflow-hidden">
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute bottom-0 right-0 w-auto max-h-full max-w-full object-contain transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}
    </div>
  )
}



const STATS = [
  { label: 'SEO Signals', value: '20+' },
  { label: 'AEO Checks', value: '8' },
  { label: 'GEO Factors', value: '8' },
  { label: 'Scan Time', value: '<10s' },
]

function PlpPage() {
  const navigate = useNavigate()

  const scrollToForm = () =>
    document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      {/* ── Hero — 100vh desktop ── */}
      <section className="relative overflow-hidden bg-[#060d20]">
        {/* Ambient orbs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-700/[0.18] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-700/[0.13] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-600/[0.07] rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 hero-dots pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 pt-8">

          {/* Left — 40%, text vertically centered, owns vertical padding */}
          <div className="flex flex-col justify-center items-start py-24 md:py-32">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-[1.06] tracking-tight mb-6">
              Is Your Business Visible &nbsp;
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                to ChatGPT, Claude & Gemini?
              </span>
            </h1>

            <p className="text-gray-200 font-bold text-base md:text-[1.05rem] leading-relaxed mb-10 max-w-[30rem]">
              Get your SEO, AEO & GEO score in seconds. Know if ChatGPT, Claude, and Gemini can find and recommend your business — and exactly what to fix.
            </p>

            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-2.5 bg-[#22C55E] hover:bg-[#16a34a] active:scale-[0.98] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 cursor-pointer shadow-xl shadow-green-600/30 hover:shadow-green-500/40 hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 32px rgba(34,197,94,0.28)' }}
            >
              <Sparkles className="w-4 h-4 text-white/80" />
              Analyze My Site — Free
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>

            <div className="flex flex-col gap-2 mt-4">
              {[
                'No account · No credit card',
                'Full results in under 10 seconds',
                'SEO, AEO & GEO combined in one report',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — 60%, carousel anchored to bottom */}
          <HeroCarousel />
        </div>
      </section>

      {/* ── Audit Form Section ── */}
      <section id="audit-form" className="py-16 px-4 bg-white border-b border-gray-100 dark:bg-[#0c1120] dark:border-gray-800">
        <div className="max-w-2xl mx-auto">

          {/* Stats above input */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-8">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block" />}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{s.value}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Analyze Any Website — Free
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Paste a URL and get your full report in under 10 seconds.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-full p-3 shadow-lg shadow-gray-100/50 dark:bg-white/[0.04] dark:border-white/10 dark:shadow-none">
            <AuditUrlForm
              onNavigate={(id) => navigate({ to: '/audit/$auditId', params: { auditId: id } })}
            />
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            Free · No account required · Fast scan · AI-ready analysis
          </p>
        </div>
      </section>

      <HowItWorks />
      <WhatWeAnalyze />
      <FaqSection />

      {/* ── Bottom CTA ── */}
      <section className="relative min-h-[72vh] flex items-center justify-center px-4 overflow-hidden bg-gray-950 text-white text-center">
        {/* subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px]" />
        </div>
        {/* grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-xs text-blue-400 font-semibold mb-5">
            Free · Instant · No sign-up
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Ready to Audit<br className="hidden md:block" /> Your First Site?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Paste a URL and get a full SEO, AEO and GEO report in seconds.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors cursor-pointer shadow-xl shadow-blue-900/40 text-base"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Generate Audit Report
          </button>
        </div>
      </section>
    </>
  )
}
