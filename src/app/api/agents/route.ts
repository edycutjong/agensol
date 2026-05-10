import { NextRequest, NextResponse } from "next/server";
import { agentStore } from "@/lib/agent-store";
import { snsService } from "@/lib/sns";
import type { AgentData } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ agents: agentStore.getAll() });
}

export async function POST(request: NextRequest) {
  let body: { subdomain?: string; parentDomain?: string; config?: Partial<AgentData["config"]> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { subdomain, parentDomain, config } = body;
  if (!subdomain || !parentDomain) {
    return NextResponse.json(
      { error: "subdomain and parentDomain are required" },
      { status: 400 }
    );
  }

  const domain = `${subdomain}.${parentDomain}`;
  if (agentStore.get(domain)) {
    return NextResponse.json({ error: "Agent already exists" }, { status: 409 });
  }

  await snsService.mintSubdomain(subdomain, parentDomain);

  const agent: AgentData = {
    domain,
    type: "Custom Agent",
    owner: "CurrentWallet",
    status: "active",
    registeredAt: new Date().toISOString(),
    lastHeartbeat: "just now",
    config: {
      max_spend: config?.max_spend ?? "0 USDC",
      allowed_protocols: config?.allowed_protocols ?? [],
      heartbeat_interval: config?.heartbeat_interval ?? "60s",
    },
  };

  agentStore.add(agent);
  return NextResponse.json({ agent }, { status: 201 });
}
