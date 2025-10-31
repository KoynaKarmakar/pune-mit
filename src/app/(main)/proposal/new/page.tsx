"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function NewProposalPage() {
  const router = useRouter();

  useEffect(() => {
    const createDraft = async () => {
      try {
        const response = await axios.post("/api/proposals");
        const newProposal = response.data;
        router.replace(`/proposal/${newProposal._id}/edit`);
      } catch (error) {
        console.error("Failed to create new proposal draft", error);
        router.push("/dashboard?error=creation-failed");
      }
    };

    createDraft();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <LoaderCircle className="w-12 h-12 animate-spin text-blue-600 dark:text-sky-400" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Creating a new proposal draft...
      </p>
    </div>
  );
}
