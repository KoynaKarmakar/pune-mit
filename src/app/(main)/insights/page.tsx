"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Lightbulb, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface InsightsData {
  averageScores: { name: string; avgScore: number }[];
  hallmarks: string[];
  pitfalls: string[];
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getInsights() {
      const url = `/api/insights`; // Use relative URL for client-side fetching
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch insights");
        }
        const insightsData = await res.json();
        setData(insightsData);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setIsLoading(false);
      }
    }
    getInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p>Loading insights...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p>Failed to load insights. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Proposal Insights
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Learn from anonymized data to improve your next submission.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Average AI Score Comparison
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={data.averageScores}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "rgba(31, 41, 55, 0.8)",
                    border: "1px solid #4b5563",
                    backdropFilter: "blur(5px)",
                    color: "#e5e7eb",
                  }}
                />
                <Bar
                  dataKey="avgScore"
                  fill="#3b82f6"
                  name="Average Score"
                  unit="%"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hallmarks of Success */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-8 h-8 text-green-500" />
              <h2 className="ml-3 text-2xl font-bold">
                Hallmarks of Successful Proposals
              </h2>
            </div>
            <ul className="space-y-3">
              {data.hallmarks.map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-700">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <h2 className="ml-3 text-2xl font-bold">
                Common Pitfalls to Avoid
              </h2>
            </div>
            <ul className="space-y-3">
              {data.pitfalls.map((item, i) => (
                <li key={i} className="flex items-start">
                  <XCircle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
