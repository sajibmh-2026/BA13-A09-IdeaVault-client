"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "@/services/firebase.init";
import axiosInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register with email & password
  const registerUser = async (name, email, photoURL, password) => {
    setLoading(true);
    try {
      // Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name, photoURL });

      // Register in our backend
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        photoURL,
        password,
      });

      // Store token for cross-origin auth
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Registration successful!");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email & password
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const res = await axiosInstance.post("/auth/login", { email, password });

      // Store token for cross-origin auth
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Login successful!");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid email or password";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, photoURL } = result.user;

      const res = await axiosInstance.post("/auth/google-login", {
        name: displayName,
        email,
        photoURL,
      });

      // Store token for cross-origin auth
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Google login successful!");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await signOut(auth);
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Update profile
  const updateUserProfile = async (name, photoURL) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name, photoURL });
      }

      const res = await axiosInstance.put("/users/profile", { name, photoURL });
      setUser((prev) => ({ ...prev, name, photoURL }));
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
