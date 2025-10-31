import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserManagementClient from "@/components/admin/UserManagementClient";
import { IUser } from "@/models/User";

async function getUsers(): Promise<IUser[]> {
  const url = `${process.env.NEXTAUTH_URL}/api/admin/users`;
  try {
    const cookie = (await headers()).get("Cookie");
    const res = await fetch(url, {
      headers: { Cookie: cookie || "" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  // Second layer of protection on the server component itself
  if (session?.user?.role !== "nacer_admin") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        User Management
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Create and manage administrative and reviewer accounts.
      </p>
      <div className="mt-8">
        <UserManagementClient
          initialUsers={JSON.parse(JSON.stringify(users))}
        />
      </div>
    </div>
  );
}
