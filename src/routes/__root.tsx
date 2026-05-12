import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    const root = document.documentElement
    if (dark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }, [dark])
  return [dark, setDark] as const
}

function RootLayout() {
  const [dark, setDark] = useDarkMode()
  const { location } = useRouterState()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isHome) { setScrolled(false); return }
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const transparent = isHome && !scrolled

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`top-0 z-50 w-full transition-all duration-300 print:hidden ${
        transparent
          ? 'fixed bg-transparent border-transparent'
          : 'sticky border-b border-gray-100 bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-horizontal.webp"
              alt="XMS Audit Lab"
              className={`w-auto transition-all duration-300 ${transparent ? 'h-10' : 'h-8'}`}
            />
          </Link>
          <nav className={`hidden sm:flex items-center gap-7 text-base font-medium transition-colors duration-300 ${
            transparent ? 'text-white' : 'text-gray-500'
          }`}>
            <a
              href="/#how-it-works"
              className={`transition-colors ${transparent ? 'hover:text-white/70' : 'hover:text-gray-900'}`}
            >
              How it works
            </a>
            <a
              href="/#analyze"
              className={`transition-colors ${transparent ? 'hover:text-white/70' : 'hover:text-gray-900'}`}
            >
              What we analyze
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 py-6 px-4 text-xs text-gray-400 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} XMS — Xperience AI Marketing. Internal agency tool.</span>
          <div className="flex items-center gap-3">
            <span>SEO · AEO · GEO Audit Lab</span>
            <button
              onClick={() => setDark(d => !d)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {dark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
