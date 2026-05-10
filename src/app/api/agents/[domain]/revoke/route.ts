import { NextResponse } from "next/server";
import { agentStore } from "@/lib/agent-store";
import { snsService } from "@/lib/sns";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const decoded = decodeURIComponent(domain);
  const agent = agentStore.get(decoded);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  if (agent.status === "revoked") {
    return NextResponse.json({ error: "Agent already revoked" }, { status: 409 });
  }

  await snsService.revokeIdentity(decoded);
  agentStore.revoke(decoded);

  return NextResponse.json({ success: true, domain: decoded });
}
