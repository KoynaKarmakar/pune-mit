import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { IProposal } from "@/models/Proposal";
import { headers } from "next/headers";
import axios from "axios"; // 1. Import axios

async function getProposals(): Promise<IProposal[]> {
  const url = `${process.env.NEXTAUTH_URL}/api/proposals/search`;

  try {
    const cookie = (await headers()).get("Cookie");
    const response = await axios.get(url, {
      headers: {
        Cookie: cookie || "", // 3. Forward the cookies in the axios config
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to fetch proposals with axios:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error fetching proposals:", error);
    }
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const initialProposals = await getProposals();

  return (
    <DashboardClient
      initialProposals={initialProposals}
      userRole={session?.user?.role || "applicant"}
    />
  );
}
