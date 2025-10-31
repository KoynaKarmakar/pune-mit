"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";

export const Step3_Timeline = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeline",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        3. Project Timeline & Milestones
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <input
              {...register(`timeline.${index}.activity`)}
              placeholder="Activity / Milestone"
              className="md:col-span-3 w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
            />
            <input
              type="date"
              {...register(`timeline.${index}.startDate`)}
              className="md:col-span-2 w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
            />
            <input
              type="date"
              {...register(`timeline.${index}.endDate`)}
              className="md:col-span-1 w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="flex items-center cursor-pointer justify-center text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ activity: "", startDate: "", endDate: "" })}
        className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <PlusCircle size={18} /> Add Milestone
      </button>
    </div>
  );
};
