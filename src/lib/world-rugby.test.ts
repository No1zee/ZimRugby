import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWorldRugbyFixtures } from './world-rugby';

function icsResponse(body: string, ok = true, statusText = 'OK') {
  return {
    ok,
    statusText,
    text: async () => body,
  } as unknown as Response;
}

const fetchMock = vi.fn();

describe('getWorldRugbyFixtures', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('parses ICS events, keeps only Zimbabwe matches and splits on " v "', async () => {
    fetchMock.mockResolvedValue(
      icsResponse(
        [
          'BEGIN:VCALENDAR',
          'BEGIN:VEVENT',
          'UID:abc123',
          'SUMMARY:Zimbabwe v Kenya',
          'LOCATION:Harare Sports Club',
          'DTSTART:20260425T150000Z',
          'END:VEVENT',
          'BEGIN:VEVENT',
          'UID:def456',
          'SUMMARY:France v Ireland',
          'LOCATION:Paris',
          'DTSTART:20260501T140000Z',
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\r\n')
      )
    );

    const fixtures = await getWorldRugbyFixtures();

    expect(fixtures).toHaveLength(1);
    const [f] = fixtures;
    expect(f.id).toBe('wr-abc123');
    expect(f.homeTeam.name).toBe('Zimbabwe');
    expect(f.awayTeam.name).toBe('Kenya');
    expect(f.venue).toBe('Harare Sports Club');
    expect(f.status).toBe('upcoming');
    expect(f.date.getUTCFullYear()).toBe(2026);
    expect(f.date.getUTCMonth()).toBe(3);
    expect(f.date.getUTCDate()).toBe(25);
    expect(f.date.getUTCHours()).toBe(15);
  });

  it('matches Zimbabwe case-insensitively and supports the "vs" separator', async () => {
    fetchMock.mockResolvedValue(
      icsResponse(
        [
          'BEGIN:VEVENT',
          'UID:x',
          'SUMMARY:ZIMBABWE vs Namibia',
          'DTSTART:20260610T190000Z',
          'END:VEVENT',
        ].join('\n')
      )
    );

    const fixtures = await getWorldRugbyFixtures();
    expect(fixtures).toHaveLength(1);
    expect(fixtures[0].homeTeam.name).toBe('ZIMBABWE');
    expect(fixtures[0].awayTeam.name).toBe('Namibia');
  });

  it('defaults the venue to "TBA" when LOCATION is missing', async () => {
    fetchMock.mockResolvedValue(
      icsResponse(
        [
          'BEGIN:VEVENT',
          'UID:y',
          'SUMMARY:Zimbabwe v Tonga',
          'DTSTART:20260701T160000Z',
          'END:VEVENT',
        ].join('\n')
      )
    );

    const fixtures = await getWorldRugbyFixtures();
    expect(fixtures[0].venue).toBe('TBA');
  });

  it('returns an empty array on a non-ok response', async () => {
    fetchMock.mockResolvedValue(icsResponse('', false, 'Not Found'));
    expect(await getWorldRugbyFixtures()).toEqual([]);
  });

  it('returns an empty array when the fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));
    expect(await getWorldRugbyFixtures()).toEqual([]);
  });

  it('returns an empty array when there are no VEVENTs', async () => {
    fetchMock.mockResolvedValue(icsResponse('BEGIN:VCALENDAR\r\nEND:VCALENDAR'));
    expect(await getWorldRugbyFixtures()).toEqual([]);
  });
});
