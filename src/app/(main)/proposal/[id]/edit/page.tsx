import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProposalForm from "@/components/proposal/ProposalForm";
import { IProposal } from "@/models/Proposal";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getProposal(id: string): Promise<IProposal | null> {
  const url = `${process.env.NEXTAUTH_URL}/api/proposals/${id}`;
  try {
    // Forward cookies from the incoming request to the API route for authentication
    const cookie = (await headers()).get("Cookie");
    const res = await fetch(url, {
      headers: {
        Cookie: cookie || "",
      },
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

export default async function ProposalEditPage({
  params,
}: {
  params: { id: string };
}) {
  const initialProposal = await getProposal(params.id);

  if (!initialProposal) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <ProposalForm
        initialProposal={JSON.parse(JSON.stringify(initialProposal))}
      />
    </div>
  );
}
