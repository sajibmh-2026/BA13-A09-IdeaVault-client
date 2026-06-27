"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";

if (typeof document !== "undefined") document.title = "My Ideas - IdeaVault";
import PrivateRoute from "@/components/shared/PrivateRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiX, HiLightBulb, HiEye, HiTrendingUp } from "react-icons/hi";
import { useForm } from "react-hook-form";
import ConfirmModal from "@/components/shared/ConfirmModal";

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

export default function MyIdeasPage() {
  return (
    <PrivateRoute>
      <MyIdeas />
    </PrivateRoute>
  );
}

function MyIdeas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.email) {
      fetchIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    try {
      const res = await axiosInstance.get(`/ideas/user/${user.email}`);
      setIdeas(res.data);
    } catch (error) {
      toast.error("Failed to fetch your ideas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    try {
      await axiosInstance.delete(`/ideas/${id}`);
      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
      toast.success("Idea deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete idea");
    }
  };

  const openEditModal = (idea) => {
    setEditingIdea(idea);
    reset({
      title: idea.title,
      shortDescription: idea.shortDescription,
      detailedDescription: idea.detailedDescription,
      category: idea.category,
      imageURL: idea.imageURL,
      estimatedBudget: idea.estimatedBudget,
      targetAudience: idea.targetAudience,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      tags: idea.tags?.join(", "),
    });
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      const updatedData = {
        ...data,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await axiosInstance.put(`/ideas/${editingIdea._id}`, updatedData);
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === editingIdea._id ? { ...idea, ...updatedData } : idea
        )
      );
      setEditingIdea(null);
      toast.success("Idea updated successfully!");
    } catch (error) {
      toast.error("Failed to update idea");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Analytics calculations
  const totalIdeas = ideas.length;
  const totalViews = ideas.reduce((sum, idea) => sum + (idea.views || 0), 0);
  const uniqueCategories = [...new Set(ideas.map((idea) => idea.category))].length;
  const latestIdea = ideas.length > 0 ? new Date(ideas[0].createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Ideas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your published startup ideas.
        </p>
      </div>

      {/* Dashboard Analytics Cards */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <HiLightBulb className="text-xl text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalIdeas}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Ideas</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HiEye className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Views</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <HiTrendingUp className="text-xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueCategories}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <HiLightBulb className="text-xl text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{latestIdea}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Latest Idea</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">You haven&apos;t created any ideas yet.</p>
          <a
            href="/add-idea"
            className="inline-block mt-4 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700"
          >
            Create Your First Idea
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                  Date
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr
                  key={idea._id}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={idea.imageURL || "/placeholder-idea.jpg"}
                        alt={idea.title}
                        className="w-12 h-12 rounded-lg object-cover hidden sm:block"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {idea.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 md:hidden">
                          {idea.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-sm rounded-full">
                      {idea.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(idea)}
                        className="p-2 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <HiPencil className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(idea._id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <HiTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This action cannot be undone."
      />

      {/* Edit Modal */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Idea</h2>
              <button
                onClick={() => setEditingIdea(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onUpdate)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Short Description
                </label>
                <textarea
                  {...register("shortDescription", { required: true })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  {...register("detailedDescription", { required: true })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    {...register("imageURL")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Budget
                  </label>
                  <input
                    {...register("estimatedBudget")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    {...register("tags")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <input
                  {...register("targetAudience")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Problem Statement
                </label>
                <textarea
                  {...register("problemStatement")}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Proposed Solution
                </label>
                <textarea
                  {...register("proposedSolution")}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {updating ? "Updating..." : "Update Idea"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
