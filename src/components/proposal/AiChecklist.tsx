"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface ChecklistProps {
  evaluation: any;
  score?: number;
  summary?: string;
  recommendations?: string[];
}

export default function AiChecklist({
  evaluation,
  score,
  summary,
  recommendations,
}: ChecklistProps) {
  if (!evaluation) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">AI Evaluation</h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI analysis is not yet complete for this proposal.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">AI Evaluation Checklist</h2>
        {score !== undefined && (
          <div className="text-right">
            <span className="text-sm text-gray-500">Overall Score</span>
            <p className="text-3xl font-bold text-blue-600 dark:text-sky-400">
              {score}%
            </p>
          </div>
        )}
      </div>

      {/* Summary and Recommendations */}
      <div className="mb-6 bg-blue-50 dark:bg-sky-900/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
          AI Summary & Recommendations
        </h3>
        {summary && <p className="text-sm mb-3">{summary}</p>}
        {recommendations && recommendations.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(evaluation).map(([category, items]: [string, any]) => (
          <div key={category}>
            <h3 className="font-semibold text-lg mb-2 border-b pb-1 dark:border-gray-700">
              {category.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <ul className="space-y-3">
              {Object.entries(items).map(
                ([itemName, itemData]: [string, any]) => (
                  <motion.li
                    key={itemName}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-start">
                      {itemData.covered ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                          {itemName.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {itemData.justification}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
