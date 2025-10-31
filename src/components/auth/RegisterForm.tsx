"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, LoaderCircle } from "lucide-react";
import axios, { AxiosError } from "axios";

// 1. Define the validation schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/register", data);

      if (response.status === 201) {
        // Redirect to login page with a success message
        router.push("/login?success=registration");
      }
    } catch (e) {
      const axiosError = e as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Join Sanshoधनम् to get started
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...form.register("name")}
            className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
            placeholder="you@example.com"
            disabled={isSubmitting}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
            placeholder="Minimum 8 characters"
            disabled={isSubmitting}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" size={20} />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Register
            </>
          )}
        </motion.button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:underline dark:text-sky-400"
        >
          Sign in
        </a>
      </p>
    </motion.div>
  );
}
