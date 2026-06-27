import Link from "next/link";
import { FaCalendarAlt, FaTag } from "react-icons/fa";

// Category-specific colors for badges
const categoryColors = {
  Technology: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Finance: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Education: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "E-Commerce": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "Social Impact": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  Entertainment: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Food & Beverage": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "Real Estate": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  Transportation: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  Sustainability: "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export default function IdeaCard({ idea }) {
  const { _id, title, shortDescription, category, imageURL, createdAt } = idea;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const badgeColor = categoryColors[category] || categoryColors.Other;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageURL || "/placeholder-idea.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop";
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
            <FaTag className="text-[10px]" />
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FaCalendarAlt />
            <span>{formattedDate}</span>
          </div>
          <Link
            href={`/idea/${_id}`}
            className="px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-600 dark:border-violet-400 rounded-lg hover:bg-violet-600 hover:text-white dark:hover:bg-violet-400 dark:hover:text-slate-900 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
