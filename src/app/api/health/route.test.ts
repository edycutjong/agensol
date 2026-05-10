// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.status).toBe('ok');
  });

  it('returns a valid ISO timestamp', async () => {
    const res = await GET();
    const data = await res.json();
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('returns numeric uptime', async () => {
    const res = await GET();
    const data = await res.json();
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('returns environment field', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.environment).toBeDefined();
  });
});
