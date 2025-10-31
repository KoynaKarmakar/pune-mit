"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { IProposal } from "@/models/Proposal";

const reviewSchema = z.object({
  decision: z.enum(["Approved", "Rejected", "Revision Requested"]),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters." }),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  proposalId: string;
  onReviewSubmitted: (updatedProposal: IProposal) => void;
}

export default function ReviewForm({
  proposalId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        reviewerName: session?.user?.name,
      };
      const response = await axios.post(
        `/api/proposals/${proposalId}/review`,
        payload
      );
      onReviewSubmitted(response.data);
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="decision" className="block text-sm font-medium mb-1">
            Decision
          </label>
          <select
            id="decision"
            {...register("decision")}
            className="w-full p-2 border rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
          >
            <option className="cursor-pointer">Approved</option>
            <option className="cursor-pointer">Rejected</option>
            <option className="cursor-pointer">Revision Requested</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comments
          </label>
          <textarea
            id="comment"
            {...register("comment")}
            rows={4}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
          {errors.comment && (
            <p className="text-xs text-red-500 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-semibold cursor-pointer text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
