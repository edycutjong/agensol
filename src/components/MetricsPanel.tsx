"use client";

import { useState, useEffect } from "react";

interface Metric {
  label: string;
  value: string;
  suffix?: string;
  color: string;
  icon: string;
}

interface MetricsPanelProps {
  activeCount: number;
  revokedCount: number;
  totalCount: number;
}

export function MetricsPanel({ activeCount, revokedCount, totalCount }: MetricsPanelProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const metrics: Metric[] = [
    {
      label: "REGISTERED",
      value: String(totalCount),
      suffix: "agents",
      color: "text-brand-primary",
      icon: "◆",
    },
    {
      label: "ACTIVE",
      value: String(activeCount),
      suffix: "verified",
      color: "text-status-success",
      icon: "●",
    },
    {
      label: "REVOKED",
      value: String(revokedCount),
      suffix: "killed",
      color: "text-status-error",
      icon: "✕",
    },
    {
      label: "SDK FEATURES",
      value: "5",
      suffix: "/5",
      color: "text-brand-accent",
      icon: "⬡",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className={`glass-panel rounded-xl p-4 group hover:neon-border transition-all duration-300 ${
            animated ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`${m.color} text-xs opacity-60`}>{m.icon}</span>
            <span className="text-[10px] font-mono text-brand-muted tracking-widest">
              {m.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold font-mono metric-value ${m.color}`}>
              {m.value}
            </span>
            {m.suffix && (
              <span className="text-xs text-brand-muted font-mono">{m.suffix}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
