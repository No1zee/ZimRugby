import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const readFileSyncMock = vi.fn();

vi.mock('fs', () => ({
  default: { readFileSync: (...args: unknown[]) => readFileSyncMock(...args) },
  readFileSync: (...args: unknown[]) => readFileSyncMock(...args),
}));

import {
  getLiveMatches,
  getLatestReports,
  getSocialPosts,
  getReportById,
} from './data-fetcher';

function fileFor(name: string) {
  return (p: string) => {
    if (!String(p).endsWith(name)) {
      throw new Error(`unexpected file ${p}`);
    }
  };
}

describe('data-fetcher', () => {
  beforeEach(() => {
    readFileSyncMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getLiveMatches drops the placeholder header row', async () => {
    fileFor('matches.json');
    readFileSyncMock.mockReturnValue(
      JSON.stringify([
        { id: 'header', homeTeam: { name: 'Date' }, awayTeam: { name: '' } },
        { id: 'm1', homeTeam: { name: 'Zimbabwe' }, awayTeam: { name: 'Kenya' } },
      ])
    );

    const matches = await getLiveMatches();
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('m1');
  });

  it('getLatestReports returns parsed report JSON', async () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify([{ id: 'r1', title: 'Report One' }])
    );

    const reports = await getLatestReports();
    expect(reports).toEqual([{ id: 'r1', title: 'Report One' }]);
  });

  it('getSocialPosts returns parsed social JSON', async () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify([{ id: 's1', source: 'social' }])
    );

    const posts = await getSocialPosts();
    expect(posts[0].id).toBe('s1');
  });

  it('getReportById finds a matching report', async () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify([
        { id: 'r1', title: 'One' },
        { id: 'r2', title: 'Two' },
      ])
    );

    const report = await getReportById('r2');
    expect(report?.title).toBe('Two');
  });

  it('getReportById returns undefined when not found', async () => {
    readFileSyncMock.mockReturnValue(JSON.stringify([{ id: 'r1' }]));
    expect(await getReportById('missing')).toBeUndefined();
  });

  it('returns an empty array when reading the file fails', async () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error('ENOENT');
    });
    expect(await getLatestReports()).toEqual([]);
  });
});
