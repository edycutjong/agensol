"use client";

import { useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { snsService } from "@/lib/sns";
import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { AgentTerminal } from "@/components/AgentTerminal";
import { MetricsPanel } from "@/components/MetricsPanel";
import { AgentCard } from "@/components/AgentCard";
import type { AgentData } from "@/components/AgentCard";
import { KillSwitch } from "@/components/KillSwitch";
import { ScrambleText } from "@/components/ScrambleText";

const SEED_AGENTS: AgentData[] = [
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

type View = "registry" | "register" | "terminal" | "admin";

const NAV_ITEMS: { key: View; label: string; icon: string }[] = [
  { key: "registry", label: "Registry", icon: "◆" },
  { key: "register", label: "Mint", icon: "+" },
  { key: "terminal", label: "Agent", icon: "▶" },
  { key: "admin", label: "Kill Switch", icon: "⚠" },
];

export default function AgensolDashboard() {
  const [view, setView] = useState<View>("registry");
  const [agents, setAgents] = useState<AgentData[]>(SEED_AGENTS);
  const [newSubdomain, setNewSubdomain] = useState("");
  const [parentDomain, setParentDomain] = useState("dao.sol");
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [triggerRevoke, setTriggerRevoke] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const revokedCount = agents.filter((a) => a.status === "revoked").length;

  const handleMint = async () => {
    if (!newSubdomain) return;
    setIsMinting(true);
    const pk = new PublicKey("11111111111111111111111111111111");
    await snsService.mintSubdomain(newSubdomain, parentDomain, pk, pk);

    const newAgent: AgentData = {
      domain: `${newSubdomain}.${parentDomain}`,
      type: "Custom Agent",
      owner: "CurrentWallet",
      status: "active",
      registeredAt: new Date().toISOString(),
      lastHeartbeat: "just now",
      config: {
        max_spend: "0 USDC",
        allowed_protocols: [],
        heartbeat_interval: "60s",
      },
    };
    setAgents((prev) => [newAgent, ...prev]);
    setIsMinting(false);
    setMintSuccess(true);
    setTimeout(() => {
      setMintSuccess(false);
      setView("registry");
      setNewSubdomain("");
    }, 2000);
  };

  const handleRevoke = async (domain: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.domain === domain ? { ...a, status: "revoking" as const } : a))
    );

    if (domain === "treasury.dao.sol") {
      setTriggerRevoke(true);
    }

    const pk = new PublicKey("11111111111111111111111111111111");
    await snsService.revokeIdentity(domain, pk, pk);

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.domain === domain ? { ...a, status: "revoked" as const, owner: "Burn1111...1111", lastHeartbeat: "REVOKED" } : a
        )
      );
    }, 2000);
  };

  const handleRevokeComplete = useCallback(() => {
    // Terminal revoke animation finished
  }, []);

  return (
    <div className="min-h-screen flex flex-col grid-bg scanline relative">
      <ParticleField />
      <StatusBar />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero Header */}
        <header className="px-6 pt-8 pb-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center neon-glow">
                  <span className="text-brand-primary font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    <span className="text-brand-primary neon-text">
                      <ScrambleText text="Agen" delay={200} />
                    </span>
                    <ScrambleText text="sol" delay={400} />
                  </h1>
                  <p className="text-[11px] font-mono text-brand-muted tracking-wider">
                    AI AGENT IDENTITY REGISTRY ON SNS
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-1 bg-brand-surface/50 p-1 rounded-xl border border-brand-border/50">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                    view === item.key
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 neon-border"
                      : "text-brand-muted hover:text-white hover:bg-brand-surface"
                  }`}
                >
                  <span className={view === item.key ? "text-brand-primary" : "text-brand-muted/50"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Metrics */}
        <div className="px-6 pb-6 max-w-7xl mx-auto w-full">
          <MetricsPanel activeCount={activeCount} revokedCount={revokedCount} totalCount={agents.length} />
        </div>

        {/* Main Content */}
        <main className="px-6 pb-12 max-w-7xl mx-auto w-full flex-1">
          {/* ── REGISTRY VIEW ── */}
          {view === "registry" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-mono flex items-center gap-2">
                  <span className="text-brand-primary">◆</span> Verified Agent Directory
                </h2>
                <span className="text-[10px] font-mono text-brand-muted">
                  {agents.length} registered • {activeCount} active
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent, i) => (
                  <AgentCard key={agent.domain} agent={agent} index={i} onSelect={setSelectedAgent} />
                ))}
              </div>
            </div>
          )}

          {/* ── REGISTER VIEW ── */}
          {view === "register" && (
            <div className="max-w-2xl mx-auto animate-fade-in-scale">
              <div className="glass-panel-strong rounded-2xl p-8 space-y-6">
                <div className="text-center pb-6 border-b border-brand-border/50">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-4 neon-glow">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 font-mono">
                    <ScrambleText text="Mint Agent Identity" delay={100} />
                  </h2>
                  <p className="text-brand-muted text-sm max-w-md mx-auto">
                    Register a new AI agent sub-domain on SNS. The minted .sol passport becomes the agent&apos;s verifiable on-chain identity.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-brand-muted tracking-widest mb-2">
                      AGENT SUB-DOMAIN
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newSubdomain}
                        onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        className="grow bg-black/40 border border-brand-border rounded-l-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-brand-primary focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all placeholder:text-brand-muted/30"
                        placeholder="e.g. trading-bot"
                      />
                      <select
                        value={parentDomain}
                        onChange={(e) => setParentDomain(e.target.value)}
                        className="bg-brand-surface border border-l-0 border-brand-border rounded-r-lg p-3 text-brand-primary font-mono text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="dao.sol">.dao.sol</option>
                        <option value="agency.sol">.agency.sol</option>
                        <option value="trading.sol">.trading.sol</option>
                      </select>
                    </div>
                    {newSubdomain && (
                      <div className="mt-2 text-[11px] font-mono text-brand-primary/60 animate-slide-down">
                        Preview: <span className="text-brand-primary font-bold">{newSubdomain}.{parentDomain}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-brand-muted tracking-widest mb-2">
                      INITIAL PROFILE RECORD
                    </label>
                    <textarea
                      className="w-full h-32 bg-black/40 border border-brand-border rounded-lg p-3 text-brand-primary/80 font-mono text-xs focus:outline-none focus:border-brand-primary transition-all resize-none"
                      defaultValue={JSON.stringify({ max_spend: "0 SOL", allowed_protocols: [], heartbeat_interval: "60s" }, null, 2)}
                    />
                  </div>

                  <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl text-sm text-brand-muted flex items-start gap-3">
                    <span className="text-brand-primary text-lg shrink-0">ℹ</span>
                    <div className="space-y-1">
                      <p className="text-brand-primary/80 font-medium text-xs">SNS Sub-Domain Minting</p>
                      <p className="text-[11px]">The sub-domain is minted as a tokenized asset. The agent resolves its own identity via <code className="text-brand-primary bg-brand-primary/10 px-1 rounded">getDomainKeySync()</code> before executing any action.</p>
                    </div>
                  </div>

                  {mintSuccess ? (
                    <div className="w-full py-3 rounded-xl font-bold font-mono text-sm text-center bg-status-success/10 text-status-success border border-status-success/30 neon-green animate-fade-in-scale">
                      ✓ MINTED SUCCESSFULLY
                    </div>
                  ) : (
                    <button
                      onClick={handleMint}
                      disabled={isMinting || !newSubdomain}
                      className={`w-full py-3 rounded-xl font-bold font-mono text-sm transition-all duration-300 btn-lift ${
                        isMinting || !newSubdomain
                          ? "bg-brand-surface text-brand-muted cursor-not-allowed border border-brand-border"
                          : "bg-brand-primary text-black hover:bg-brand-primary-light neon-glow"
                      }`}
                    >
                      {isMinting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
                          </svg>
                          MINTING {newSubdomain}.{parentDomain}...
                        </span>
                      ) : (
                        `MINT ${newSubdomain || "..."}.${parentDomain}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TERMINAL VIEW ── */}
          {view === "terminal" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-mono flex items-center gap-2">
                  <span className="text-brand-primary">▶</span> Live Agent Terminal
                </h2>
                <span className="text-[10px] font-mono text-brand-muted">
                  treasury.dao.sol • Self-Resolution Demo
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <AgentTerminal triggerRevoke={triggerRevoke} onRevokeComplete={handleRevokeComplete} />
                </div>

                <div className="space-y-4">
                  <div className="glass-panel rounded-xl p-5 space-y-4 animate-fade-in-up delay-200">
                    <h3 className="text-sm font-bold font-mono flex items-center gap-2">
                      <span className="text-brand-accent">⬡</span> SNS SDK Integration
                    </h3>
                    <div className="space-y-3">
                      {[
                        { feature: "Resolution", desc: "Agent resolves own .sol before every action", used: true },
                        { feature: "Sub-domains", desc: "bot.alice.sol hierarchical namespace", used: true },
                        { feature: "Profile Records", desc: "JSON config: spend limits, protocols, hash", used: true },
                        { feature: "Registration", desc: "Programmatic sub-domain minting", used: true },
                        { feature: "Transfer", desc: "Domain transfer = kill switch", used: true },
                      ].map((f) => (
                        <div key={f.feature} className="flex items-start gap-3 text-xs font-mono">
                          <span className={`mt-0.5 ${f.used ? "text-status-success" : "text-brand-muted/30"}`}>
                            {f.used ? "✓" : "○"}
                          </span>
                          <div>
                            <span className="text-white font-semibold">{f.feature}</span>
                            <p className="text-brand-muted text-[10px] mt-0.5">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel rounded-xl p-5 space-y-3 animate-fade-in-up delay-300">
                    <h3 className="text-sm font-bold font-mono flex items-center gap-2">
                      <span className="text-status-error">⚠</span> Kill Switch Demo
                    </h3>
                    <p className="text-[11px] text-brand-muted">
                      Transfer the sub-domain to a burn address. The agent detects the identity change and shuts down immediately.
                    </p>
                    {!triggerRevoke ? (
                      <button
                        onClick={() => {
                          setTriggerRevoke(true);
                          handleRevoke("treasury.dao.sol");
                        }}
                        className="w-full py-2.5 rounded-lg font-bold font-mono text-xs bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error hover:text-white transition-all duration-300 btn-lift hover:neon-red"
                      >
                        ⚠ REVOKE treasury.dao.sol
                      </button>
                    ) : (
                      <div className="text-center py-2 text-[11px] font-mono text-status-error animate-pulse">
                        Kill switch activated — watch the terminal ←
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN VIEW ── */}
          {view === "admin" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-lg font-bold font-mono flex items-center gap-2 mb-2">
                  <span className="text-status-error">⚠</span> Emergency Kill Switches
                </h2>
                <p className="text-sm text-brand-muted max-w-2xl">
                  Instantly revoke any agent&apos;s identity by transferring the sub-domain to a burn address. Protocols relying on SNS resolution will immediately reject the agent.
                </p>
              </div>

              <div className="glass-panel rounded-xl overflow-hidden border-status-error/20">
                <div className="px-6 py-3 bg-status-error/5 border-b border-status-error/10">
                  <span className="text-[10px] font-mono text-status-error/60 tracking-widest font-bold">
                    AGENT REVOCATION PANEL
                  </span>
                </div>
                <div className="divide-y divide-brand-border/30">
                  {agents.map((agent) => (
                    <div key={agent.domain} className={`px-6 py-4 flex items-center justify-between ${agent.status === "revoked" ? "opacity-40" : "hover:bg-brand-surface/30"} transition-colors`}>
                      <div className="flex items-center gap-4">
                        <span className={`status-pill status-${agent.status}`}>{agent.status}</span>
                        <div>
                          <span className="font-mono text-sm text-white font-bold">{agent.domain}</span>
                          <p className="text-[10px] font-mono text-brand-muted">{agent.type} • Owner: {agent.owner}</p>
                        </div>
                      </div>
                      <KillSwitch
                        domain={agent.domain}
                        isActive={agent.status === "active"}
                        isRevoking={agent.status === "revoking"}
                        onRevoke={() => handleRevoke(agent.domain)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative glass-panel-strong rounded-2xl p-6 max-w-lg w-full animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedAgent(null)} className="absolute top-4 right-4 text-brand-muted hover:text-white text-lg">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold font-mono text-lg">{selectedAgent.domain}</h3>
                <p className="text-xs text-brand-muted font-mono">{selectedAgent.type}</p>
              </div>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-brand-border/30">
                <span className="text-brand-muted">Status</span>
                <span className={`status-pill status-${selectedAgent.status}`}>{selectedAgent.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-border/30">
                <span className="text-brand-muted">Owner</span>
                <span className="text-white">{selectedAgent.owner}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-border/30">
                <span className="text-brand-muted">Registered</span>
                <span className="text-white">{new Date(selectedAgent.registeredAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-black/40 border border-brand-border/30 rounded-xl">
              <div className="text-[9px] text-brand-muted/50 tracking-widest mb-2">PROFILE RECORD</div>
              <pre className="text-[11px] font-mono text-brand-primary/80 overflow-x-auto">{JSON.stringify(selectedAgent.config, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
