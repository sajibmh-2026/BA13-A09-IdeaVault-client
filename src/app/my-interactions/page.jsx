"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";

if (typeof document !== "undefined") document.title = "My Interactions - IdeaVault";
import PrivateRoute from "@/components/shared/PrivateRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import IdeaCard from "@/components/ideas/IdeaCard";
import toast from "react-hot-toast";

export default function MyInteractionsPage() {
  return (
    <PrivateRoute>
      <MyInteractions />
    </PrivateRoute>
  );
}

function MyInteractions() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const fetchInteractions = async () => {
        try {
          const res = await axiosInstance.get(`/comments/user/${user.email}`);
          setIdeas(res.data);
        } catch (error) {
          toast.error("Failed to fetch interactions");
        } finally {
          setLoading(false);
        }
      };
      fetchInteractions();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Interactions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ideas you have commented on and engaged with.
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            You haven&apos;t interacted with any ideas yet.
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            Browse ideas and leave comments to see them here.
          </p>
          <a
            href="/ideas"
            className="inline-block mt-4 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700"
          >
            Browse Ideas
          </a>
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
