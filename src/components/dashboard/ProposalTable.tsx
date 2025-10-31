"use client";

import { IProposal } from "@/models/Proposal";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100";
    case "under_review":
      return "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "revision_requested":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "approved":
      return "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
    case "terminated":
      return "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  proposalTitle,
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full m-4">
        <h3 className="text-lg font-bold">Confirm Deletion</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Are you sure you want to delete the draft:{" "}
          <span className="font-semibold">
            {proposalTitle || "Untitled Proposal"}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-sm rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProposalTable({
  proposals,
  userRole,
}: {
  proposals: IProposal[];
  userRole: string;
}) {
  const router = useRouter();
  const [proposalToDelete, setProposalToDelete] = useState<IProposal | null>(
    null
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!proposalToDelete) return;

    const toastId = toast.loading("Deleting draft...");
    try {
      await axios.delete(`/api/proposals/${proposalToDelete._id}`);
      toast.success("Draft deleted successfully.", { id: toastId });
      setProposalToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete draft.", { id: toastId });
      console.error(error);
      setProposalToDelete(null);
    }
  };

  const openDeleteModal = (e: React.MouseEvent, proposal: IProposal) => {
    e.stopPropagation();
    setProposalToDelete(proposal);
  };

  const handleRowClick = (proposal: IProposal) => {
    router.push(
      proposal.status === "draft"
        ? `/proposal/${proposal._id}/edit`
        : `/proposal/${proposal._id}`
    );
  };

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No Proposals Found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new proposal.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* --- Desktop Table View --- */}
      <div
        className="hidden md:block bg-blue-400 dark:bg-gray-800 rounded-lg border dark:border-blue-700 shadow-sm overflow-x-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-blue-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-blue-300
  dark:[&::-webkit-scrollbar-track]:bg-gray-700
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-500"
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Project Title
              </th>
              {userRole !== "applicant" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  AI Score
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {proposals.map((p) => (
              <tr
                key={p._id}
                onClick={() => handleRowClick(p)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {p.projectTitle || "Untitled Proposal"}
                </td>
                {userRole !== "applicant" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {p.aiScore !== undefined ? `${p.aiScore}%` : "N/A"}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {p.status === "draft" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/proposal/${p._id}/edit`);
                        }}
                        className="text-blue-600 cursor-pointer hover:text-blue-900 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(e, p)}
                        className="text-red-600 cursor-pointer hover:text-red-900 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/proposal/${p._id}`);
                      }}
                      className="text-gray-600 cursor-pointer hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Card View --- */}
      <div className="md:hidden space-y-4">
        {proposals.map((p, index) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleRowClick(p)}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm flex items-center justify-between cursor-pointer"
          >
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {p.projectTitle || "Untitled Proposal"}
              </h4>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    p.status
                  )}`}
                >
                  {p.status.replace("_", " ")}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </motion.div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={!!proposalToDelete}
        onClose={() => setProposalToDelete(null)}
        onConfirm={handleDelete}
        proposalTitle={proposalToDelete?.projectTitle}
      />
    </>
  );
}
