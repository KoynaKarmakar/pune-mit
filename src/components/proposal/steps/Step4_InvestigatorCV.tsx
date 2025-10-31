"use client";
import { useFormContext } from "react-hook-form";

export const Step4_InvestigatorCV = () => {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        4. Investigator's CV
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Provide details for the Principal Investigator.
      </p>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Educational Qualifications
        </label>
        <textarea
          {...register("investigatorCV.educationalQualifications")}
          rows={4}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Past Experience (Research & Industry)
        </label>
        <textarea
          {...register("investigatorCV.pastExperience")}
          rows={5}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Number of Research Projects Handled
        </label>
        <textarea
          {...register("investigatorCV.researchProjectsHandled")}
          rows={3}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  );
};
