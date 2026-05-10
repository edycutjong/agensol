import { describe, it, expect, beforeEach } from 'vitest';
import { agentStore } from './agent-store';
import type { AgentData } from './types';

const MAKE_AGENT = (domain: string): AgentData => ({
  domain,
  type: 'Test',
  owner: 'wallet123',
  status: 'active',
  registeredAt: new Date().toISOString(),
  lastHeartbeat: 'just now',
  config: { max_spend: '0 USDC', allowed_protocols: [], heartbeat_interval: '60s' },
});

describe('agentStore', () => {
  beforeEach(() => {
    agentStore.reset();
  });

  it('getAll returns all seed agents', () => {
    const agents = agentStore.getAll();
    expect(agents).toHaveLength(5);
  });

  it('getAll returns a copy, not the live array', () => {
    const a = agentStore.getAll();
    const b = agentStore.getAll();
    expect(a).not.toBe(b);
  });

  it('get returns matching agent', () => {
    const agent = agentStore.get('treasury.dao.sol');
    expect(agent).toBeDefined();
    expect(agent?.domain).toBe('treasury.dao.sol');
    expect(agent?.status).toBe('active');
  });

  it('get returns undefined for unknown domain', () => {
    expect(agentStore.get('unknown.sol')).toBeUndefined();
  });

  it('add prepends agent and getAll reflects it', () => {
    agentStore.add(MAKE_AGENT('new-agent.dao.sol'));
    const agents = agentStore.getAll();
    expect(agents).toHaveLength(6);
    expect(agents[0].domain).toBe('new-agent.dao.sol');
  });

  it('add stores a copy, mutating input does not affect store', () => {
    const a = MAKE_AGENT('copy-test.sol');
    agentStore.add(a);
    a.owner = 'mutated';
    expect(agentStore.get('copy-test.sol')?.owner).toBe('wallet123');
  });

  describe('revoke', () => {
    it('revokes an active agent and returns true', () => {
      expect(agentStore.revoke('treasury.dao.sol')).toBe(true);
      const agent = agentStore.get('treasury.dao.sol');
      expect(agent?.status).toBe('revoked');
      expect(agent?.owner).toBe('Burn1111...1111');
      expect(agent?.lastHeartbeat).toBe('REVOKED');
    });

    it('returns false for unknown domain', () => {
      expect(agentStore.revoke('ghost.sol')).toBe(false);
    });

    it('returns false when agent already revoked', () => {
      expect(agentStore.revoke('arbitrage.bot.sol')).toBe(false);
    });
  });

  it('reset restores original seed data', () => {
    agentStore.add(MAKE_AGENT('extra.sol'));
    agentStore.revoke('treasury.dao.sol');
    agentStore.reset();
    const agents = agentStore.getAll();
    expect(agents).toHaveLength(5);
    expect(agents.find((a) => a.domain === 'treasury.dao.sol')?.status).toBe('active');
    expect(agents.find((a) => a.domain === 'extra.sol')).toBeUndefined();
  });
});
