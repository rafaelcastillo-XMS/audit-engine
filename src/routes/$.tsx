import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-bold text-gray-200 dark:text-gray-800 select-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Page not found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/plp"
        className="mt-8 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
