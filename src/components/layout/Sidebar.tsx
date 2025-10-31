"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus, Users, X, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/Logo";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["applicant", "tsc_member", "nacer_admin"],
  },
  {
    href: "/proposal/new",
    icon: FilePlus,
    label: "New Proposal",
    roles: ["applicant"],
  },
  {
    href: "/insights",
    icon: Lightbulb,
    label: "Insights",
    roles: ["applicant", "tsc_member", "nacer_admin"],
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "User Management",
    roles: ["nacer_admin"],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              if (!userRole || !item.roles.includes(userRole)) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-sky-900 dark:text-sky-200"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div
          className="flex-1 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            if (!userRole || !item.roles.includes(userRole)) return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-sky-900 dark:text-sky-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
