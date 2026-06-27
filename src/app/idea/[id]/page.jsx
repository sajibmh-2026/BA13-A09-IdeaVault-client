"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

if (typeof document !== "undefined") document.title = "Idea Details - IdeaVault";
import { useAuth } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/shared/PrivateRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FaTag,
  FaDollarSign,
  FaUsers,
  FaExclamationTriangle,
  FaLightbulb,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import { HiPencil, HiTrash } from "react-icons/hi";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function IdeaDetailsPage() {
  return (
    <PrivateRoute>
      <IdeaDetails />
    </PrivateRoute>
  );
}

function IdeaDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ideaRes, commentsRes] = await Promise.all([
          axiosInstance.get(`/ideas/${id}`),
          axiosInstance.get(`/comments/${id}`),
        ]);
        setIdea(ideaRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        toast.error("Failed to load idea");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axiosInstance.post("/comments", {
        ideaId: id,
        userEmail: user.email,
        userName: user.name,
        userPhoto: user.photoURL,
        text: commentText,
      });
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await axiosInstance.put(`/comments/${commentId}`, { text: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, text: editText } : c))
      );
      setEditingComment(null);
      setEditText("");
      toast.success("Comment updated!");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeleteTarget(commentId);
  };

  const confirmDeleteComment = async () => {
    const commentId = deleteTarget;
    setDeleteTarget(null);
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!idea) return <div className="text-center py-20">Idea not found.</div>;

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Image */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img
          src={idea.imageURL || "/placeholder-idea.jpg"}
          alt={idea.title}
          className="w-full h-[300px] md:h-[400px] object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop";
          }}
        />
      </div>

      {/* Title & Meta */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-sm font-semibold rounded-full">
            <FaTag className="text-xs" />
            {idea.category}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaCalendarAlt /> {formattedDate}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaEye /> {idea.views} views
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {idea.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{idea.shortDescription}</p>

        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
          {idea.authorPhoto ? (
            <img
              src={idea.authorPhoto}
              alt={idea.authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
              {idea.authorName?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{idea.authorName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Idea Author</p>
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="space-y-8 mb-12">
        {/* Detailed Description */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Detailed Description
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {idea.detailedDescription}
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-3">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Problem Statement</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{idea.problemStatement || "N/A"}</p>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <FaLightbulb className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proposed Solution</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{idea.proposedSolution || "N/A"}</p>
          </div>
        </div>

        {/* Budget & Audience */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <FaDollarSign className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Estimated Budget</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{idea.estimatedBudget || "N/A"}</p>
          </div>

          <div className="p-6 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-violet-600 dark:text-violet-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Target Audience</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{idea.targetAudience || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment */}
        {user && (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
                />
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List — Timeline Style */}
        <div className="relative">
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-0">
              {/* Timeline line */}
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

              {comments.map((comment, idx) => (
                <div key={comment._id} className="relative flex gap-4 pb-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    {comment.userPhoto ? (
                      <img
                        src={comment.userPhoto}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-900">
                        {comment.userName?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Comment content */}
                  <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {user?.email === comment.userEmail && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditText(comment.text);
                            }}
                            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                          >
                            <HiPencil className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <HiTrash className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingComment === comment._id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            className="px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
}
