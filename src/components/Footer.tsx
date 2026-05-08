export function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand-border/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-brand-primary font-bold font-mono text-sm">AGENSOL</span>
            <span className="text-brand-border">│</span>
            <span className="text-[11px] text-brand-muted font-mono">
              AI Agent Identity Registry on SNS
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-brand-muted">
            <span>Built for <span className="text-white font-semibold">Colosseum Frontier 2026</span></span>
            <span className="text-brand-border">│</span>
            <span>Powered by <span className="text-brand-primary">@bonfida/spl-name-service</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
