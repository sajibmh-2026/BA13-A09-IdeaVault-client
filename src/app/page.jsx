"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Dynamic title
if (typeof document !== "undefined") document.title = "IdeaVault - Share & Validate Startup Ideas";
import axiosInstance from "@/services/axiosInstance";
import IdeaCard from "@/components/ideas/IdeaCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  HiLightBulb,
  HiTrendingUp,
  HiUserGroup,
  HiChatAlt2,
  HiArrowRight,
} from "react-icons/hi";
import {
  FaRocket,
  FaHandshake,
  FaChartLine,
  FaCogs,
  FaHeartbeat,
  FaGraduationCap,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axiosInstance.get("/ideas/trending");
        setTrendingIdeas(res.data);
      } catch (error) {
        console.error("Failed to fetch trending ideas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const categories = [
    { name: "Technology", icon: FaCogs, color: "bg-blue-500" },
    { name: "Health", icon: FaHeartbeat, color: "bg-red-500" },
    { name: "Finance", icon: FaChartLine, color: "bg-green-500" },
    { name: "Education", icon: FaGraduationCap, color: "bg-violet-500" },
    { name: "E-Commerce", icon: FaRocket, color: "bg-orange-500" },
    { name: "Social Impact", icon: FaHandshake, color: "bg-pink-500" },
  ];

  const stats = [
    { label: "Ideas Shared", value: "2,500+", icon: HiLightBulb },
    { label: "Active Members", value: "1,200+", icon: HiUserGroup },
    { label: "Discussions", value: "8,000+", icon: HiChatAlt2 },
    { label: "Trending Topics", value: "150+", icon: HiTrendingUp },
  ];

  const bannerSlides = [
    {
      title: "Share Your Startup Vision",
      subtitle: "Connect with innovators and bring your ideas to life",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    },
    {
      title: "Discover Revolutionary Ideas",
      subtitle: "Explore groundbreaking concepts from the community",
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop",
    },
    {
      title: "Validate & Collaborate",
      subtitle: "Get feedback and improve your startup concepts together",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[500px] md:h-[600px]"
        >
          {bannerSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 mb-8">{slide.subtitle}</p>
                      <Link
                        href="/ideas"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors text-lg"
                      >
                        Explore Ideas
                        <HiArrowRight className="text-xl" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trending Ideas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trending Ideas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest and most exciting startup ideas from our community of innovators.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIdeas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
          >
            View All Ideas
            <HiArrowRight />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find ideas across diverse industries and sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/ideas?category=${cat.name}`}
                className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 ${cat.color} rounded-full flex items-center justify-center text-white`}
                >
                  <cat.icon className="text-2xl" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Growing Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of entrepreneurs shaping the future.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <stat.icon className="text-4xl text-violet-600 dark:text-violet-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-600 dark:bg-violet-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Idea?
          </h2>
          <p className="text-violet-100 mb-8 text-lg">
            Join IdeaVault today and start sharing, validating, and growing your startup ideas with
            a community of like-minded innovators.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-violet-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Get Started
            <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
