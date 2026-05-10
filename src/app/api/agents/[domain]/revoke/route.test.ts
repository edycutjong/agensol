// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/agent-store', () => ({
  agentStore: {
    get: vi.fn(),
    revoke: vi.fn(),
  },
}));

vi.mock('@/lib/sns', () => ({
  snsService: {
    revokeIdentity: vi.fn().mockResolvedValue({ success: true }),
  },
}));

import { POST } from './route';
import { agentStore } from '@/lib/agent-store';

const makeParams = (domain: string) =>
  ({ params: Promise.resolve({ domain }) });

describe('POST /api/agents/[domain]/revoke', () => {
  beforeEach(() => vi.clearAllMocks());

  it('revokes an active agent and returns success', async () => {
    vi.mocked(agentStore.get).mockReturnValue({ domain: 'treasury.dao.sol', status: 'active' } as never);
    const res = await POST(new Request('http://localhost', { method: 'POST' }), makeParams('treasury.dao.sol'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.domain).toBe('treasury.dao.sol');
    expect(agentStore.revoke).toHaveBeenCalledWith('treasury.dao.sol');
  });

  it('returns 404 when agent not found', async () => {
    vi.mocked(agentStore.get).mockReturnValue(undefined);
    const res = await POST(new Request('http://localhost', { method: 'POST' }), makeParams('ghost.sol'));
    expect(res.status).toBe(404);
  });

  it('returns 409 when agent is already revoked', async () => {
    vi.mocked(agentStore.get).mockReturnValue({ domain: 'bot.sol', status: 'revoked' } as never);
    const res = await POST(new Request('http://localhost', { method: 'POST' }), makeParams('bot.sol'));
    expect(res.status).toBe(409);
    expect(agentStore.revoke).not.toHaveBeenCalled();
  });

  it('calls snsService.revokeIdentity before updating store', async () => {
    vi.mocked(agentStore.get).mockReturnValue({ domain: 'sniper.trading.sol', status: 'active' } as never);
    const { snsService } = await import('@/lib/sns');
    const order: string[] = [];
    vi.mocked(snsService.revokeIdentity).mockImplementationOnce(async () => {
      order.push('sns');
      return { success: true, transaction: 'tx' };
    });
    vi.mocked(agentStore.revoke).mockImplementationOnce(() => {
      order.push('store');
      return true;
    });
    await POST(new Request('http://localhost', { method: 'POST' }), makeParams('sniper.trading.sol'));
    expect(order).toEqual(['sns', 'store']);
  });
});
