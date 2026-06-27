"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

if (typeof document !== "undefined") document.title = "Add Idea - IdeaVault";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import PrivateRoute from "@/components/shared/PrivateRoute";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";

const categories = [
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

export default function AddIdeaPage() {
  return (
    <PrivateRoute>
      <AddIdeaForm />
    </PrivateRoute>
  );
}

function AddIdeaForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const ideaData = {
        ...data,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        authorEmail: user.email,
        authorName: user.name,
        authorPhoto: user.photoURL || "",
      };

      await axiosInstance.post("/ideas", ideaData);
      toast.success("Idea created successfully!");
      reset();
      router.push("/my-ideas");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create idea");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Idea
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details to share your startup idea with the community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Idea Title *
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Enter your idea title"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Short Description *
          </label>
          <textarea
            {...register("shortDescription", {
              required: "Short description is required",
              maxLength: { value: 200, message: "Maximum 200 characters" },
            })}
            rows="3"
            placeholder="Brief summary of your idea (max 200 characters)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
          />
          {errors.shortDescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Detailed Description *
          </label>
          <textarea
            {...register("detailedDescription", {
              required: "Detailed description is required",
            })}
            rows="6"
            placeholder="Provide a detailed explanation of your startup idea"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
          />
          {errors.detailedDescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.detailedDescription.message}
            </p>
          )}
        </div>

        {/* Category & Budget */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Estimated Budget
            </label>
            <input
              {...register("estimatedBudget")}
              placeholder="e.g., $10,000 - $50,000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Image URL & Tags */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              {...register("imageURL")}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              {...register("tags")}
              placeholder="AI, SaaS, B2B"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <input
            {...register("targetAudience")}
            placeholder="Who is this idea for?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Problem Statement
          </label>
          <textarea
            {...register("problemStatement")}
            rows="3"
            placeholder="What problem does this idea solve?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Proposed Solution */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Proposed Solution
          </label>
          <textarea
            {...register("proposedSolution")}
            rows="3"
            placeholder="How does your idea solve the problem?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <HiPlus className="text-xl" />
          {submitting ? "Creating..." : "Create Idea"}
        </button>
      </form>
    </div>
  );
}
