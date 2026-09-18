import { ApiError } from '@/lib/api';

/** 404 when no lyrics doc exists yet — safe to treat as an empty list for owners. */
export const isLyricsNotFound404 = (error: unknown): boolean => {
  if (!(error instanceof ApiError) || error.status !== 404) return false;
  const message = getLyricsApiErrorMessage(error, '').toLowerCase();
  return message.includes('lyrics not found');
};

export const getLyricsApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    const data = error.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      if (typeof record.message === 'string' && record.message.trim()) return record.message;
      if (Array.isArray(record.errors) && record.errors.length > 0) {
        return record.errors.map(String).join(' ');
      }
    }
    if (error.message.trim()) return error.message;
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};
