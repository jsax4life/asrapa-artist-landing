import React, { useMemo, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { LyricLineInput } from '@/lib/lyrics/types';
import {
  applySyncAtLine,
  finalizeLineEndTimes,
  formatMsClock,
  nudgeLineStartMs,
  validateSyncedLines,
} from '@/lib/lyrics/utils';
import {
  SongLyricsAudioPlayer,
  SongLyricsAudioPlayerHandle,
} from '@/components/lyrics/SongLyricsAudioPlayer';

interface LyricsSyncEditorProps {
  songTitle: string;
  songUrl: string;
  durationSec?: number;
  lines: LyricLineInput[];
  onLinesChange: (lines: LyricLineInput[]) => void;
  onSave: (lines: LyricLineInput[]) => void;
  onPreview: (lines: LyricLineInput[]) => void;
  isSaving?: boolean;
}

const CurrentLinePanel = memo(function CurrentLinePanel({
  lineText,
  lineNumber,
  totalLines,
  startTimeMs,
}: {
  lineText: string;
  lineNumber: number;
  totalLines: number;
  startTimeMs: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <div className="text-sm text-muted-foreground mb-1">{t('lyricsPage.sync.currentLyric')}</div>
        <p className="text-lg font-medium text-foreground">&ldquo;{lineText}&rdquo;</p>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {t('lyricsPage.sync.lineProgress', { current: lineNumber, total: totalLines })}
      </p>
      <p className="text-xs text-muted-foreground text-center">
        {t('lyricsPage.sync.lineStart')}: {formatMsClock(startTimeMs)}
      </p>
    </div>
  );
});

export function LyricsSyncEditor({
  songTitle,
  songUrl,
  durationSec,
  lines,
  onLinesChange,
  onSave,
  onPreview,
  isSaving,
}: LyricsSyncEditorProps) {
  const { t } = useTranslation();
  const playerRef = useRef<SongLyricsAudioPlayerHandle>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sortedLines = useMemo(
    () => [...lines].sort((a, b) => a.lineIndex - b.lineIndex),
    [lines]
  );

  const currentLine = sortedLines.find((l) => l.lineIndex === currentLineIndex) ?? sortedLines[0];
  const displayIndex = sortedLines.findIndex((l) => l.lineIndex === currentLine?.lineIndex);

  const syncCurrentLine = () => {
    const player = playerRef.current;
    if (!player || !currentLine) return;

    const durationMs = player.getDurationMs();
    const { lines: updated, nextLineIndex } = applySyncAtLine(
      sortedLines,
      currentLine.lineIndex,
      player.getPositionMs(),
      durationMs > 0 ? durationMs : undefined
    );
    onLinesChange(updated);
    if (nextLineIndex !== null) {
      setCurrentLineIndex(nextLineIndex);
    }
  };

  const goPrevious = () => {
    if (displayIndex <= 0) return;
    setCurrentLineIndex(sortedLines[displayIndex - 1].lineIndex);
  };

  const goNext = () => {
    if (displayIndex < 0 || displayIndex >= sortedLines.length - 1) return;
    setCurrentLineIndex(sortedLines[displayIndex + 1].lineIndex);
  };

  const handleSave = () => {
    const durationMs = playerRef.current?.getDurationMs();
    const finalized = finalizeLineEndTimes(sortedLines, durationMs && durationMs > 0 ? durationMs : undefined);
    const validation = validateSyncedLines(finalized, durationMs && durationMs > 0 ? durationMs : undefined);
    setValidationErrors(validation.errors);
    if (!validation.valid) return;
    onSave(finalized);
  };

  const nudgeStart = (deltaMs: number) => {
    if (!currentLine) return;
    const durationMs = playerRef.current?.getDurationMs();
    const updated = nudgeLineStartMs(
      sortedLines,
      currentLine.lineIndex,
      deltaMs,
      durationMs && durationMs > 0 ? durationMs : undefined
    );
    onLinesChange(updated);
  };

  if (sortedLines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t('lyricsPage.sync.noLines')}</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{songTitle}</h3>
        <p className="text-sm text-muted-foreground">{t('lyricsPage.sync.subtitle')}</p>
      </div>

      <SongLyricsAudioPlayer ref={playerRef} songUrl={songUrl} durationSec={durationSec} />

      {currentLine ? (
        <CurrentLinePanel
          lineText={currentLine.text}
          lineNumber={displayIndex >= 0 ? displayIndex + 1 : 0}
          totalLines={sortedLines.length}
          startTimeMs={currentLine.startTimeMs}
        />
      ) : null}

      <Button
        type="button"
        className="w-full"
        onClick={syncCurrentLine}
        disabled={isSaving}
        aria-label={t('lyricsPage.sync.syncCurrentLine')}
      >
        {t('lyricsPage.sync.syncCurrentLine')}
      </Button>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goPrevious}
          disabled={displayIndex <= 0 || isSaving}
          aria-label={t('lyricsPage.sync.previous')}
        >
          {t('lyricsPage.sync.previous')}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goNext}
          disabled={displayIndex < 0 || displayIndex >= sortedLines.length - 1 || isSaving}
          aria-label={t('lyricsPage.sync.next')}
        >
          {t('lyricsPage.sync.next')}
        </Button>
      </div>

      {currentLine ? (
        <div className="space-y-2">
          <Label>{t('lyricsPage.sync.startTime')}</Label>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm bg-muted px-2 py-1 rounded">{formatMsClock(currentLine.startTimeMs)}</code>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => nudgeStart(-100)}
              disabled={isSaving}
              aria-label={t('lyricsPage.sync.minusTenth')}
            >
              {t('lyricsPage.sync.minusTenth')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => nudgeStart(100)}
              disabled={isSaving}
              aria-label={t('lyricsPage.sync.plusTenth')}
            >
              {t('lyricsPage.sync.plusTenth')}
            </Button>
          </div>
        </div>
      ) : null}

      {validationErrors.length > 0 ? (
        <ul className="text-sm text-destructive list-disc pl-5 space-y-1" role="alert">
          {validationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => onPreview(sortedLines)} disabled={isSaving}>
          {t('lyricsPage.sync.preview')}
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving} aria-busy={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('lyricsPage.saving')}
            </>
          ) : (
            t('lyricsPage.sync.save')
          )}
        </Button>
      </div>
    </div>
  );
}
