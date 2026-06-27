"use client";

export default function IdeaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-slate-700" />

      {/* Content skeleton */}
      <div className="p-5">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6 mb-4" />

        <div className="flex items-center justify-between mt-auto">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24" />
          <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}
