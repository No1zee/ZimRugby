import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const fetchMock = vi.fn();

async function loadModule() {
  vi.resetModules();
  return import('./ticketmaster');
}

describe('getTicketmasterFixtures', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns an empty array and skips fetching when the API key is missing', async () => {
    vi.stubEnv('TICKETMASTER_API_KEY', '');
    const { getTicketmasterFixtures } = await loadModule();

    expect(await getTicketmasterFixtures()).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps Ticketmaster events, resolving Zimbabwe as the away team', async () => {
    vi.stubEnv('TICKETMASTER_API_KEY', 'test-key');
    fetchMock.mockResolvedValue({
      json: async () => ({
        _embedded: {
          events: [
            {
              id: 'EVT1',
              url: 'https://tickets.example/evt1',
              dates: {
                start: {
                  dateTime: '2026-07-18T14:00:00Z',
                  localDate: '2026-07-18',
                  localTime: '14:00:00',
                },
              },
              _embedded: {
                attractions: [
                  { name: 'Canada' },
                  { name: 'Zimbabwe Sables' },
                ],
                venues: [{ name: 'BMO Field' }],
              },
            },
          ],
        },
      }),
    });

    const { getTicketmasterFixtures } = await loadModule();
    const fixtures = await getTicketmasterFixtures();

    expect(fixtures).toHaveLength(1);
    const [f] = fixtures;
    expect(f.id).toBe('tm-EVT1');
    expect(f.homeTeam.name).toBe('Canada');
    expect(f.awayTeam.name).toBe('Zimbabwe Sables');
    expect(f.venue).toBe('BMO Field');
    expect(f.time).toBe('14:00:00');
    expect((f as { ticketUrl?: string }).ticketUrl).toBe(
      'https://tickets.example/evt1'
    );

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('apikey=test-key');
  });

  it('falls back to defaults when embedded data is absent', async () => {
    vi.stubEnv('TICKETMASTER_API_KEY', 'test-key');
    fetchMock.mockResolvedValue({
      json: async () => ({
        _embedded: {
          events: [
            {
              id: 'EVT2',
              url: 'https://tickets.example/evt2',
              dates: { start: { localDate: '2026-08-01' } },
            },
          ],
        },
      }),
    });

    const { getTicketmasterFixtures } = await loadModule();
    const [f] = await getTicketmasterFixtures();

    expect(f.homeTeam.name).toBe('Opponent');
    expect(f.awayTeam.name).toBe('Zimbabwe');
    expect(f.venue).toBe('TBA');
    expect(f.time).toBe('TBA');
  });

  it('returns an empty array when there are no events', async () => {
    vi.stubEnv('TICKETMASTER_API_KEY', 'test-key');
    fetchMock.mockResolvedValue({ json: async () => ({}) });

    const { getTicketmasterFixtures } = await loadModule();
    expect(await getTicketmasterFixtures()).toEqual([]);
  });

  it('returns an empty array when the request throws', async () => {
    vi.stubEnv('TICKETMASTER_API_KEY', 'test-key');
    fetchMock.mockRejectedValue(new Error('network'));

    const { getTicketmasterFixtures } = await loadModule();
    expect(await getTicketmasterFixtures()).toEqual([]);
  });
});
