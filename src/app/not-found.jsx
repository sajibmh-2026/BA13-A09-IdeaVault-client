import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-violet-600 dark:text-violet-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
