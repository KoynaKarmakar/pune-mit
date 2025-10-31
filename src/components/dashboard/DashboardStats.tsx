"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Percent,
  Hourglass,
  Edit3,
  ClipboardList,
  CheckCircle,
  XCircle,
} from "lucide-react";

const StatCard = ({ icon, value, label, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 flex items-start">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div className="ml-4">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function DashboardStats({ userRole }: { userRole: string }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg h-32 border dark:border-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {userRole === "applicant" && (
        <>
          <StatCard
            icon={<FileText size={24} />}
            value={stats.totalProposals}
            label="Total Proposals"
            color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
          />
          <StatCard
            icon={<Percent size={24} />}
            value={`${stats.approvalRate}%`}
            label="Approval Rate"
            color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300"
          />
          <StatCard
            icon={<Hourglass size={24} />}
            value={stats.underReview}
            label="Under Review"
            color="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
          />
          <StatCard
            icon={<Edit3 size={24} />}
            value={stats.needsRevision}
            label="Need Revision"
            color="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300"
          />
        </>
      )}

      {(userRole === "tsc_member" || userRole === "nacer_admin") && (
        <>
          <StatCard
            icon={<ClipboardList size={24} />}
            value={stats.proposalsForReview}
            label="Proposals for Review"
            color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            value={stats.proposalsReviewedByMe}
            label="Reviewed by You"
            color="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            value={stats.totalApproved}
            label="Total Approved"
            color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300"
          />
          <StatCard
            icon={<XCircle size={24} />}
            value={stats.totalRejected}
            label="Total Rejected"
            color="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
          />
        </>
      )}
    </div>
  );
}
