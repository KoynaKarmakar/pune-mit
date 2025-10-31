import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IProposal } from "@/models/Proposal";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProposalDetailView from "@/components/proposal/ProposalDetailView";

async function getProposal(id: string): Promise<IProposal | null> {
  const url = `${process.env.NEXTAUTH_URL}/api/proposals/${id}`;
  try {
    const cookie = (await headers()).get("Cookie");
    const res = await fetch(url, {
      headers: { Cookie: cookie || "" },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch proposal: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error in getProposal:", error);
    return null;
  }
}

export default async function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const proposal = await getProposal(params.id);

  if (!proposal) {
    notFound();
  }

  const userRole = session?.user?.role || "applicant";
  const isReviewer = ["nacer_admin", "tsc_member"].includes(userRole);

  return (
    <ProposalDetailView
      proposal={JSON.parse(JSON.stringify(proposal))}
      isReviewer={isReviewer}
    />
  );
}
