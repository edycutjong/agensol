"use client";

interface KillSwitchProps {
  domain: string;
  isActive: boolean;
  isRevoking: boolean;
  onRevoke: () => void;
}

export function KillSwitch({ domain, isActive, isRevoking, onRevoke }: KillSwitchProps) {
  if (!isActive && !isRevoking) {
    return (
      <div className="flex items-center gap-2 text-[11px] font-mono text-brand-muted">
        <span className="w-2 h-2 rounded-full bg-status-error" />
        IDENTITY REVOKED
      </div>
    );
  }

  return (
    <button
      onClick={onRevoke}
      disabled={isRevoking}
      className={`relative group px-5 py-2.5 rounded-lg font-bold font-mono text-xs tracking-wider transition-all duration-300 btn-lift ${
        isRevoking
          ? "bg-status-warning/20 text-status-warning border border-status-warning/30 cursor-wait"
          : "bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error hover:text-white hover:border-status-error hover:neon-red"
      }`}
    >
      {isRevoking && (
        <span className="absolute inset-0 rounded-lg animate-shimmer" />
      )}
      <span className="relative flex items-center gap-2">
        {isRevoking ? (
          <>
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
            </svg>
            REVOKING {domain}...
          </>
        ) : (
          <>⚠ REVOKE {domain}</>
        )}
      </span>
    </button>
  );
}
