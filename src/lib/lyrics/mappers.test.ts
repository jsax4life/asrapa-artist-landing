import { describe, expect, it } from 'vitest';
import { mapLyric, mapLyricsList } from './mappers';

describe('lyrics mappers', () => {
  it('maps synced lyric with lines', () => {
    const lyric = mapLyric(
      {
        _id: 'ly1',
        songId: 'song1',
        language: 'en',
        plainText: 'Hello',
        isSynced: true,
        status: 'approved',
        lines: [
          { lineIndex: 0, text: 'Hello', startTimeMs: 1000, endTimeMs: 2000 },
        ],
      },
      'song1'
    );
    expect(lyric.isSynced).toBe(true);
    expect(lyric.lines[0].startTimeMs).toBe(1000);
    expect(lyric.status).toBe('approved');
  });

  it('maps unsynced lyric', () => {
    const lyric = mapLyric(
      { language: 'fr', plainText: 'Bonjour', isSynced: false, status: 'pending' },
      'song1'
    );
    expect(lyric.isSynced).toBe(false);
    expect(lyric.lines).toEqual([]);
  });

  it('maps multiple languages from list payload', () => {
    const list = mapLyricsList(
      {
        status: 'success',
        data: {
          lyrics: [
            { language: 'en', plainText: 'Hi', isSynced: false, status: 'pending' },
            { language: 'fr', plainText: 'Salut', isSynced: false, status: 'approved' },
          ],
        },
      },
      'song1'
    );
    expect(list).toHaveLength(2);
    expect(list.map((l) => l.language).sort()).toEqual(['en', 'fr']);
  });

  it('serializes round-trip fields for API-shaped object', () => {
    const raw = {
      language: 'en',
      plainText: 'A\nB',
      isSynced: true,
      status: 'rejected',
      moderationComment: 'Needs revision',
      lines: [
        { lineIndex: 0, text: 'A', startTimeMs: 10, endTimeMs: 20 },
        { lineIndex: 1, text: 'B', startTimeMs: 20, endTimeMs: 30 },
      ],
    };
    const mapped = mapLyric(raw, 's1');
    expect(JSON.stringify(mapped.lines)).toContain('"startTimeMs":10');
    expect(mapped.moderationComment).toBe('Needs revision');
  });
});
