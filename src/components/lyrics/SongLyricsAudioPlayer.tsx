import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  memo,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatMsClock } from '@/lib/lyrics/utils';

export interface SongLyricsAudioPlayerHandle {
  getPositionMs: () => number;
  getDurationMs: () => number;
  play: () => Promise<void>;
  pause: () => void;
  seekMs: (ms: number) => void;
  isPlaying: () => boolean;
}

interface SongLyricsAudioPlayerProps {
  songUrl: string;
  durationSec?: number;
  /** When set, called on timeupdate (e.g. preview). Omit in sync editor to avoid parent re-renders. */
  onPositionMsChange?: (positionMs: number) => void;
  className?: string;
}

const PositionClock = memo(function PositionClock({ ms }: { ms: number }) {
  return (
    <span className="text-sm tabular-nums text-muted-foreground min-w-[100px]">
      {formatMsClock(ms)}
    </span>
  );
});

export const SongLyricsAudioPlayer = forwardRef<SongLyricsAudioPlayerHandle, SongLyricsAudioPlayerProps>(
  function SongLyricsAudioPlayer({ songUrl, durationSec, onPositionMsChange, className }, ref) {
    const { t } = useTranslation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const onPositionRef = useRef(onPositionMsChange);
    const [playing, setPlaying] = useState(false);
    const [positionMs, setPositionMs] = useState(0);
    const [durationMs, setDurationMs] = useState(
      durationSec ? Math.round(durationSec * 1000) : 0
    );

    useEffect(() => {
      onPositionRef.current = onPositionMsChange;
    }, [onPositionMsChange]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onTimeUpdate = () => {
        const ms = Math.round(audio.currentTime * 1000);
        setPositionMs(ms);
        onPositionRef.current?.(ms);
      };

      const onLoadedMetadata = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDurationMs(Math.round(audio.duration * 1000));
        }
      };

      const onEnded = () => {
        setPlaying(false);
      };

      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
      };
    }, [songUrl]);

    useImperativeHandle(ref, () => ({
      getPositionMs: () => {
        const audio = audioRef.current;
        return audio ? Math.round(audio.currentTime * 1000) : positionMs;
      },
      getDurationMs: () => {
        const audio = audioRef.current;
        if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
          return Math.round(audio.duration * 1000);
        }
        return durationMs;
      },
      play: async () => {
        const audio = audioRef.current;
        if (!audio) return;
        await audio.play();
        setPlaying(true);
      },
      pause: () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setPlaying(false);
      },
      seekMs: (ms: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.max(0, ms) / 1000;
        const rounded = Math.round(audio.currentTime * 1000);
        setPositionMs(rounded);
        onPositionRef.current?.(rounded);
      },
      isPlaying: () => playing,
    }));

    const togglePlay = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        audio.pause();
        setPlaying(false);
        return;
      }
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }, [playing]);

    const maxMs = durationMs > 0 ? durationMs : Math.max(positionMs, 1);

    return (
      <div className={className}>
        <audio ref={audioRef} src={songUrl} preload="metadata" className="hidden" />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={togglePlay}
            aria-label={playing ? t('lyricsPage.player.pause') : t('lyricsPage.player.play')}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <PositionClock ms={positionMs} />
          <Slider
            className="flex-1"
            value={[positionMs]}
            min={0}
            max={maxMs}
            step={1}
            aria-label={t('lyricsPage.player.seek')}
            onValueChange={([value]) => {
              const audio = audioRef.current;
              if (!audio) return;
              audio.currentTime = value / 1000;
              setPositionMs(value);
              onPositionRef.current?.(value);
            }}
          />
          <span className="text-sm tabular-nums text-muted-foreground min-w-[100px] text-right">
            {formatMsClock(maxMs)}
          </span>
        </div>
      </div>
    );
  }
);
