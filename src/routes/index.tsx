import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sparkles, ChevronDown, Check } from 'lucide-react'
import { AuditUrlForm } from '@/components/audit-url-form'
import { HowItWorks } from '@/components/how-it-works'
import { WhatWeAnalyze } from '@/components/what-we-analyze'
import { KeyFeatures } from '@/components/feature-card'
import { FaqSection } from '@/components/faq-section'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const HERO_IMAGES = [
  { src: '/Hero_Singleman.png', alt: 'Person using XMS Audit Lab on smartphone' },
  { src: '/Hero_womanTel.png', alt: 'Woman using XMS Audit Lab on phone' },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden lg:block relative">
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute bottom-0 right-0 w-auto h-[90%] max-w-none transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}

function MockReportCard() {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/80 to-transparent" />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white/80 tracking-wide">Audit Report</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">yourdomain.com</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-600 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              Just analyzed
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
            {[
              { label: 'Overall', score: 87, ring: 'ring-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'SEO', score: 91, ring: 'ring-blue-500/40', text: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'AEO', score: 74, ring: 'ring-purple-500/40', text: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'GEO', score: 68, ring: 'ring-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <div className={`w-14 h-14 rounded-full ${item.bg} ring-2 ${item.ring} flex items-center justify-center`}>
                  <span className={`font-black text-sm ${item.text}`}>{item.score}</span>
                </div>
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="space-y-2">
            {[
              { dot: 'bg-red-400', text: 'Missing canonical tag', badge: 'Critical', color: 'text-red-400' },
              { dot: 'bg-yellow-400', text: 'Title tag too short (38 ch.)', badge: 'Warning', color: 'text-yellow-400' },
              { dot: 'bg-blue-400', text: 'Add FAQ schema markup', badge: 'Info', color: 'text-blue-400' },
              { dot: 'bg-green-400', text: 'HTTPS enabled', badge: 'Pass', color: 'text-green-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-xs text-gray-300 flex-1 truncate">{item.text}</span>
                <span className={`text-[10px] font-semibold flex-shrink-0 ${item.color}`}>{item.badge}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <div className="flex-1 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
              <span className="text-xs text-blue-400 font-medium">Fix My Site</span>
            </div>
            <div className="w-24 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <span className="text-xs text-gray-500">Export PDF</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-600/10 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

const STATS = [
  { label: 'SEO Signals', value: '20+' },
  { label: 'AEO Checks', value: '8' },
  { label: 'GEO Factors', value: '8' },
  { label: 'Scan Time', value: '<10s' },
]

function HomePage() {
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
              className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-xl shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
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
      <section id="audit-form" className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto">

          {/* Stats above input */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-4 bg-gray-200 hidden sm:block" />}
                <span className="text-xl font-black text-gray-900">{s.value}</span>
                <span className="text-sm text-gray-400">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Analyze Any Website — Free
            </h2>
            <p className="text-gray-500">
              Paste a URL and get your full report in under 10 seconds.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-lg shadow-gray-100/50">
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
      <KeyFeatures />
      <FaqSection />

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Audit Your First Site?
          </h2>
          <p className="text-blue-100 mb-8">
            Paste a URL and get a full SEO, AEO and GEO report in seconds.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Generate Audit Report
          </button>
        </div>
      </section>
    </>
  )
}
