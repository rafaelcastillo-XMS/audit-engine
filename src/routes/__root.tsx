import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Zap } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">
              XMS <span className="text-blue-600">Audit Lab</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="/#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="/#analyze" className="hover:text-gray-900 transition-colors">What we analyze</a>
            <Link to="/" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Analyze →</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 py-6 px-4 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} XMS — Xperience AI Marketing. Internal agency tool.</span>
          <span>SEO · AEO · GEO Audit Lab</span>
        </div>
      </footer>
    </div>
  )
}
