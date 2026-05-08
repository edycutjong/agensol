"use client";

import { useState } from "react";

export interface AgentData {
  domain: string;
  type: string;
  owner: string;
  status: "active" | "revoked" | "revoking";
  registeredAt: string;
  lastHeartbeat: string;
  config: {
    max_spend: string;
    allowed_protocols: string[];
    heartbeat_interval: string;
    system_prompt_hash?: string;
  };
}

interface AgentCardProps {
  agent: AgentData;
  index: number;
  onSelect?: (agent: AgentData) => void;
}

export function AgentCard({ agent, index, onSelect }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRevoked = agent.status === "revoked";
  const isRevoking = agent.status === "revoking";
  const icons: Record<string, string> = {
    "DeFi Executor": "⚡", "Market Maker": "📊", "Arbitrage": "🔄",
    "Oracle": "🔮", "Sweeper": "🧹", "Monitor": "👁️", "Relayer": "🔗",
  };

  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden transition-all duration-500 group animate-fade-in-up cursor-pointer ${isRevoked ? "opacity-40 grayscale" : "hover:neon-border"} ${isRevoking ? "animate-revoke-flash" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onSelect?.(agent)}
    >
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{icons[agent.type] || "🤖"}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm font-mono text-white truncate">{agent.domain}</h3>
              <p className="text-[10px] text-brand-muted font-mono">{agent.type}</p>
            </div>
          </div>
          <span className={`status-pill shrink-0 status-${agent.status}`}>{agent.status}</span>
        </div>
        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex justify-between"><span className="text-brand-muted">Owner</span><span className="text-white/70 truncate ml-4 max-w-[140px]">{agent.owner}</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Max Spend</span><span className="text-brand-primary font-semibold">{agent.config.max_spend}</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Heartbeat</span><span className="text-white/70">{agent.config.heartbeat_interval}</span></div>
        </div>
      </div>
      <div className="px-5">
        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="w-full py-2 border-t border-brand-border text-[10px] font-mono text-brand-muted hover:text-brand-primary transition-colors flex items-center justify-center gap-1">
          {isExpanded ? "▲ HIDE" : "▼ SHOW"} PROFILE RECORD
        </button>
      </div>
      {isExpanded && (
        <div className="px-5 pb-4 animate-slide-down">
          <div className="bg-black/40 border border-brand-border/50 rounded-lg p-3 mt-1">
            <div className="text-[9px] text-brand-muted/50 mb-2 font-mono tracking-widest">SNS PROFILE RECORD</div>
            <pre className="text-[10px] font-mono text-brand-primary/80 overflow-x-auto whitespace-pre leading-relaxed">{JSON.stringify(agent.config, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
