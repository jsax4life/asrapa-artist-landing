import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import {
  artistDisplayName,
  fetchLandingSpotlight,
  formatDuration,
  trackCoverUrl,
  type LandingSpotlight,
} from '@/lib/landing-spotlight';

const barHeights = [38, 62, 24, 80, 46, 92, 30, 70, 52, 86, 34, 64, 42, 76, 28, 58];

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {barHeights.map((height, i) => (
        <span
          key={i}
          className="w-full flex-1 origin-bottom rounded-full bg-gradient-to-t from-[#C40505]/50 to-[#C40505]"
          style={{
            height: `${height}%`,
            animation: `equalize ${0.32 + (i % 4) * 0.09}s ease-in-out ${i * 0.025}s infinite alternate`,
            animationPlayState: active ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}

export const PhonePlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [data, setData] = useState<LandingSpotlight | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLandingSpotlight()
      .then((spotlight) => {
        if (!cancelled) setData(spotlight);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [data?.currentTrack.songUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const track = data?.currentTrack;
  const duration = track?.duration ?? 0;
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="w-[220px] xs:w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] shrink-0">
      <div className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_4px_30px_rgba(196,5,5,0.2)]">
        <div className="relative aspect-square w-full bg-black">
          {track ? (
            <img
              src={trackCoverUrl(track)}
              alt={track.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-white/5" />
          )}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <p className="px-4 text-center text-xs text-white/60">
                Musique indisponible pour le moment.
              </p>
            </div>
          ) : null}
        </div>

        <div className="p-3">
          <p className="truncate text-sm font-bold text-white">
            {track?.title ?? ' '}
          </p>
          <p className="truncate text-xs text-white/50">
            {track ? artistDisplayName(track.artist) : ' '}
          </p>

          <div className="mt-3">
            <Waveform active={isPlaying} />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-white/50 tabular-nums">
            <span>{formatDuration(isPlaying ? currentTime : 0)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C40505] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={togglePlay}
            disabled={!track}
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
            className="mx-auto mt-3 grid size-10 place-items-center rounded-full bg-[#C40505] text-white transition-transform hover:scale-105 disabled:opacity-40"
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      {track?.songUrl ? (
        <audio ref={audioRef} src={track.songUrl} preload="metadata" className="hidden" />
      ) : null}
    </div>
  );
};

export default PhonePlayer;
