import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VinylPlayer from './VinylPlayer';

const CANDLE_COUNT = 6;

const TRACK_LYRICS = [
  '"It\'s the little things that gets me high." — Jorja Smith, Little Things',
  '"Take your chances, take your time — it\'s all yours." — Kaytranada, Chances',
  '"Stay smooth, let the music carry you." — Orion Sun, Smooth',
] as const;

const LINES: Array<string | ((n: string) => string)> = [
  (n: string) => `Dear ${n},`,
  'Twenty-four years of you — every one of them a gift.',
  'May this year bring you the music that moves you,',
  'the quiet you need, and every small thing that makes you feel fully alive.',
];

/* ── Candle (now lights up, not blows out) ── */
interface CandleProps { lit: boolean; small?: boolean; }

function Candle({ lit, small }: CandleProps) {
  const h = small ? 16 : 26;
  const fw = small ? 7 : 10;
  const fh = small ? 11 : 16;

  return (
    <div
      aria-label={lit ? 'Candle lit' : 'Candle unlit'}
      className={`flex flex-col items-center transition-opacity duration-500${lit ? '' : ' opacity-40'}`}
      style={{ minWidth: small ? 18 : 28, minHeight: small ? 28 : 44 }}
    >
      {/* flame wrapper */}
      <div style={{ width: fw, height: fh, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <AnimatePresence>
          {lit && (
            <motion.div
              className="candle-flame"
              style={{ width: fw, height: fh }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />
          )}
        </AnimatePresence>
      </div>
      {/* wick */}
      <div style={{ width: 2, height: small ? 3 : 5, background: '#6B4030', borderRadius: 1 }} />
      {/* body */}
      <div style={{
        width: small ? 7 : 10,
        height: h,
        background: 'linear-gradient(to right, #FAF7F2 35%, #E4D8CC)',
        borderRadius: '2px 2px 1px 1px',
        boxShadow: lit
          ? 'inset -2px 0 4px rgba(0,0,0,0.08), 0 0 8px rgba(245,168,35,0.35)'
          : 'inset -2px 0 4px rgba(0,0,0,0.08)',
      }} />
    </div>
  );
}

/* ── Birthday Cake SVG ── */
function BirthdayCake() {
  // viewBox 0 0 140 115 — candles at top, two tiers, daisy on side
  const candleXs = [30, 44, 58, 72, 86, 100];

  return (
    <svg viewBox="0 0 140 115" width="140" height="115" aria-label="Birthday cake" role="img">
      {/* shadow */}
      <ellipse cx="70" cy="110" rx="58" ry="7" fill="rgba(0,0,0,0.10)" />

      {/* ── Top tier ── */}
      <rect x="24" y="30" width="92" height="38" rx="5" fill="#E8816A" />
      {/* frosting strip */}
      <rect x="24" y="30" width="92" height="13" rx="5" fill="white" opacity="0.90" />
      <rect x="24" y="37" width="92" height="6" fill="white" opacity="0.90" />
      {/* frosting drips (teardrop blobs) */}
      {[36, 56, 76, 102].map(cx => (
        <ellipse key={cx} cx={cx} cy={47} rx="5" ry="8" fill="white" opacity="0.82" />
      ))}

      {/* ── Bottom tier ── */}
      <rect x="8" y="62" width="124" height="44" rx="5" fill="#D4890A" />
      {/* frosting strip */}
      <rect x="8" y="62" width="124" height="13" rx="5" fill="white" opacity="0.90" />
      <rect x="8" y="69" width="124" height="6" fill="white" opacity="0.90" />
      {/* frosting drips */}
      {[22, 46, 70, 95, 118].map(cx => (
        <ellipse key={cx} cx={cx} cy={79} rx="5" ry="9" fill="white" opacity="0.82" />
      ))}

      {/* ── Tiny daisy on bottom tier side ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r = 6;
        return (
          <ellipse
            key={i}
            cx={112 + Math.cos(a) * r}
            cy={86 + Math.sin(a) * r}
            rx={2.5} ry={5}
            fill="white" opacity={0.75}
            transform={`rotate(${(i / 8) * 360}, ${112 + Math.cos(a) * r}, ${86 + Math.sin(a) * r})`}
          />
        );
      })}
      <circle cx={112} cy={86} r={4} fill="#F5D16A" />

      {/* ── 6 lit candles on top tier ── */}
      {candleXs.map(x => (
        <g key={x}>
          {/* flame */}
          <ellipse cx={x} cy={18} rx={3.5} ry={6}
            fill="url(#flame)" opacity={0.95} />
          {/* wick */}
          <line x1={x} y1={23} x2={x} y2={26} stroke="#6B4030" strokeWidth={1.5} />
          {/* body */}
          <rect x={x - 3} y={26} width={6} height={10} rx={1}
            fill="#FAF7F2" stroke="#E4D8CC" strokeWidth={0.5} />
        </g>
      ))}

      {/* Flame gradient */}
      <defs>
        <radialGradient id="flame" cx="50%" cy="80%" r="60%">
          <stop offset="0%"  stopColor="#F5C842" />
          <stop offset="60%" stopColor="#F0883A" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── CardInside ── */
interface CardInsideProps {
  name: string;
  age: number;
  onAllOut?: () => void;
  onOpenWishes?: () => void;
}

export default function CardInside({ name, onAllOut, onOpenWishes }: CardInsideProps) {
  const [lit, setLit]             = useState<Set<number>>(new Set());
  const [cakeVisible, setCakeVisible] = useState(false);
  const [lyric, setLyric]         = useState<string>(TRACK_LYRICS[0]);
  const allOutFired = useRef(false);

  const allLit = lit.size === CANDLE_COUNT;

  /* Light candles sequentially — 1s delay, 600ms apart */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < CANDLE_COUNT; i++) {
      timers.push(setTimeout(() => {
        setLit(prev => new Set(prev).add(i));
      }, 1000 + i * 600));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  /* When all lit → cake reveal → confetti */
  useEffect(() => {
    if (allLit && !allOutFired.current) {
      allOutFired.current = true;
      setTimeout(() => {
        setCakeVisible(true);
        onAllOut?.();
      }, 600);
    }
  }, [allLit, onAllOut]);

  return (
    <div className="flex flex-col gap-4 p-7 bg-[var(--color-card)] rounded-[20px] [box-shadow:var(--shadow-card)]">

      {/* Staggered text reveal */}
      <div className="flex flex-col gap-1.5">
        {LINES.map((line, i) => (
          <motion.p
            key={i}
            className={i === 0
              ? 'font-[var(--font-display)] italic text-[15px] text-[var(--color-terracotta)]'
              : 'text-[13px] leading-relaxed text-[var(--color-text-body)]'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 22 }}
          >
            {typeof line === 'function' ? line(name) : line}
          </motion.p>
        ))}
      </div>

      {/* Candles → Cake transition */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[11px] uppercase tracking-widest text-[var(--color-muted)]">
          {cakeVisible ? 'Happy birthday! 🎂' : allLit ? 'All lit! 🎂' : 'Lighting your candles…'}
        </p>

        <div className="relative flex items-center justify-center" style={{ minHeight: 68 }}>
          <AnimatePresence mode="wait">
            {!cakeVisible ? (
              <motion.div
                key="candles"
                className="flex items-end gap-2.5"
                exit={{ scale: 0.6, opacity: 0, y: -10, transition: { duration: 0.4 } }}
              >
                {Array.from({ length: CANDLE_COUNT }, (_, i) => (
                  <Candle key={i} lit={lit.has(i)} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="cake"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <BirthdayCake />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vinyl + Lyric */}
      <div className="flex items-center gap-3.5">
        <VinylPlayer onTrackChange={idx => setLyric(TRACK_LYRICS[idx])} />
        <blockquote className="flex-1 border-l-2 border-[var(--color-daisy-ctr)] pl-3">
          <motion.p
            key={lyric}
            className="font-[var(--font-display)] italic text-[12px] leading-relaxed text-[var(--color-muted)]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {lyric}
          </motion.p>
        </blockquote>
      </div>

      {/* Wishes button — breathing pulse */}
      <motion.button
        onClick={onOpenWishes}
        className="self-center bg-[var(--color-btn)] text-[var(--color-cream)] rounded-full px-8 py-3 text-[14px] font-medium tracking-wide"
        animate={{
          scale: [1, 1.055, 1],
          boxShadow: [
            '0 4px 14px rgba(124,74,45,0.30)',
            '0 6px 24px rgba(124,74,45,0.58)',
            '0 4px 14px rgba(124,74,45,0.30)',
          ],
        }}
        transition={{ repeat: Infinity, duration: 2.3, ease: 'easeInOut' }}
        whileHover={{ scale: 1.10 }}
        whileTap={{ scale: 0.94 }}
      >
        ✨ Wishes
      </motion.button>

    </div>
  );
}
