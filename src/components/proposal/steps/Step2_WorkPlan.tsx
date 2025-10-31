"use client";
import { useFormContext } from "react-hook-form";

export const Step2_WorkPlan = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        2. Work Plan & Methodology
      </h2>

      <div>
        <label htmlFor="workPlan" className="block mb-2 text-sm font-medium">
          Work Plan (Max 100 words)
        </label>
        <textarea
          id="workPlan"
          {...register("workPlan")}
          rows={4}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.workPlan && (
          <p className="text-xs text-red-500 mt-1">{`${errors.workPlan.message}`}</p>
        )}
      </div>

      <div>
        <label htmlFor="methodology" className="block mb-2 text-sm font-medium">
          Methodology (Max 200 words)
        </label>
        <textarea
          id="methodology"
          {...register("methodology")}
          rows={6}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.methodology && (
          <p className="text-xs text-red-500 mt-1">{`${errors.methodology.message}`}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="benefitToIndustry"
          className="block mb-2 text-sm font-medium"
        >
          Benefit to Coal Industry
        </label>
        <textarea
          id="benefitToIndustry"
          {...register("benefitToIndustry")}
          rows={5}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.benefitToIndustry && (
          <p className="text-xs text-red-500 mt-1">{`${errors.benefitToIndustry.message}`}</p>
        )}
      </div>
    </div>
  );
};
