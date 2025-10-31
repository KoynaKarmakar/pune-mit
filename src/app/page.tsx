"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  FileClock,
  ShieldCheck,
  BarChart3,
  Check,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Logo from "../components/ui/Logo";
// import icons from '@/'

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-bold text-sky-400">{value}</p>
    <p className="text-sm text-gray-400 mt-2">{label}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  name,
  title,
}: {
  quote: string;
  name: string;
  title: string;
}) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <p className="text-gray-300 italic">"{quote}"</p>
    <div className="mt-4">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-sm text-sky-400">{title}</p>
    </div>
  </div>
);

// --- Main Landing Page Component ---
export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-gray-50 dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#1A1A1A]/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex gap-2 items-center font-bold text-2xl">
            <Logo />
            <span className="bg-gradient-to-r max-md:hidden from-yellow-600 via-orange-300 to-white bg-clip-text text-transparent">
              - Koyle se Heere tak
            </span>
          </div>
          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium hover:text-sky-400 transition-colors"
                >
                  <UserIcon size={16} />
                  <span>{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* --- Hero Section (Overhauled) --- */}
        {/* <section className="relative text-center py-24 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#111] dark:to-[#1A1A1A] -z-10"></div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white"
          >
            <span className="text-blue-600 dark:text-sky-400">Accelerate</span>{" "}
            Your Research Potential
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400"
          >
            Sanshoधनम् blends human expertise with intelligent systems to
            transform the way R&D proposals are reviewed and funded.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/proposal/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white dark:bg-sky-500 dark:text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 dark:hover:bg-sky-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-sky-500/20"
            >
              Submit Your Proposal <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section> */}

        <section className="relative text-center py-24 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div style={{ position: "relative", height: "50vh", width: "100%" }}>
            <div
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{
                backgroundImage: 'url("/photo.png")', // Ensure the path is correct
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white"
          >
            <span className="text-blue-600 dark:text-sky-400">Accelerate</span>{" "}
            Your Research Potential
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400"
          >
            Sanshoधनम् blends human expertise with intelligent systems to
            transform the way R&D proposals are reviewed and funded.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/proposal/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white dark:bg-sky-500 dark:text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 dark:hover:bg-sky-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-sky-500/20"
            >
              Submit Your Proposal <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section>

        {/* --- Social Proof / Statistics Section (New) --- */}
        <section className="py-16 bg-white dark:bg-black/20">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value="90%" label="Reduction in Initial Screening Time" />
            <StatCard value="75%" label="Increase in Reviewer Efficiency" />
            <StatCard value="100%" label="Secure & Transparent Process" />
          </div>
        </section>

        {/* --- "Problem/Solution" Section (New) --- */}
        <section className="py-24 px-4 bg-gray-50 dark:bg-[#1A1A1A]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              From Tedious to Transformed
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The traditional proposal review process is slow, subjective, and
              lacks data-driven insights. Sanshoधनम् changes that.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
              <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-500/30">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                  The Old Way
                </h3>
                <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-400">
                  <li>- Manual, time-consuming screening</li>
                  <li>- Subjective, inconsistent reviews</li>
                  <li>- Difficulty in tracking novelty</li>
                  <li>- Lack of actionable insights</li>
                </ul>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-500/30">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                  The Sanshoधनम् Way
                </h3>
                <ul className="mt-4 space-y-2 text-gray-800 dark:text-gray-300">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-1 text-green-600 dark:text-green-400" />
                    Automated AI-powered initial evaluation
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-1 text-green-600 dark:text-green-400" />
                    Objective, data-driven checklist scoring
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-1 text-green-600 dark:text-green-400" />
                    Instant novelty checks against past projects
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-1 text-green-600 dark:text-green-400" />
                    Actionable insights to improve future proposals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section (Restyled) --- */}
        {/* <section className="py-24 px-4 bg-gray-100 dark:bg-black/20"> */}
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-16">
            A Paradigm Shift in Proposal Review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <BrainCircuit className="text-blue-600 dark:text-sky-400" />
              }
              title="Intelligent Verification"
            >
              Our AI performs a detailed evaluation against official formats in
              minutes, not days.
            </FeatureCard>
            <FeatureCard
              icon={<ShieldCheck className="text-blue-600 dark:text-sky-400" />}
              title="Novelty Detection"
            >
              We check for originality by comparing submissions against a vector
              database of past projects.
            </FeatureCard>
            <FeatureCard
              icon={<FileClock className="text-blue-600 dark:text-sky-400" />}
              title="Secure Offline Drafting"
            >
              Draft your proposals anytime. Your work is saved locally and syncs
              when you're back online.
            </FeatureCard>
            <FeatureCard
              icon={<BarChart3 className="text-blue-600 dark:text-sky-400" />}
              title="Transparent Analytics"
            >
              Access aggregated data to understand key trends and improve future
              submissions.
            </FeatureCard>
          </div>
        </div>
        {/* </section> */}

        {/* --- Testimonials Section (New) --- */}
        <section className="py-24 px-4 dark:bg-[#1A1A1A]">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-16">
              Trusted by Leaders in Research
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <TestimonialCard
                quote="Sanshoधनम् has revolutionized our workflow. The AI screening allows our reviewers to focus on what truly matters: the scientific merit of the proposals."
                name="A Senior Official"
                title="Ministry of Coal"
              />
              <TestimonialCard
                quote="The novelty check is a game-changer. We can now instantly identify overlapping research and guide applicants toward more innovative projects."
                name="A TSC Member"
                title="CMPDI"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        {/* <section className="bg-blue-600 dark:bg-sky-500 py-24 px-4"> */}
        {/* <section className="bg-white dark:bg-gray-800 py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your R&D workflow?
            </h2>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section> */}

        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-8 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to transform your R&D workflow?
            </h2>
            <p className="text-gray-300 text-lg">
              Accelerate innovation in coal, energy, and sustainability — start
              now.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600 dark:text-gray-400">
          <Logo className="text-xl justify-center mb-4" />
          <p>
            &copy; {new Date().getFullYear()} Developed for the Ministry of Coal
            & CMPDI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);
