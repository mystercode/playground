import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

const TRACKS = [
  { artist: 'Jorja Smith',  song: 'Little Things', query: 'jorja smith little things' },
  { artist: 'Kaytranada',   song: 'Chances',     query: 'kaytranada chances'      },
  { artist: 'Orion Sun',    song: 'Smooth',      query: 'orion sun smooth'        },
] as const;

async function fetchPreview(query: string): Promise<string | null> {
  const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`;
  // In dev use the Vite proxy; in production use corsproxy.io to bypass CORS
  const url = import.meta.env.DEV
    ? `/deezer/search?q=${encodeURIComponent(query)}&limit=1`
    : `https://corsproxy.io/?${encodeURIComponent(deezerUrl)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data?.data?.[0]?.preview ?? null;
  } catch {
    return null;
  }
}

export default function VinylPlayer() {
  const [trackIdx, setTrackIdx]     = useState(0);
  // 'idle' → first tap selects artist → 'selected' → second tap plays → 'playing'
  const [tapState, setTapState]     = useState<'idle' | 'selected' | 'playing'>('idle');
  const [noteVisible, setNoteVisible] = useState(false);
  const [loading, setLoading]       = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSpinning = tapState === 'playing';

  /* ── Cleanup audio on unmount ── */
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  /* ── Smooth vinyl spin via rAF lerp ── */
  const rotate    = useMotionValue(0);
  const speedRef  = useRef(4);
  const targetRef = useRef(4);

  useEffect(() => { targetRef.current = isSpinning ? 1.2 : 4; }, [isSpinning]);

  useEffect(() => {
    let last = performance.now();
    let raf: number;
    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      speedRef.current += (targetRef.current - speedRef.current) * Math.min(dt * 2.5, 1);
      rotate.set((rotate.get() + (360 / speedRef.current) * dt) % 360);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotate]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  async function handleTap() {
    if (tapState === 'idle' || tapState === 'playing') {
      // Odd tap: stop current audio, advance artist
      stopAudio();
      const next = tapState === 'idle' ? trackIdx : (trackIdx + 1) % TRACKS.length;
      setTrackIdx(next);
      setTapState('selected');
      setNoteVisible(true);
      setTimeout(() => setNoteVisible(false), 1100);
    } else {
      // Even tap: fetch preview and play
      const track = TRACKS[trackIdx];
      setLoading(true);
      const previewUrl = await fetchPreview(track.query);
      setLoading(false);

      if (!previewUrl) return; // silently fail

      stopAudio();
      const audio = new Audio(previewUrl);
      audio.volume = 0.8;
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setTapState('selected');

      setTapState('playing');
      setNoteVisible(true);
      setTimeout(() => setNoteVisible(false), 1100);
    }
  }

  const track = TRACKS[trackIdx];
  const sublabel =
    loading         ? 'loading…' :
    tapState === 'idle'     ? TRACKS[0].artist :
    tapState === 'selected' ? track.artist :
                              `♪ ${track.song}`;

  return (
    <div className="relative flex-shrink-0 flex flex-col items-center gap-1">

      {/* "tap to play" hint */}
      <AnimatePresence>
        {tapState === 'selected' && !loading && (
          <motion.div
            className="absolute bottom-full mb-2 px-2 py-1 rounded-lg bg-[#18100A] text-[10px] text-white/80 whitespace-nowrap pointer-events-none"
            style={{ left: '50%', x: '-50%' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            tap to play ▶
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vinyl disc */}
      <div
        onClick={handleTap}
        role="button"
        aria-label={tapState === 'selected' ? `Play ${track.song}` : 'Select track'}
        className="cursor-pointer touch-manipulation select-none"
      >
        <motion.div style={{ rotate }} className="hover:brightness-110 transition-[filter] duration-200">
          <svg viewBox="0 0 100 100" width="72" height="72" aria-hidden="true">
            <circle cx={50} cy={50} r={49} fill="#18100A" />
            {[44, 38, 32, 26, 20].map(r => (
              <circle key={r} cx={50} cy={50} r={r} fill="none"
                stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
            ))}
            {tapState !== 'idle' && (
              <circle cx={50} cy={50} r={49} fill="none"
                stroke={tapState === 'playing' ? 'rgba(245,200,66,0.4)' : 'rgba(245,200,66,0.15)'}
                strokeWidth={2} />
            )}
            <circle cx={50} cy={50} r={15} fill="#7C4A2D" />
            {/* loading spinner dot */}
            {loading && <circle cx={50} cy={35} r={3} fill="rgba(245,200,66,0.8)" />}
            <circle cx={50} cy={50} r={3} fill="#18100A" />
          </svg>
        </motion.div>
      </div>

      {/* Label */}
      <p className="text-[10px] text-[var(--color-muted)] tracking-wide max-w-[80px] text-center leading-tight truncate">
        {sublabel}
      </p>

      {/* Bobbing hint — only shown before first interaction */}
      <AnimatePresence>
        {tapState === 'idle' && (
          <motion.div
            className="flex flex-col items-center gap-0.5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.4 } }}
          >
            <p className="text-[11px] font-semibold text-[var(--color-btn)] tracking-wide text-center whitespace-nowrap">
              click me twice
            </p>
            <motion.span
              className="text-[22px] leading-none"
              style={{ color: 'var(--color-btn)' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
            >
              ↑
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating music note */}
      <AnimatePresence>
        {noteVisible && (
          <motion.span
            className="absolute -top-1 -right-2 text-lg text-[var(--color-terracotta)] pointer-events-none"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -28, opacity: 0 }}
            exit={{}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            ♪
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
