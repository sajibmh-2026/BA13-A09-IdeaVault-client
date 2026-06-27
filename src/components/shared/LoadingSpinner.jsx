export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-800 rounded-full animate-spin border-t-violet-600 dark:border-t-violet-400"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">Loading...</p>
      </div>
    </div>
  );
}
