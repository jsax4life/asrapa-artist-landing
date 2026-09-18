import { Lyric, LyricLine, LyricLineInput } from './types';

const toId = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.$oid === 'string') return obj.$oid;
  }
  return fallback;
};

const toMs = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }
  return 0;
};

export const mapLyricLine = (raw: unknown, fallbackIndex: number): LyricLine => {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const lineIndex =
    typeof record.lineIndex === 'number'
      ? record.lineIndex
      : fallbackIndex;

  return {
    id: toId(record.id ?? record._id, `line-${lineIndex}`),
    lineIndex,
    text: String(record.text ?? ''),
    startTimeMs: toMs(record.startTimeMs),
    endTimeMs: toMs(record.endTimeMs),
  };
};

export const mapLyric = (raw: unknown, fallbackSongId: string): Lyric => {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const linesRaw = Array.isArray(record.lines) ? record.lines : [];
  const lines = linesRaw
    .map((line, index) => mapLyricLine(line, index))
    .sort((a, b) => a.lineIndex - b.lineIndex);

  const moderation =
    record.moderation && typeof record.moderation === 'object'
      ? (record.moderation as Record<string, unknown>)
      : undefined;

  return {
    id: toId(record.id ?? record._id, ''),
    songId: String(record.songId ?? fallbackSongId),
    language: String(record.language ?? ''),
    plainText: String(record.plainText ?? record.text ?? ''),
    isSynced: Boolean(record.isSynced),
    status: String(record.status ?? 'pending'),
    lines,
    moderationComment:
      typeof record.moderationComment === 'string'
        ? record.moderationComment
        : typeof moderation?.comment === 'string'
          ? moderation.comment
          : typeof moderation?.rejectionReason === 'string'
            ? moderation.rejectionReason
            : undefined,
    createdAt: String(record.createdAt ?? ''),
    updatedAt: String(record.updatedAt ?? ''),
  };
};

export const mapLyricsList = (payload: unknown, songId: string): Lyric[] => {
  if (!payload || typeof payload !== 'object') return [];

  const root = payload as Record<string, unknown>;
  const data = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;

  if (Array.isArray(data.lyrics)) {
    return data.lyrics.map((item) => mapLyric(item, songId)).filter((l) => l.language);
  }

  if (data.lyric) {
    const lyric = mapLyric(data.lyric, songId);
    return lyric.language ? [lyric] : [];
  }

  if (Array.isArray(data)) {
    return data.map((item) => mapLyric(item, songId)).filter((l) => l.language);
  }

  if (data.language || data.plainText !== undefined) {
    const lyric = mapLyric(data, songId);
    return lyric.language ? [lyric] : [];
  }

  return [];
};

export const toLyricLineInputs = (lines: LyricLine[]): LyricLineInput[] =>
  lines.map(({ lineIndex, text, startTimeMs, endTimeMs }) => ({
    lineIndex,
    text,
    startTimeMs,
    endTimeMs,
  }));
