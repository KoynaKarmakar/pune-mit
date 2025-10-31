"use client";

import { useState } from "react";
import { IUser } from "@/models/User";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

// Modal Component for adding a user
const addUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["nacer_admin", "tsc_member"]),
});
type AddUserFormData = z.infer<typeof addUserSchema>;

const AddUserModal = ({
  isOpen,
  onClose,
  onUserAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: AddUserFormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await axios.post("/api/admin/users", data);
      onUserAdded(); // Refresh user list
      reset(); // Clear form
      onClose(); // Close modal
    } catch (error: any) {
      setApiError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button onClick={onClose} className="cursor-pointer">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields */}
              <div>
                <label>Name</label>
                <input
                  {...register("name")}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label>Role</label>
                <select
                  {...register("role")}
                  className="w-full p-2 cursor-pointer border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="tsc_member cursor-pointer">
                    TSC Member (Reviewer)
                  </option>
                  <option value="nacer_admin cursor-pointer">
                    NaCCER Admin
                  </option>
                </select>
              </div>
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white cursor-pointer p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Client Component
export default function UserManagementClient({
  initialUsers,
}: {
  initialUsers: IUser[];
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserAdded = () => {
    router.refresh(); // Re-fetches data from the server and re-renders the page
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm">
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {initialUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "nacer_admin"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
