"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IProposal } from "@/models/Proposal";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Cloud,
  CloudOff,
  LoaderCircle,
  Send,
  ArrowLeft,
} from "lucide-react";

// Import all step components
import { Step1_ProjectDetails } from "./steps/Step1_ProjectDetails";
import { Step2_WorkPlan } from "./steps/Step2_WorkPlan";
import { Step3_Timeline } from "./steps/Step3_Timeline";
import { Step4_InvestigatorCV } from "./steps/Step4_InvestigatorCV";
import { Step5_Budget } from "./steps/Step5_Budget";
import { Step6_Novelty } from "./steps/Step6_Novelty";

// --- Comprehensive Zod Schema ---
const proposalSchema = z
  .object({
    _id: z.string(),
    projectTitle: z.string().min(5, "Project title is required."),
    definitionOfIssue: z.string().min(20, "Definition of issue is required."),
    objectives: z.string().min(20, "Objectives are required."),
    justification: z.string().min(10, "Justification is required."),
    workPlan: z.string().min(10, "Work plan is required."),
    methodology: z.string().min(20, "Methodology is required."),
    benefitToIndustry: z.string().min(10, "Benefit to industry is required."),
    literatureSurvey: z.string().min(20, "Literature survey is required."),
    rdComponents: z.string().min(20, "R&D/Novelty components are required."),
  })
  .passthrough();

const steps = [
  { id: 1, name: "Project Details", component: Step1_ProjectDetails },
  { id: 2, name: "Work Plan", component: Step2_WorkPlan },
  { id: 3, name: "Timeline", component: Step3_Timeline },
  { id: 4, name: "Investigator CV", component: Step4_InvestigatorCV },
  { id: 5, name: "Budget", component: Step5_Budget },
  { id: 6, name: "Novelty & R&D", component: Step6_Novelty },
];

export default function ProposalForm({
  initialProposal,
}: {
  initialProposal: IProposal;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "saving" | "offline" | "error"
  >("synced");

  const offlineProposal = useLiveQuery(
    () => db.proposals.get(initialProposal._id),
    [initialProposal._id]
  );

  const methods = useForm<IProposal>({
    resolver: zodResolver(proposalSchema),
    defaultValues: useMemo(() => initialProposal, [initialProposal]),
  });

  const watchedData = methods.watch();
  const [debouncedData] = useDebounce(watchedData, 1500); // Auto-save after 1.5 seconds of inactivity

  useEffect(() => {
    if (
      offlineProposal &&
      new Date(offlineProposal.updatedAt) > new Date(initialProposal.updatedAt)
    ) {
      methods.reset(offlineProposal);
    } else {
      methods.reset(initialProposal);
    }
  }, [offlineProposal, initialProposal, methods]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      setIsOnline(navigator.onLine);
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const autoSaveData = async () => {
      if (debouncedData?._id && methods.formState.isDirty) {
        setSyncStatus("saving");
        const dataToSave = {
          ...debouncedData,
          updatedAt: new Date().toISOString(),
        };
        await db.proposals.put(dataToSave);

        if (isOnline) {
          try {
            await axios.put(`/api/proposals/${debouncedData._id}`, dataToSave);
            setSyncStatus("synced");
          } catch (error) {
            console.error("Auto-sync failed, but data is safe offline.", error);
            setSyncStatus("offline");
          }
        } else {
          setSyncStatus("offline");
        }
      }
    };
    autoSaveData();
  }, [debouncedData, isOnline, methods.formState.isDirty]);

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    } else if (!isValid) {
      toast.error("Please fill in all required fields for this step.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleManualSave = async () => {
    const toastId = toast.loading("Saving draft...");
    setSyncStatus("saving");
    const dataToSave = {
      ...methods.getValues(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await db.proposals.put(dataToSave);
      if (navigator.onLine) {
        await axios.put(`/api/proposals/${dataToSave._id}`, dataToSave);
        toast.success("Draft saved and synced!", { id: toastId });
      } else {
        toast.success("Draft saved offline.", { id: toastId });
      }
      setSyncStatus(navigator.onLine ? "synced" : "offline");
    } catch (error) {
      toast.error("Failed to save draft.", { id: toastId });
      setSyncStatus("error");
    }
  };

  const onSubmitForReview = async () => {
    setSyncStatus("saving");
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error(
        "Please review all steps and fill in the required fields before submitting."
      );
      setSyncStatus("error");
      return;
    }
    if (!isOnline) {
      toast.error("You must be online to submit a proposal for review.");
      setSyncStatus("offline");
      return;
    }

    try {
      const data = methods.getValues();
      await axios.put(`/api/proposals/${data._id}`, {
        ...data,
        submitForReview: true,
      });
      await db.proposals.delete(data._id as string);
      toast.success("Proposal submitted successfully!");
      router.push("/dashboard?status=submitted");
    } catch (error) {
      console.error("Failed to submit for review", error);
      toast.error("Failed to submit proposal.");
      setSyncStatus("error");
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center cursor-pointer gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 p-2 mb-4 text-sm bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300">
              {syncStatus === "saving" && (
                <>
                  <LoaderCircle
                    className="animate-spin text-blue-500"
                    size={16}
                  />
                  <span>Saving...</span>
                </>
              )}
              {syncStatus === "synced" && (
                <>
                  <Cloud className="text-green-500" size={16} />
                  <span>Saved & Synced</span>
                </>
              )}
              {syncStatus === "offline" && (
                <>
                  <CloudOff className="text-yellow-500" size={16} />
                  <span>Saved Offline</span>
                </>
              )}
              {syncStatus === "error" && (
                <span className="text-red-500">Error Saving</span>
              )}
            </div>
            <nav className="space-y-1">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left p-3 cursor-pointer rounded-md transition-colors ${
                    currentStep === index
                      ? "bg-blue-100 dark:bg-sky-900 text-blue-700 dark:text-sky-200 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </nav>
            <button
              onClick={handleManualSave}
              className="w-full mt-4 flex cursor-pointer items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
            >
              <Save size={16} /> Save Draft
            </button>
          </div>
        </aside>
        <main className="w-full md:w-3/4 bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 pt-5 border-t dark:border-gray-700 flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={onSubmitForReview}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
              >
                <Send size={16} /> Submit for Review
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600"
              >
                Next Step
              </button>
            )}
          </div>
        </main>
      </div>
    </FormProvider>
  );
}
