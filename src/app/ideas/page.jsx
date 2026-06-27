"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

if (typeof document !== "undefined") document.title = "Browse Ideas - IdeaVault";
import IdeaCard from "@/components/ideas/IdeaCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { HiSearch, HiFilter } from "react-icons/hi";

const categories = [
  "All",
  "Technology",
  "Health",
  "Finance",
  "Education",
  "E-Commerce",
  "Social Impact",
  "Entertainment",
  "Food & Beverage",
  "Real Estate",
  "Transportation",
  "Sustainability",
  "Other",
];

export default function IdeasPage() {
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== "All") params.category = category;

        const res = await axiosInstance.get("/ideas", { params });
        setIdeas(res.data);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchIdeas, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Browse Ideas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore innovative startup ideas from our community.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search ideas by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="relative">
          <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[200px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">No ideas found.</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
