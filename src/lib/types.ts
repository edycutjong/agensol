export interface AgentConfig {
  max_spend: string;
  allowed_protocols: string[];
  heartbeat_interval: string;
  system_prompt_hash?: string;
}

export interface AgentData {
  domain: string;
  type: string;
  owner: string;
  status: "active" | "revoked" | "revoking";
  registeredAt: string;
  lastHeartbeat: string;
  config: AgentConfig;
}
