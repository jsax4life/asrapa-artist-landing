export type LyricStatus = 'pending' | 'approved' | 'rejected' | string;

export interface LyricLine {
  id: string;
  lineIndex: number;
  text: string;
  startTimeMs: number;
  endTimeMs: number;
}

export interface Lyric {
  id: string;
  songId: string;
  language: string;
  plainText: string;
  isSynced: boolean;
  status: LyricStatus;
  lines: LyricLine[];
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LyricLineInput {
  lineIndex: number;
  text: string;
  startTimeMs: number;
  endTimeMs: number;
}

export interface CreateLyricPayload {
  language: string;
  plainText: string;
  isSynced: boolean;
  lines?: LyricLineInput[];
}

export type UpdateLyricPayload = CreateLyricPayload;

export interface SongLyricsContext {
  songId: string;
  title: string;
  songUrl: string;
  durationSec?: number;
  artwork?: string;
}
