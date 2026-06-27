import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";

export default function Footer() {
  const categories = [
    "Technology",
    "Health",
    "Finance",
    "Education",
    "E-Commerce",
    "Social Impact",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiLightBulb className="text-3xl text-violet-400" />
              <span className="text-xl font-bold text-white">
                Idea<span className="text-violet-400">Vault</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              A modern startup idea sharing platform where entrepreneurs connect, collaborate, and
              validate ideas together.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-violet-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="hover:text-violet-400 transition-colors">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link href="/add-idea" className="hover:text-violet-400 transition-colors">
                  Share Your Idea
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/ideas?category=${cat}`}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <p className="text-sm text-gray-400 mb-4">contact@ideavault.com</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaXTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} IdeaVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
