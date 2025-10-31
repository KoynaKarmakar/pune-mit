"use client";

import { useState } from "react";
import { IProposal } from "@/models/Proposal";
import AiChecklist from "./AiChecklist";
import ReviewForm from "./ReviewForm";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { exportToPdf } from "@/lib/pdf";

const DataField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </h3>
    <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
      {value || "Not Provided"}
    </p>
  </div>
);

// Helper to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value * 100000); // Assuming values are in Lakhs

// Budget display component
const BudgetView = ({ budget }: { budget: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    <div>
      <h4 className="font-semibold mb-2">Capital Expenditure</h4>
      <p>Equipment: {formatCurrency(budget.capital?.equipment || 0)}</p>
      <p>
        Land & Building: {formatCurrency(budget.capital?.landBuilding || 0)}
      </p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Revenue Expenditure</h4>
      <p>
        Salaries/Allowances: {formatCurrency(budget.revenue?.salaries || 0)}
      </p>
      <p>Consumables: {formatCurrency(budget.revenue?.consumables || 0)}</p>
      <p>Travel: {formatCurrency(budget.revenue?.travel || 0)}</p>
      <p>
        Workshops/Seminars:{" "}
        {formatCurrency(budget.revenue?.workshopSeminar || 0)}
      </p>
    </div>
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Other Costs</h4>
      <p>Contingency: {formatCurrency(budget.contingency || 0)}</p>
      <p>
        Institutional Overhead:{" "}
        {formatCurrency(budget.institutionalOverhead || 0)}
      </p>
      <p>Taxes/Duties: {formatCurrency(budget.taxes || 0)}</p>
    </div>
  </div>
);

// Status color utility
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

export default function ProposalDetailView({
  proposal,
  isReviewer,
}: {
  proposal: IProposal;
  isReviewer: boolean;
}) {
  const router = useRouter();
  const [currentProposal, setCurrentProposal] = useState(proposal);
  const [isExporting, setIsExporting] = useState(false);

  const handleReviewSubmitted = (updatedProposal: IProposal) => {
    setCurrentProposal(updatedProposal);
    router.refresh();
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportToPdf(
      "proposal-export-content",
      `proposal-${currentProposal.projectTitle}`
    );
    setIsExporting(false);
  };

  const canBeEdited = ["draft", "revision_requested"].includes(
    currentProposal.status
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-4">
          {canBeEdited && !isReviewer && (
            <button
              onClick={() =>
                router.push(`/proposal/${currentProposal._id}/edit`)
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer"
            >
              <Edit size={16} /> Edit Draft
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Export to PDF"}
          </button>
        </div>
      </div>

      {/* This div wraps all content destined for the PDF */}
      <div id="proposal-export-content">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Proposal Data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-2/3 bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700 h-fit"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {currentProposal.projectTitle}
                </h1>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  Submitted by:{" "}
                  <span className="font-semibold">
                    {(currentProposal.applicant as any)?.name || "N/A"}
                  </span>
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  currentProposal.status
                )}`}
              >
                {currentProposal.status.replace("_", " ")}
              </span>
            </div>

            <div className="border-t dark:border-gray-700 pt-6 space-y-6">
              {/* Core Details */}
              <DataField
                label="Definition of the Issue"
                value={currentProposal.definitionOfIssue}
              />
              <DataField
                label="Objectives"
                value={currentProposal.objectives}
              />
              <DataField
                label="Justification for Subject Area"
                value={currentProposal.justification}
              />

              {/* Work Plan & Methodology */}
              <DataField label="Work Plan" value={currentProposal.workPlan} />
              <DataField
                label="Methodology"
                value={currentProposal.methodology}
              />
              <DataField
                label="Benefit to Coal Industry"
                value={currentProposal.benefitToIndustry}
              />

              {/* Novelty */}
              <DataField
                label="Literature / Web Survey"
                value={currentProposal.literatureSurvey}
              />
              <DataField
                label="R&D / Novelty Components"
                value={currentProposal.rdComponents}
              />

              {/* Investigator CV */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Principal Investigator's CV
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <DataField
                    label="Educational Qualifications"
                    value={
                      currentProposal.investigatorCV?.educationalQualifications
                    }
                  />
                  <DataField
                    label="Past Experience (Research & Industry)"
                    value={currentProposal.investigatorCV?.pastExperience}
                  />
                  <DataField
                    label="Number of Research Projects Handled"
                    value={
                      currentProposal.investigatorCV?.researchProjectsHandled
                    }
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Proposed Budget
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <BudgetView budget={currentProposal.budget} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI & Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-1/3"
          >
            <div className="space-y-8 sticky top-24">
              {currentProposal.aiEvaluation && (
                <AiChecklist
                  evaluation={currentProposal.aiEvaluation}
                  score={currentProposal.aiScore}
                  summary={currentProposal.aiSummary}
                  recommendations={currentProposal.aiRecommendations}
                />
              )}

              <div>
                <h2 className="text-xl font-semibold mb-4">Review History</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                  {currentProposal.reviewHistory &&
                  currentProposal.reviewHistory.length > 0 ? (
                    <ul className="space-y-4">
                      {currentProposal.reviewHistory.map(
                        (review: any, index: number) => (
                          <li
                            key={index}
                            className="border-b dark:border-gray-700 pb-2 last:border-b-0"
                          >
                            <p className="font-semibold">{review.decision}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {review.comment}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              by {review.reviewerName} on{" "}
                              {new Date(review.timestamp).toLocaleString()}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No reviews have been submitted yet.
                    </p>
                  )}
                </div>
              </div>

              {isReviewer &&
                ["under_review", "revision_requested"].includes(
                  currentProposal.status
                ) && (
                  <ReviewForm
                    proposalId={currentProposal._id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
