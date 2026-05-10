import type { AgentData } from "./types";

export type { AgentData };

const SEED: AgentData[] = [
  {
    domain: "treasury.dao.sol",
    type: "DeFi Executor",
    owner: "7X8mRjk...dFaB",
    status: "active",
    registeredAt: "2026-05-06T09:00:00Z",
    lastHeartbeat: "12s ago",
    config: {
      max_spend: "1,000 USDC",
      allowed_protocols: ["Jupiter", "Meteora"],
      heartbeat_interval: "5m",
      system_prompt_hash: "a3f8c2...e91d",
    },
  },
  {
    domain: "sniper.trading.sol",
    type: "Market Maker",
    owner: "4R9kPx...xZ2L",
    status: "active",
    registeredAt: "2026-05-06T10:30:00Z",
    lastHeartbeat: "3s ago",
    config: {
      max_spend: "50 SOL",
      allowed_protocols: ["Raydium", "Orca"],
      heartbeat_interval: "1m",
      system_prompt_hash: "b7d1e4...f23a",
    },
  },
  {
    domain: "oracle.feeds.sol",
    type: "Oracle",
    owner: "8M2nQv...pK7R",
    status: "active",
    registeredAt: "2026-05-07T14:15:00Z",
    lastHeartbeat: "1s ago",
    config: {
      max_spend: "0 SOL",
      allowed_protocols: ["Pyth", "Switchboard"],
      heartbeat_interval: "10s",
      system_prompt_hash: "c9e3f6...d45b",
    },
  },
  {
    domain: "sweep.cleanup.sol",
    type: "Sweeper",
    owner: "5T3jAm...vN4W",
    status: "active",
    registeredAt: "2026-05-07T16:00:00Z",
    lastHeartbeat: "45s ago",
    config: {
      max_spend: "100 USDC",
      allowed_protocols: ["Jupiter"],
      heartbeat_interval: "30m",
    },
  },
  {
    domain: "arbitrage.bot.sol",
    type: "Arbitrage",
    owner: "Burn1111...1111",
    status: "revoked",
    registeredAt: "2026-05-05T08:00:00Z",
    lastHeartbeat: "REVOKED",
    config: {
      max_spend: "10,000 USDC",
      allowed_protocols: ["All"],
      heartbeat_interval: "10s",
      system_prompt_hash: "REVOKED",
    },
  },
];

let agents: AgentData[] = SEED.map((a) => ({ ...a }));

export const agentStore = {
  getAll: (): AgentData[] => agents.map((a) => ({ ...a })),

  get: (domain: string): AgentData | undefined =>
    agents.find((a) => a.domain === domain),

  add: (agent: AgentData): void => {
    agents = [{ ...agent }, ...agents];
  },

  revoke: (domain: string): boolean => {
    const agent = agents.find((a) => a.domain === domain);
    if (!agent || agent.status === "revoked") return false;
    agent.status = "revoked";
    agent.owner = "Burn1111...1111";
    agent.lastHeartbeat = "REVOKED";
    return true;
  },

  reset: (): void => {
    agents = SEED.map((a) => ({ ...a }));
  },
};
