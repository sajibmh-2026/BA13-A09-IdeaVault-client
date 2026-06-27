"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/shared/PrivateRoute";

if (typeof document !== "undefined") document.title = "Profile - IdeaVault";
import toast from "react-hot-toast";
import { HiCamera, HiUser, HiMail } from "react-icons/hi";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}

function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(name, photoURL);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and update your profile information.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header / Avatar */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-600 p-8 flex flex-col items-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-violet-100">{user?.email}</p>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <HiUser /> Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <HiCamera /> Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <HiMail /> Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
