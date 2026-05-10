import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { agentStore } from "@/lib/agent-store";
import { snsService } from "@/lib/sns";

const BURN_ADDRESS = new PublicKey("11111111111111111111111111111111");

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

  // In production, owner comes from wallet adapter session
  await snsService.revokeIdentity(decoded, BURN_ADDRESS, BURN_ADDRESS);
  agentStore.revoke(decoded);

  return NextResponse.json({ success: true, domain: decoded });
}
