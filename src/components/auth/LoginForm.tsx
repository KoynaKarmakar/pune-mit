"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/ui/Logo";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setIsSubmitting(false);

    if (result?.error) {
      toast.error("Invalid email or password.");
    } else if (result?.ok) {
      toast.success("Login successful!");
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (searchParams.get("success") === "registration") {
      setSuccessMessage("Registration successful! Please log in.");
      // Optional: remove the query param from URL without reloading
      router.replace("/login", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700"
    >
      <div className="text-center">
        <Logo className="text-3xl justify-center" />
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign in to access your dashboard
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 text-center text-sm text-green-800 bg-green-100 rounded-md dark:bg-green-900/30 dark:text-green-400"
        >
          {successMessage}
        </motion.div>
      )}

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

        {/* Email Input */}
        <div className="relative">
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

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
            placeholder="••••••••"
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
              Signing In...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Login
            </>
          )}
        </motion.button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="font-medium text-blue-600 hover:underline dark:text-sky-400"
        >
          Register here
        </a>
      </p>
    </motion.div>
  );
}
