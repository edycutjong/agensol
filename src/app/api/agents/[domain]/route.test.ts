// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/agent-store', () => ({
  agentStore: {
    get: vi.fn(),
  },
}));

import { GET } from './route';
import { agentStore } from '@/lib/agent-store';

const makeParams = (domain: string) =>
  ({ params: Promise.resolve({ domain }) });

describe('GET /api/agents/[domain]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns agent when found', async () => {
    vi.mocked(agentStore.get).mockReturnValue({
      domain: 'treasury.dao.sol',
      status: 'active',
    } as never);
    const res = await GET(new Request('http://localhost'), makeParams('treasury.dao.sol'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.agent.domain).toBe('treasury.dao.sol');
  });

  it('decodes URI-encoded domain', async () => {
    vi.mocked(agentStore.get).mockReturnValue({ domain: 'treasury.dao.sol' } as never);
    await GET(new Request('http://localhost'), makeParams('treasury.dao.sol'));
    expect(agentStore.get).toHaveBeenCalledWith('treasury.dao.sol');
  });

  it('returns 404 when agent not found', async () => {
    vi.mocked(agentStore.get).mockReturnValue(undefined);
    const res = await GET(new Request('http://localhost'), makeParams('ghost.sol'));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Agent not found');
  });
});
