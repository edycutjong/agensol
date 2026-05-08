"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TerminalLine {
  text: string;
  type: "info" | "success" | "error" | "warning" | "system" | "input";
  ts: string;
}

const BOOT_SEQUENCE: Omit<TerminalLine, "ts">[] = [
  { text: "Initializing Agensol Agent Runtime v1.0.0...", type: "system" },
  { text: "Connecting to Solana Devnet RPC...", type: "info" },
  { text: "RPC handshake complete (latency: 12ms)", type: "success" },
  { text: "Loading SNS SDK @bonfida/spl-name-service...", type: "info" },
  { text: "SDK loaded. Modules: [resolve, subdomain, profile, transfer]", type: "success" },
  { text: "──────────────────────────────────────", type: "system" },
  { text: "AGENT SELF-RESOLUTION SEQUENCE", type: "system" },
  { text: "──────────────────────────────────────", type: "system" },
  { text: "Resolving identity: treasury.dao.sol", type: "info" },
  { text: "→ getDomainKeySync('treasury.dao.sol')", type: "input" },
  { text: "→ PublicKey: 7X8mR...dFaB", type: "success" },
  { text: "→ Profile Record found (286 bytes)", type: "success" },
  { text: "Parsing Profile Record JSON...", type: "info" },
  { text: '  ├── max_spend: "1000 USDC"', type: "info" },
  { text: '  ├── allowed_protocols: ["Jupiter", "Meteora"]', type: "info" },
  { text: '  ├── heartbeat_interval: "5m"', type: "info" },
  { text: '  └── status: "active"', type: "info" },
  { text: "✓ Identity VERIFIED — Agent authorized to execute", type: "success" },
  { text: "──────────────────────────────────────", type: "system" },
  { text: "Entering main loop... monitoring SOL/USDC", type: "info" },
  { text: "[HEARTBEAT] Price: $168.42 | Spread: 0.03%", type: "success" },
  { text: "[HEARTBEAT] Price: $168.39 | Spread: 0.02%", type: "success" },
  { text: "[HEARTBEAT] Price: $168.44 | Spread: 0.04%", type: "success" },
];

const REVOKE_SEQUENCE: Omit<TerminalLine, "ts">[] = [
  { text: "──────────────────────────────────────", type: "system" },
  { text: "⚠ IDENTITY CHANGE DETECTED", type: "warning" },
  { text: "──────────────────────────────────────", type: "system" },
  { text: "Re-resolving: treasury.dao.sol...", type: "info" },
  { text: "→ getDomainKeySync('treasury.dao.sol')", type: "input" },
  { text: "→ Owner changed: 7X8mR...dFaB → Burn1111...1111", type: "error" },
  { text: '→ Profile Record status: "revoked"', type: "error" },
  { text: "✗ Identity REVOKED — Kill switch activated", type: "error" },
  { text: "Halting all pending transactions...", type: "error" },
  { text: "Closing RPC connection...", type: "error" },
  { text: "Agent shutdown complete. Goodbye.", type: "error" },
  { text: "──────────────────────────────────────", type: "system" },
  { text: "Process exited with code 0 (REVOKED)", type: "system" },
];

interface AgentTerminalProps {
  triggerRevoke?: boolean;
  onRevokeComplete?: () => void;
}

export function AgentTerminal({ triggerRevoke = false, onRevokeComplete }: AgentTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [isRevoked, setIsRevoked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootIndexRef = useRef(0);
  const revokeTriggeredRef = useRef(false);

  const getTimestamp = useCallback(() => {
    return new Date().toISOString().split("T")[1].split(".")[0];
  }, []);

  // Boot sequence
  useEffect(() => {
    if (!isBooting || isRevoked) return;

    const interval = setInterval(() => {
      if (bootIndexRef.current < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[bootIndexRef.current];
        setLines((prev) => [...prev, { ...line, ts: getTimestamp() }]);
        bootIndexRef.current++;
      } else {
        setIsBooting(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isBooting, isRevoked, getTimestamp]);

  // Heartbeat when running
  useEffect(() => {
    if (isBooting || isRevoked) return;

    const interval = setInterval(() => {
      const price = (168 + Math.random() * 0.5).toFixed(2);
      const spread = (Math.random() * 0.05).toFixed(2);
      setLines((prev) => [
        ...prev,
        {
          text: `[HEARTBEAT] Price: $${price} | Spread: ${spread}%`,
          type: "success" as const,
          ts: getTimestamp(),
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isBooting, isRevoked, getTimestamp]);

  // Revoke sequence
  useEffect(() => {
    if (!triggerRevoke || revokeTriggeredRef.current || isBooting) return;
    revokeTriggeredRef.current = true;

    let i = 0;
    const interval = setInterval(() => {
      if (i < REVOKE_SEQUENCE.length) {
        const line = REVOKE_SEQUENCE[i];
        setLines((prev) => [...prev, { ...line, ts: getTimestamp() }]);
        i++;
      } else {
        setIsRevoked(true);
        onRevokeComplete?.();
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [triggerRevoke, isBooting, getTimestamp, onRevokeComplete]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const colorMap: Record<string, string> = {
    info: "text-brand-primary/80",
    success: "text-status-success",
    error: "text-status-error",
    warning: "text-status-warning",
    system: "text-brand-muted/60",
    input: "text-brand-accent",
  };

  return (
    <div className="terminal rounded-xl overflow-hidden animate-fade-in-scale">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-brand-primary/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className={`w-3 h-3 rounded-full ${isRevoked ? 'bg-status-error' : 'bg-status-success'}`} />
            <div className="w-3 h-3 rounded-full bg-status-warning" />
            <div className="w-3 h-3 rounded-full bg-brand-surface-2" />
          </div>
          <span className="text-brand-muted text-[10px] ml-2">
            agensol-agent@devnet:~
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isRevoked && !isBooting && (
            <span className="flex items-center gap-1 text-[10px] text-status-success">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              RUNNING
            </span>
          )}
          {isRevoked && (
            <span className="flex items-center gap-1 text-[10px] text-status-error font-bold tracking-wider">
              TERMINATED
            </span>
          )}
          {isBooting && (
            <span className="flex items-center gap-1 text-[10px] text-status-warning animate-pulse">
              BOOTING...
            </span>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-4 h-80 overflow-y-auto"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`terminal-line flex gap-3 ${colorMap[line.type]}`}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <span className="text-brand-muted/30 select-none shrink-0 w-16 text-right">
              {line.ts}
            </span>
            <span className="whitespace-pre-wrap break-all">{line.text}</span>
          </div>
        ))}
        {!isRevoked && (
          <div className="flex gap-3 mt-1">
            <span className="text-brand-muted/30 w-16 text-right shrink-0">&nbsp;</span>
            <span className="text-brand-primary animate-pulse">█</span>
          </div>
        )}
      </div>
    </div>
  );
}
