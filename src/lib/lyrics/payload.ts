import { CreateLyricPayload, LyricLineInput } from './types';

/** Backend contract: language, plainText, isSynced; lines only when synced (no extra fields). */
export const buildLyricsSavePayload = (
  language: string,
  plainText: string,
  isSynced: boolean,
  lines?: LyricLineInput[]
): CreateLyricPayload => {
  const normalizedLanguage = language.trim().toLowerCase();
  const normalizedPlainText = plainText.trim();

  if (!isSynced) {
    return {
      language: normalizedLanguage,
      plainText: normalizedPlainText,
      isSynced: false,
    };
  }

  const sorted = [...(lines ?? [])].sort((a, b) => a.lineIndex - b.lineIndex);

  return {
    language: normalizedLanguage,
    plainText: normalizedPlainText,
    isSynced: true,
    lines: sorted.map(({ lineIndex, text, startTimeMs, endTimeMs }) => ({
      lineIndex,
      text,
      startTimeMs: Math.round(startTimeMs),
      endTimeMs: Math.round(endTimeMs),
    })),
  };
};
