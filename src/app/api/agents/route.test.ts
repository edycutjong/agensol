// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/agent-store', () => ({
  agentStore: {
    getAll: vi.fn(),
    get: vi.fn(),
    add: vi.fn(),
  },
}));

vi.mock('@/lib/sns', () => ({
  snsService: {
    mintSubdomain: vi.fn().mockResolvedValue({ success: true, transaction: 'mock_tx' }),
  },
}));

import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { agentStore } from '@/lib/agent-store';

const makeReq = (body: unknown) =>
  new NextRequest('http://localhost/api/agents', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('GET /api/agents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns agents array', async () => {
    vi.mocked(agentStore.getAll).mockReturnValue([
      { domain: 'test.dao.sol' } as never,
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.agents).toHaveLength(1);
    expect(data.agents[0].domain).toBe('test.dao.sol');
  });

  it('returns empty array when no agents', async () => {
    vi.mocked(agentStore.getAll).mockReturnValue([]);
    const res = await GET();
    const data = await res.json();
    expect(data.agents).toHaveLength(0);
  });
});

describe('POST /api/agents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates agent and returns 201', async () => {
    vi.mocked(agentStore.get).mockReturnValue(undefined);
    const res = await POST(makeReq({ subdomain: 'bot', parentDomain: 'dao.sol' }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.agent.domain).toBe('bot.dao.sol');
    expect(data.agent.status).toBe('active');
    expect(agentStore.add).toHaveBeenCalledOnce();
  });

  it('accepts optional config fields', async () => {
    vi.mocked(agentStore.get).mockReturnValue(undefined);
    const res = await POST(makeReq({
      subdomain: 'mybot',
      parentDomain: 'trading.sol',
      config: { max_spend: '5 SOL', allowed_protocols: ['Jupiter'], heartbeat_interval: '30s' },
    }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.agent.config.max_spend).toBe('5 SOL');
    expect(data.agent.config.allowed_protocols).toEqual(['Jupiter']);
  });

  it('returns 400 when subdomain is missing', async () => {
    const res = await POST(makeReq({ parentDomain: 'dao.sol' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when parentDomain is missing', async () => {
    const res = await POST(makeReq({ subdomain: 'bot' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/agents', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 409 when agent domain already exists', async () => {
    vi.mocked(agentStore.get).mockReturnValue({ domain: 'bot.dao.sol' } as never);
    const res = await POST(makeReq({ subdomain: 'bot', parentDomain: 'dao.sol' }));
    expect(res.status).toBe(409);
  });
});
