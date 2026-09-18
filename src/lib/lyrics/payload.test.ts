import { describe, expect, it } from 'vitest';
import { buildLyricsSavePayload } from './payload';

describe('buildLyricsSavePayload', () => {
  it('builds unsynced payload without lines', () => {
    const payload = buildLyricsSavePayload('en', 'Line one\nLine two', false);
    expect(payload).toEqual({
      language: 'en',
      plainText: 'Line one\nLine two',
      isSynced: false,
    });
    expect('lines' in payload).toBe(false);
  });

  it('builds synced payload with integer ms line timings', () => {
    const payload = buildLyricsSavePayload(
      'en',
      'I remember when we first met\nYou were standing in the rain',
      true,
      [
        { lineIndex: 0, text: 'I remember when we first met', startTimeMs: 12500, endTimeMs: 16200 },
        { lineIndex: 1, text: 'You were standing in the rain', startTimeMs: 16200, endTimeMs: 20800 },
      ]
    );

    expect(payload).toEqual({
      language: 'en',
      plainText: 'I remember when we first met\nYou were standing in the rain',
      isSynced: true,
      lines: [
        { lineIndex: 0, text: 'I remember when we first met', startTimeMs: 12500, endTimeMs: 16200 },
        { lineIndex: 1, text: 'You were standing in the rain', startTimeMs: 16200, endTimeMs: 20800 },
      ],
    });
  });

  it('normalizes language code', () => {
    const payload = buildLyricsSavePayload(' EN ', 'text', false);
    expect(payload.language).toBe('en');
  });
});
