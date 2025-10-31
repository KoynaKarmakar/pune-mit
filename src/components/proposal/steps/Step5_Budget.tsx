"use client";
import { useFormContext } from "react-hook-form";

const BudgetInput = ({ name, label }: { name: string; label: string }) => {
  const { register } = useFormContext();
  return (
    <div className="grid grid-cols-2 items-center">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <input
        id={name}
        type="number"
        step="0.01"
        {...register(name, { valueAsNumber: true })}
        placeholder="0.00"
        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
    </div>
  );
};

export const Step5_Budget = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        5. Proposed Budget (in Lakhs)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <h3 className="font-semibold mb-3 border-b pb-2 dark:border-gray-600">
            Capital Expenditure
          </h3>
          <div className="space-y-3">
            <BudgetInput name="budget.capital.equipment" label="Equipment" />
            <BudgetInput
              name="budget.capital.landBuilding"
              label="Land & Building"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 border-b pb-2 dark:border-gray-600">
            Revenue Expenditure
          </h3>
          <div className="space-y-3">
            <BudgetInput
              name="budget.revenue.salaries"
              label="Salaries/Allowances"
            />
            <BudgetInput
              name="budget.revenue.consumables"
              label="Consumables"
            />
            <BudgetInput name="budget.revenue.travel" label="Travel" />
            <BudgetInput
              name="budget.revenue.workshopSeminar"
              label="Workshops/Seminars"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 border-b pb-2 dark:border-gray-600">
            Other Costs
          </h3>
          <div className="space-y-3">
            <BudgetInput name="budget.contingency" label="Contingency" />
            <BudgetInput
              name="budget.institutionalOverhead"
              label="Institutional Overhead"
            />
            <BudgetInput name="budget.taxes" label="Taxes/Duties" />
          </div>
        </div>
      </div>
    </div>
  );
};
