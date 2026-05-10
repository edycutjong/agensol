import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@bonfida/spl-name-service', () => ({
  getDomainKeySync: vi.fn(() => ({
    pubkey: { toBase58: () => 'mockedBase58PubKey' },
  })),
}));

vi.mock('@solana/web3.js', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Connection: vi.fn(function () {} as any),
}));

import { SnsIdentityService } from './sns';
import { getDomainKeySync } from '@bonfida/spl-name-service';

describe('SnsIdentityService', () => {
  let service: SnsIdentityService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SnsIdentityService();
  });

  it('is instantiable', () => {
    expect(service).toBeInstanceOf(SnsIdentityService);
  });

  it('init() is idempotent', () => {
    service.init();
    service.init();
    expect(getDomainKeySync).not.toHaveBeenCalled();
  });

  describe('resolveDomain', () => {
    it('resolves a valid domain', async () => {
      const result = await service.resolveDomain('treasury.dao.sol');
      expect(result).toBeDefined();
      expect(getDomainKeySync).toHaveBeenCalledWith('treasury.dao.sol');
    });

    it('returns null when getDomainKeySync throws', async () => {
      vi.mocked(getDomainKeySync).mockImplementationOnce(() => {
        throw new Error('DNS lookup failed');
      });
      const result = await service.resolveDomain('bad.sol');
      expect(result).toBeNull();
    });
  });

  describe('mintSubdomain', () => {
    it('mints successfully and returns correct transaction id', async () => {
      vi.useFakeTimers();
      const p = service.mintSubdomain('bot', 'dao.sol');
      await vi.runAllTimersAsync();
      const result = await p;
      expect(result.success).toBe(true);
      expect(result.transaction).toBe('mint_bot_dao.sol');
      vi.useRealTimers();
    });

    it('falls back when getDomainKeySync throws', async () => {
      vi.mocked(getDomainKeySync).mockImplementationOnce(() => {
        throw new Error('Network error');
      });
      vi.useFakeTimers();
      const p = service.mintSubdomain('bot', 'dao.sol');
      await vi.runAllTimersAsync();
      const result = await p;
      expect(result.success).toBe(true);
      expect(result.transaction).toBe('mock_tx_mint');
      vi.useRealTimers();
    });
  });

  describe('revokeIdentity', () => {
    it('revokes and returns correct transaction id', async () => {
      vi.useFakeTimers();
      const p = service.revokeIdentity('treasury.dao.sol');
      await vi.runAllTimersAsync();
      const result = await p;
      expect(result.success).toBe(true);
      expect(result.transaction).toBe('revoke_treasury.dao.sol');
      vi.useRealTimers();
    });

    it('falls back when getDomainKeySync throws', async () => {
      vi.mocked(getDomainKeySync).mockImplementationOnce(() => {
        throw new Error('Network error');
      });
      vi.useFakeTimers();
      const p = service.revokeIdentity('treasury.dao.sol');
      await vi.runAllTimersAsync();
      const result = await p;
      expect(result.success).toBe(true);
      expect(result.transaction).toBe('mock_tx_revoke');
      vi.useRealTimers();
    });
  });

  describe('getProfileRecord', () => {
    it('returns success with key for valid domain', async () => {
      const result = await service.getProfileRecord('treasury.dao.sol');
      expect(result.success).toBe(true);
      expect(result.key).toBe('mockedBase58PubKey');
    });

    it('returns failure when getDomainKeySync throws', async () => {
      vi.mocked(getDomainKeySync).mockImplementationOnce(() => {
        throw new Error('Not found');
      });
      const result = await service.getProfileRecord('missing.sol');
      expect(result.success).toBe(false);
      expect(result.key).toBeNull();
    });
  });
});
