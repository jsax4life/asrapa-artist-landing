import { ApiError } from '@/lib/api';

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
