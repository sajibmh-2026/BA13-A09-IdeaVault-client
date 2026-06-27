"use client";

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200 dark:bg-slate-700" />
          <div className="p-5">
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6 mb-4" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24" />
              <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
