"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { snsService } from "@/lib/sns";

// Mock Agent Data
const MOCK_AGENTS = [
  {
    domain: "treasury.dao.sol",
    type: "DeFi Executor",
    owner: "7X...aB",
    status: "active",
    config: {
      max_spend: "1000 USDC",
      allowed_protocols: ["Jupiter", "Meteora"],
      heartbeat_interval: "5m"
    }
  },
  {
    domain: "sniper.trading.sol",
    type: "Market Maker",
    owner: "4R...xZ",
    status: "active",
    config: {
      max_spend: "50 SOL",
      allowed_protocols: ["Raydium", "Orca"],
      heartbeat_interval: "1m"
    }
  },
  {
    domain: "arbitrage.bot.sol",
    type: "Arbitrage",
    owner: "9K...pL",
    status: "revoked",
    config: {
      max_spend: "10000 USDC",
      allowed_protocols: ["All"],
      heartbeat_interval: "10s"
    }
  }
];

export default function AgensolDashboard() {
  const [view, setView] = useState<'registry' | 'register' | 'admin'>('registry');
  const [agents, setAgents] = useState(MOCK_AGENTS);
  
  const [newSubdomain, setNewSubdomain] = useState("");
  const [parentDomain, setParentDomain] = useState("dao.sol");
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!newSubdomain) return;
    setIsMinting(true);
    
    const parentOwnerPubkey = new PublicKey("11111111111111111111111111111111"); // Mock parent owner
    const targetOwnerPubkey = new PublicKey("11111111111111111111111111111111"); // Mock target owner
    await snsService.mintSubdomain(newSubdomain, parentDomain, parentOwnerPubkey, targetOwnerPubkey);
    
    setAgents([{
      domain: `${newSubdomain}.${parentDomain}`,
      type: "Custom Agent",
      owner: "CurrentWallet",
      status: "active",
      config: {
        max_spend: "0 USDC",
        allowed_protocols: ["None"],
        heartbeat_interval: "Unknown"
      }
    }, ...agents]);
    setIsMinting(false);
    setView('registry');
    setNewSubdomain("");
  };

  const handleRevoke = async (domain: string) => {
    setAgents(agents.map(a => 
      a.domain === domain ? { ...a, status: 'revoking' } : a
    ));
    
    const ownerPubkey = new PublicKey("11111111111111111111111111111111"); // Mock owner
    const burnAddress = new PublicKey("11111111111111111111111111111111");
    await snsService.revokeIdentity(domain, ownerPubkey, burnAddress);
    
    setAgents(agents.map(a => 
      a.domain === domain ? { ...a, status: 'revoked', owner: 'BurnAddress111111111111111111111111111111111' } : a
    ));
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="text-brand-primary">Agen</span>sol
          </h1>
          <p className="text-brand-muted mt-1 text-sm">SNS Identity Registry for AI Agents</p>
        </div>
        <div className="flex gap-2">
          {['registry', 'register', 'admin'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setView(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === tab 
                  ? 'bg-brand-surface text-brand-primary border border-brand-primary/50' 
                  : 'bg-transparent text-brand-muted hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <main>
        {view === 'registry' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Verified Agent Directory</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <div key={agent.domain} className={`glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 ${agent.status === 'revoked' ? 'opacity-50 grayscale' : 'hover:neon-border'}`}>
                  {agent.status === 'revoking' && <div className="absolute inset-0 bg-status-error/10 animate-pulse pointer-events-none"></div>}
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg font-mono text-white break-all pr-4">{agent.domain}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      agent.status === 'active' ? 'bg-status-success/20 text-status-success' :
                      agent.status === 'revoking' ? 'bg-status-warning/20 text-status-warning animate-pulse' :
                      'bg-status-error/20 text-status-error'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between pb-2 border-b border-brand-border">
                      <span className="text-brand-muted">Type</span>
                      <span className="text-brand-primary">{agent.type}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-brand-border">
                      <span className="text-brand-muted">Owner (Controller)</span>
                      <span className="text-white truncate max-w-[120px]">{agent.owner}</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-brand-bg border border-brand-border rounded-lg">
                      <div className="text-xs text-brand-muted mb-2">SNS PROFILE RECORD (JSON)</div>
                      <pre className="text-[10px] text-white/80 overflow-x-auto">
                        {JSON.stringify(agent.config, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'register' && (
          <div className="glass-panel p-8 rounded-xl max-w-2xl mx-auto space-y-6">
            <div className="text-center pb-6 border-b border-brand-border">
              <h2 className="text-2xl font-bold mb-2">Mint Agent Identity</h2>
              <p className="text-brand-muted text-sm">Register a new AI agent sub-domain on SNS to establish on-chain identity and permissions.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">Agent Name (Sub-domain)</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-grow bg-brand-bg border border-brand-border rounded-l p-3 text-white font-mono focus:outline-none focus:border-brand-primary" 
                    placeholder="e.g. tradingbot" 
                  />
                  <select 
                    value={parentDomain}
                    onChange={(e) => setParentDomain(e.target.value)}
                    className="bg-brand-surface border-y border-r border-brand-border rounded-r p-3 text-white font-mono focus:outline-none"
                  >
                    <option value="dao.sol">.dao.sol</option>
                    <option value="agency.sol">.agency.sol</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">Initial Profile Record (Config)</label>
                <textarea 
                  className="w-full h-32 bg-brand-bg border border-brand-border rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-brand-primary"
                  defaultValue={JSON.stringify({ "max_spend": "0 SOL", "allowed_protocols": [] }, null, 2)}
                ></textarea>
              </div>

              <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-sm text-brand-primary flex items-start gap-3">
                <span className="text-lg">ℹ️</span>
                <p>Minting this sub-domain transfers ownership to the registering wallet. The agent can resolve its own identity via SNS to read its config.</p>
              </div>

              <button 
                onClick={handleMint}
                disabled={isMinting || !newSubdomain}
                className={`w-full py-3 mt-4 rounded font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] ${
                  isMinting || !newSubdomain
                    ? 'bg-brand-surface text-brand-muted cursor-not-allowed border border-brand-border shadow-none'
                    : 'bg-brand-primary text-black hover:bg-brand-primary/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                }`}
              >
                {isMinting ? 'Minting & Configuring SNS Record...' : `Mint ${newSubdomain || '...'}.${parentDomain}`}
              </button>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-status-error">⚠️</span> Emergency Kill Switches (Revocation)
            </h2>
            <p className="text-brand-muted max-w-2xl">
              If an agent goes rogue or is compromised, you can instantly revoke its identity by transferring the sub-domain to a burn address. Protocols relying on SNS identity resolution will immediately reject the agent.
            </p>

            <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-6">
              <table className="w-full text-left font-mono text-sm">
                <thead className="text-brand-muted border-b border-status-error/30">
                  <tr>
                    <th className="pb-3">Agent Domain</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-status-error/10">
                  {agents.map(agent => (
                    <tr key={agent.domain} className={agent.status === 'revoked' ? 'opacity-50' : ''}>
                      <td className="py-4 text-white">{agent.domain}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs uppercase ${agent.status === 'active' ? 'text-status-success' : 'text-status-error'}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {agent.status === 'active' ? (
                          <button 
                            onClick={() => handleRevoke(agent.domain)}
                            className="px-4 py-2 bg-status-error hover:bg-status-error/80 text-white rounded font-bold transition-colors shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                          >
                            REVOKE IDENTITY
                          </button>
                        ) : agent.status === 'revoking' ? (
                          <span className="text-status-warning animate-pulse">Transferring to burn address...</span>
                        ) : (
                          <span className="text-brand-muted">REVOKED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
