import { LyricLine, LyricLineInput } from './types';

/** Apply "sync current line" using actual playback position (ms). */
export const applySyncAtLine = (
  lines: LyricLineInput[],
  currentLineIndex: number,
  positionMs: number,
  songDurationMs?: number
): { lines: LyricLineInput[]; nextLineIndex: number | null } => {
  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);
  const idx = sorted.findIndex((l) => l.lineIndex === currentLineIndex);
  if (idx < 0) {
    return { lines: sorted, nextLineIndex: null };
  }

  const ms = Math.round(positionMs);
  const updated = sorted.map((line) => ({ ...line }));
  updated[idx].startTimeMs = ms;
  if (idx > 0) {
    updated[idx - 1].endTimeMs = ms;
  }

  const finalized = finalizeLineEndTimes(
    updated,
    songDurationMs !== undefined && songDurationMs > 0 ? songDurationMs : undefined
  );

  const nextLineIndex = idx < updated.length - 1 ? updated[idx + 1].lineIndex : null;
  return { lines: finalized, nextLineIndex };
};

export const splitPlainTextToLines = (plainText: string): LyricLineInput[] => {
  const rows = plainText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return rows.map((text, lineIndex) => ({
    lineIndex,
    text,
    startTimeMs: 0,
    endTimeMs: 0,
  }));
};

export const finalizeLineEndTimes = (
  lines: LyricLineInput[],
  songDurationMs?: number
): LyricLineInput[] => {
  if (lines.length === 0) return lines;

  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);
  const result = sorted.map((line) => ({ ...line }));

  for (let i = 0; i < result.length - 1; i += 1) {
    const nextStart = result[i + 1].startTimeMs;
    if (nextStart > result[i].startTimeMs) {
      result[i].endTimeMs = nextStart;
    }
  }

  const last = result[result.length - 1];
  if (songDurationMs !== undefined && songDurationMs > last.startTimeMs) {
    last.endTimeMs = songDurationMs;
  } else if (last.endTimeMs <= last.startTimeMs) {
    last.endTimeMs = last.startTimeMs + 1;
  }

  return result;
};

export interface LyricsValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateSyncedLines = (
  lines: LyricLineInput[],
  songDurationMs?: number
): LyricsValidationResult => {
  const errors: string[] = [];
  if (lines.length === 0) {
    errors.push('At least one lyric line is required.');
    return { valid: false, errors };
  }

  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);

  sorted.forEach((line, index) => {
    if (!line.text.trim()) {
      errors.push(`Line ${index + 1} text cannot be empty.`);
    }
    if (line.lineIndex !== index) {
      errors.push(`Line indexes must be sequential (expected ${index}, got ${line.lineIndex}).`);
    }
    if (line.startTimeMs < 0) {
      errors.push(`Line ${index + 1} start time must be >= 0.`);
    }
    if (line.endTimeMs <= line.startTimeMs) {
      errors.push(`Line ${index + 1} end time must be greater than start time.`);
    }
    if (index > 0 && line.startTimeMs < sorted[index - 1].startTimeMs) {
      errors.push(`Line ${index + 1} must start after line ${index}.`);
    }
    if (index > 0 && sorted[index - 1].endTimeMs > line.startTimeMs) {
      errors.push(`Lines ${index} and ${index + 1} overlap.`);
    }
    if (songDurationMs !== undefined && line.endTimeMs > songDurationMs) {
      errors.push(`Line ${index + 1} exceeds song duration.`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export const adjustLineStartMs = (
  lines: LyricLineInput[],
  lineIndex: number,
  newStartMs: number,
  songDurationMs?: number
): LyricLineInput[] => {
  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);
  const idx = sorted.findIndex((l) => l.lineIndex === lineIndex);
  if (idx < 0) return lines;

  const clamped = Math.max(0, Math.round(newStartMs));
  sorted[idx].startTimeMs = clamped;

  if (idx > 0) {
    const prev = sorted[idx - 1];
    if (prev.endTimeMs !== clamped && clamped > prev.startTimeMs) {
      prev.endTimeMs = clamped;
    }
  }

  if (idx < sorted.length - 1 && sorted[idx].endTimeMs <= clamped) {
    sorted[idx].endTimeMs = Math.max(clamped + 1, sorted[idx + 1].startTimeMs);
  }

  return finalizeLineEndTimes(sorted, songDurationMs);
};

export const nudgeLineStartMs = (
  lines: LyricLineInput[],
  lineIndex: number,
  deltaMs: number,
  songDurationMs?: number
): LyricLineInput[] => {
  const line = lines.find((l) => l.lineIndex === lineIndex);
  if (!line) return lines;
  return adjustLineStartMs(lines, lineIndex, line.startTimeMs + deltaMs, songDurationMs);
};

/** Active line for preview: last line where startTimeMs <= positionMs and positionMs < endTimeMs (or last line if at end). */
export const findActiveLineIndex = (lines: LyricLineInput[], positionMs: number): number => {
  if (lines.length === 0) return -1;

  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);
  let active = -1;

  for (let i = 0; i < sorted.length; i += 1) {
    if (positionMs >= sorted[i].startTimeMs) {
      active = sorted[i].lineIndex;
    }
    if (positionMs >= sorted[i].startTimeMs && positionMs < sorted[i].endTimeMs) {
      return sorted[i].lineIndex;
    }
  }

  return active;
};

export const formatMsClock = (ms: number): string => {
  const safe = Math.max(0, Math.round(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = safe % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
};

export const linesToPlainText = (lines: LyricLine[] | LyricLineInput[]): string =>
  [...lines]
    .sort((a, b) => a.lineIndex - b.lineIndex)
    .map((l) => l.text)
    .join('\n');

export const DEFAULT_LYRIC_LANGUAGES = ['en', 'fr'] as const;

export const languageLabel = (code: string, locale: string): string => {
  try {
    const display = new Intl.DisplayNames([locale], { type: 'language' });
    return display.of(code) ?? code;
  } catch {
    return code;
  }
};
