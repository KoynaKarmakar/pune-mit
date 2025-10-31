"use client";
import { useFormContext } from "react-hook-form";

export const Step6_Novelty = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        6. Novelty & R&D Components
      </h2>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Literature / Web Survey
        </label>
        <textarea
          {...register("literatureSurvey")}
          rows={6}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.literatureSurvey && (
          <p className="text-xs text-red-500 mt-1">{`${errors.literatureSurvey.message}`}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          R&D Components (Novelty)
        </label>
        <textarea
          {...register("rdComponents")}
          rows={6}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.rdComponents && (
          <p className="text-xs text-red-500 mt-1">{`${errors.rdComponents.message}`}</p>
        )}
      </div>
    </div>
  );
};
