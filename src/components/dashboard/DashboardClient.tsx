"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import ProposalTable from "@/components/dashboard/ProposalTable";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { IProposal } from "@/models/Proposal";
import DashboardStats from "./DashboardStats";

interface DashboardClientProps {
  initialProposals: IProposal[];
  userRole: string;
}

export default function DashboardClient({
  initialProposals,
  userRole,
}: DashboardClientProps) {
  const router = useRouter();
  const [proposals, setProposals] = useState<IProposal[]>(initialProposals);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search input

  const isApplicant = userRole === "applicant";

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append("q", debouncedSearchTerm);
        if (status !== "all") params.append("status", status);

        const response = await axios.get(
          `/api/proposals/search?${params.toString()}`
        );
        setProposals(response.data);
      } catch (error) {
        console.error("Failed to fetch filtered proposals", error);
        // Here you might want to show a toast notification
      } finally {
        setIsLoading(false);
      }
    };

    // We don't fetch on initial render, only when filters change
    if (debouncedSearchTerm || status !== "all") {
      fetchProposals();
    } else {
      setProposals(initialProposals); // Reset to initial if filters are cleared
    }
  }, [debouncedSearchTerm, status, initialProposals]);

  const handleCreateNew = async () => {
    try {
      const response = await axios.post("/api/proposals");
      const newProposal = response.data;
      router.push(`/proposal/${newProposal._id}/edit`);
    } catch (error) {
      console.error("Failed to create new proposal draft", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isApplicant ? "My Proposals" : "All Submitted Proposals"}
        </h1>
        {isApplicant && (
          <button
            onClick={handleCreateNew}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-sky-500 dark:hover:bg-sky-600"
          >
            <FilePlus size={18} />
            New Proposal
          </button>
        )}
      </div>

      <DashboardStats userRole={userRole} />

      <div>
        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          status={status}
          setStatus={setStatus}
        />
        <div className="mt-4">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <ProposalTable proposals={proposals} userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  );
}
