import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function useDarkMode() {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const [dark, setDark] = useState(() => mql.matches)

  // Follow system preference changes automatically
  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  return [dark, setDark] as const
}

function RootLayout() {
  const [dark, setDark] = useDarkMode()
  const { location } = useRouterState()
  const isAuditPage = location.pathname.startsWith('/audit/')
  const isIndexPage = location.pathname === '/'
  const isDarkHero = location.pathname === '/plp' || isAuditPage
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isDarkHero) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDarkHero])

  const transparent = isDarkHero && !scrolled

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`top-0 z-50 w-full transition-all duration-300 print:hidden ${isIndexPage ? 'hidden' : ''} ${transparent
        ? 'fixed bg-transparent border-transparent'
        : 'sticky border-b border-gray-100 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95'
        }`}>
        <div className="max-w-6xl mx-auto py-1 px-4 h-16 flex items-center justify-between">
          {!isAuditPage && (
            <Link to={isIndexPage ? '/' : '/plp'} className="flex items-center">
              <img
                src={transparent || dark ? '/LOGO - BLACK BACKGROUND.webp' : '/logo-horizontal.webp'}
                alt="XMS Audit Lab"
                className={`w-auto transition-all duration-300 ${transparent ? 'h-14' : 'h-12'}`}
              />
            </Link>
          )}
          {!isAuditPage && !isIndexPage && (
            <nav className={`hidden sm:flex items-center gap-7 text-base font-medium transition-colors duration-300 ${
              transparent ? 'text-white' : 'text-gray-500 dark:text-gray-300'
              }`}>
              <a
                href="/plp#how-it-works"
                className={`transition-colors ${transparent ? 'hover:text-white/70' : 'hover:text-gray-900 dark:hover:text-white'}`}
              >
                How it works
              </a>
              <a
                href="/plp#analyze"
                className={`transition-colors ${transparent ? 'hover:text-white/70' : 'hover:text-gray-900 dark:hover:text-white'}`}
              >
                What we analyze
              </a>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-gray-950 py-6 px-4 text-xs text-gray-500 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} XMS — Xperience AI Marketing. Internal agency tool.</span>
          <div className="flex items-center gap-3">
            <span>SEO · AEO · GEO Audit Lab</span>
            <button
              onClick={() => setDark(d => !d)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 text-xs font-medium text-gray-400 hover:border-white/30 hover:text-gray-200 transition-colors"
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
