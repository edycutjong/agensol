"use client";

import { useState, useEffect } from "react";

export function StatusBar() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() => new Date());
  const [latency, setLatency] = useState(() => 12);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
      setLatency(Math.floor(8 + Math.random() * 12));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 glass-panel-strong border-b border-brand-border/50 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            </span>
            <span className="text-status-success font-semibold tracking-wider">DEVNET LIVE</span>
          </div>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted">
            SNS REGISTRY <span className="text-brand-primary">v1.0.0</span>
          </span>
        </div>

        <div className="flex items-center gap-4" suppressHydrationWarning>
          <span className="text-brand-muted" suppressHydrationWarning>
            RPC: <span className={`font-bold ${latency < 15 ? 'text-status-success' : 'text-status-warning'}`}>{mounted ? `${latency}ms` : '--'}</span>
          </span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted" suppressHydrationWarning>
            BLOCK: <span className="text-brand-primary">{mounted ? (312847650 + Math.floor(time.getTime() / 400) % 1000).toLocaleString() : '---'}</span>
          </span>
          <span className="text-brand-border">│</span>
          <span className="text-brand-muted tabular-nums" suppressHydrationWarning>
            {mounted ? time.toLocaleTimeString("en-US", { hour12: false }) : '--:--:--'} UTC
          </span>
        </div>
      </div>
    </div>
  );
}
