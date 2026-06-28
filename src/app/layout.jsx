import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AuthProvider from "@/contexts/AuthContext";
import ThemeProvider from "@/contexts/ThemeContext";

export const metadata = {
  title: "IdeaVault - Startup Idea Sharing Platform",
  description:
    "Share, explore, and validate startup ideas with a community of entrepreneurs and innovators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/fav.png" />
        <link
          rel="alternate icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%238b5cf6'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='20' fill='url(%23g)'/%3E%3Cpath d='M50 15C35 15 25 28 25 40C25 52 35 58 38 68L62 68C65 58 75 52 75 40C75 28 65 15 50 15Z' fill='url(%23b)'/%3E%3Crect x='38' y='72' width='24' height='5' rx='2' fill='%23d1d5db'/%3E%3Crect x='40' y='80' width='20' height='5' rx='2' fill='%23d1d5db'/%3E%3Cpath d='M40 45C40 35 60 35 60 45C60 50 40 50 40 45Z' fill='none' stroke='%23ea580c' stroke-width='3'/%3E%3C/svg%3E"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
