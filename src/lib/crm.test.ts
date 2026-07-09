import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  registerTicketingInterest,
  joinZRUNation,
  recordCampaignPledge,
} from './crm';

describe('crm connector (mock service)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  async function settle<T>(promise: Promise<T>): Promise<T> {
    await vi.runAllTimersAsync();
    return promise;
  }

  it('registerTicketingInterest resolves with a success message', async () => {
    const result = await settle(
      registerTicketingInterest('zru-usa-2026', {
        name: 'Fan',
        email: 'fan@example.com',
      })
    );
    expect(result).toEqual({
      success: true,
      message: 'Interest registered successfully.',
    });
  });

  it('joinZRUNation resolves with a generated member id', async () => {
    const result = await settle(
      joinZRUNation({ name: 'Fan', email: 'fan@example.com' })
    );
    expect(result.success).toBe(true);
    expect(result.memberId).toMatch(/^[a-z0-9]+$/);
  });

  it('recordCampaignPledge resolves successfully', async () => {
    const result = await settle(
      recordCampaignPledge('fan@example.com', 'tier-gold')
    );
    expect(result).toEqual({ success: true });
  });
});
