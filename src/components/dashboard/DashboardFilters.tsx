"use client";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

const statusOptions = [
  "all",
  "draft",
  "under_review",
  "revision_requested",
  "approved",
  "rejected",
  "terminated",
];

export default function DashboardFilters({
  searchTerm,
  setSearchTerm,
  status,
  setStatus,
}: FilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      <div className="relative">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="appearance-none cursor-pointer w-full md:w-48 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt} className="capitalize cursor-pointer">
              {opt === "all" ? "All Statuses" : opt.replace("_", " ")}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
