"use client";
import { useFormContext } from "react-hook-form";

const FormField = ({ name, label, description, children, error }: any) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300"
    >
      {label}
    </label>
    {children}
    {description && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    )}
    {error && <p className="mt-1 text-xs text-red-500">{`${error.message}`}</p>}
  </div>
);

export const Step1_ProjectDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        1. Project Core Details
      </h2>

      <FormField
        name="projectTitle"
        label="Project Title"
        error={errors.projectTitle}
      >
        <input
          id="projectTitle"
          {...register("projectTitle")}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>

      <FormField
        name="definitionOfIssue"
        label="Definition of the Issue"
        description="Maximum 300 words."
        error={errors.definitionOfIssue}
      >
        <textarea
          id="definitionOfIssue"
          {...register("definitionOfIssue")}
          rows={6}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>

      <FormField
        name="objectives"
        label="Objectives"
        description="Be specific. List 2-3 main objectives."
        error={errors.objectives}
      >
        <textarea
          id="objectives"
          {...register("objectives")}
          rows={5}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>

      <FormField
        name="justification"
        label="Justification for Subject Area"
        description="Maximum 200 words."
        error={errors.justification}
      >
        <textarea
          id="justification"
          {...register("justification")}
          rows={5}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>
    </div>
  );
};
