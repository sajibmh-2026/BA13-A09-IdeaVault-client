"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { HiUser, HiMail, HiPhotograph, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const { registerUser, googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => { document.title = "Register - IdeaVault"; }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const validatePassword = (pwd) => {
    const errs = [];
    if (pwd.length < 6) errs.push("Password must be at least 6 characters");
    if (!/[A-Z]/.test(pwd)) errs.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(pwd)) errs.push("Password must contain at least one lowercase letter");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors);
      return;
    }

    setLoading(true);
    try {
      await registerUser(name, email, photoURL, password);
      router.push("/");
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      router.push("/");
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join IdeaVault and start sharing your ideas
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {/* Google Register */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-6"
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {errors.map((err, idx) => (
                <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                  • {err}
                </p>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Photo URL
              </label>
              <div className="relative">
                <HiPhotograph className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 6 chars, 1 upper, 1 lower"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-600 dark:text-violet-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
