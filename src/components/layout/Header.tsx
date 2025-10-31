"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon, Menu, ChevronDown } from "lucide-react";
import { clearOfflineData } from "@/lib/db";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await clearOfflineData();
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex-shrink-0">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-gray-500 hover:text-gray-600 cursor-pointer"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1"></div>

      {session?.user && (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
              <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
              {session.user.name}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-50"
              >
                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  );
}
