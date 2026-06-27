"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-slate-700" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-md w-3/4 mb-3" />

        {/* Description lines */}
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-full mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-5/6 mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-24" />
          <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
