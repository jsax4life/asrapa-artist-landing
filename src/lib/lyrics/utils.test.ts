import { describe, expect, it } from 'vitest';
import {
  applySyncAtLine,
  findActiveLineIndex,
  finalizeLineEndTimes,
  splitPlainTextToLines,
  validateSyncedLines,
  nudgeLineStartMs,
} from './utils';

const sampleLines = () => [
  { lineIndex: 0, text: 'Line A', startTimeMs: 10000, endTimeMs: 15000 },
  { lineIndex: 1, text: 'Line B', startTimeMs: 15000, endTimeMs: 20000 },
];

describe('synchronization utils', () => {
  it('assigns end times from next line start', () => {
    const lines = finalizeLineEndTimes(
      [
        { lineIndex: 0, text: 'A', startTimeMs: 12500, endTimeMs: 0 },
        { lineIndex: 1, text: 'B', startTimeMs: 16200, endTimeMs: 0 },
      ],
      30000
    );
    expect(lines[0].endTimeMs).toBe(16200);
    expect(lines[1].endTimeMs).toBe(30000);
  });

  it('applySyncAtLine sets start and previous end', () => {
    const base = splitPlainTextToLines('A\nB\nC');
    const { lines, nextLineIndex } = applySyncAtLine(base, 1, 15000, 60000);
    expect(lines[1].startTimeMs).toBe(15000);
    expect(lines[0].endTimeMs).toBe(15000);
    expect(nextLineIndex).toBe(2);
  });

  it('findActiveLineIndex at boundary timestamps', () => {
    const lines = sampleLines();
    expect(findActiveLineIndex(lines, 9999)).toBe(-1);
    expect(findActiveLineIndex(lines, 10000)).toBe(0);
    expect(findActiveLineIndex(lines, 12000)).toBe(0);
    expect(findActiveLineIndex(lines, 14999)).toBe(0);
    expect(findActiveLineIndex(lines, 15000)).toBe(1);
    expect(findActiveLineIndex(lines, 17500)).toBe(1);
    expect(findActiveLineIndex(lines, 20000)).toBe(1);
  });

  it('validates empty and single line lyrics', () => {
    expect(validateSyncedLines([]).valid).toBe(false);
    const one = [{ lineIndex: 0, text: 'Only', startTimeMs: 0, endTimeMs: 5000 }];
    expect(validateSyncedLines(one, 10000).valid).toBe(true);
  });

  it('nudge adjusts start and dependent end times', () => {
    const nudged = nudgeLineStartMs(sampleLines(), 1, 100, 60000);
    expect(nudged[1].startTimeMs).toBe(15100);
    expect(nudged[0].endTimeMs).toBe(15100);
  });
});

describe('splitPlainTextToLines', () => {
  it('parses sequential line indexes', () => {
    const lines = splitPlainTextToLines('First\nSecond\nThird');
    expect(lines.map((l) => l.lineIndex)).toEqual([0, 1, 2]);
    expect(lines[1].text).toBe('Second');
  });
});
