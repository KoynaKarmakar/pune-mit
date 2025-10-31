"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  SearchCode,
  BrainCircuit,
  ClipboardCheck,
} from "lucide-react";

// Individual step component
const WorkflowStep = ({
  icon,
  title,
  children,
  align = "left",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) => {
  // Responsive alignment classes
  const alignmentClasses =
    align === "left"
      ? "md:items-start md:text-left"
      : "md:items-end md:text-right";
  const xOffset = align === "left" ? -50 : 50;

  return (
    <motion.div
      className="w-full md:w-1/2 p-4 my-4 md:my-8 flex"
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className={`w-full max-w-sm mx-auto flex flex-col items-center text-center ${alignmentClasses}`}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-amber-400 mb-4 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{children}</p>
      </div>
    </motion.div>
  );
};

// Main Workflow Section
export default function WorkflowSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={targetRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[#1A1A1A]"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            From Submission to Insight
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The Sanshoधनम् Workflow
          </p>
          <div className="mt-4 h-1 w-20 bg-amber-400 mx-auto rounded"></div>
        </motion.div>

        <div className="relative">
          {/* The Pipeline (Hidden on mobile) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-700/50">
            <motion.div
              className="w-full bg-amber-400"
              style={{ scaleY: pathLength, transformOrigin: "top" }}
            />
          </div>

          {/* Container for steps */}
          <div className="flex flex-col items-center">
            <div className="w-full flex md:justify-start">
              <WorkflowStep
                title="1. Secure Submission"
                icon={<FileText className="text-amber-500" size={32} />}
              >
                A proposal is submitted through our intuitive form—accessible
                online or off, with all data saved securely.
              </WorkflowStep>
            </div>
            <div className="w-full flex md:justify-end">
              <WorkflowStep
                title="2. Novelty Check"
                icon={<SearchCode className="text-amber-500" size={32} />}
                align="right"
              >
                Instantly, the proposal's core concepts are checked against a
                vector database of past projects to assess novelty.
              </WorkflowStep>
            </div>
            <div className="w-full flex md:justify-start">
              <WorkflowStep
                title="3. AI Evaluation"
                icon={<BrainCircuit className="text-amber-500" size={32} />}
              >
                Gemini evaluates the proposal against dozens of critical
                criteria, generating a detailed, evidence-based report.
              </WorkflowStep>
            </div>
            <div className="w-full flex md:justify-end">
              <WorkflowStep
                title="4. Actionable Report"
                icon={<ClipboardCheck className="text-amber-500" size={32} />}
                align="right"
              >
                A clear report with a final score is delivered, allowing
                reviewers to focus their expertise where it matters most.
              </WorkflowStep>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
