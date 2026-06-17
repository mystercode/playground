import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WISHES = [
  "May every song you love find you at exactly the right moment.",
  "A year full of the kind of mornings that feel like a warm exhale.",
  "May someone make you laugh so hard you can't catch your breath, at least once a week.",
  "Wishing you the courage to say yes to the things that scare you just a little.",
  "May this be the year you finally give yourself credit for how far you've come.",
  "Wishing you slow Sundays, good playlists, and people who really get you.",
  "May every room you walk into feel a little more alive because you're there.",
];

const STUB_COLORS = ['#C4724C', '#D4890A', '#7C4A2D', '#C4892D', '#E8816A', '#9A7B6E', '#B8720A'];

function wrapText(text: string, max = 33): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > max) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ── Jar SVG ── */
function JarSVG({ remaining, pulling }: { remaining: number; pulling: boolean }) {
  const hasSlips = remaining > 0 && !pulling;
  return (
    <svg viewBox="0 0 120 155" width="180" height="233" aria-label="Wish jar">
      <defs>
        <radialGradient id="jarGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FDEEC3" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>
        <clipPath id="jarClip">
          <rect x="10" y="44" width="100" height="100" rx="14" />
        </clipPath>
      </defs>

      {/* Paper slips peeking above lid when wishes remain */}
      <AnimatePresence>
        {hasSlips && (
          <motion.g
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 6, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <rect x="36" y="20" width="15" height="12" rx="2" fill="#FAD9A1" transform="rotate(-10 36 20)" />
            <rect x="68" y="18" width="13" height="11" rx="2" fill="#F9C4A8" transform="rotate(8 68 18)" />
            {remaining > 2 && (
              <rect x="52" y="16" width="14" height="10" rx="2" fill="#FDEEC3" transform="rotate(-2 52 16)" />
            )}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Lid knob */}
      <rect x="48" y="5" width="24" height="10" rx="5" fill="#D4A040" />
      {/* Lid */}
      <rect x="16" y="13" width="88" height="20" rx="7" fill="#C4892D" />
      {/* Lid shine */}
      <rect x="20" y="15" width="18" height="9" rx="4.5" fill="rgba(255,255,255,0.28)" />
      {/* Lid bottom rim */}
      <rect x="20" y="30" width="80" height="5" rx="2" fill="rgba(0,0,0,0.08)" />

      {/* Neck */}
      <rect x="26" y="33" width="68" height="14" rx="4"
        fill="rgba(250,247,242,0.82)" stroke="#D4B88A" strokeWidth="1.5" />

      {/* Jar body */}
      <rect x="10" y="44" width="100" height="100" rx="14"
        fill="rgba(250,247,242,0.85)" stroke="#D4B88A" strokeWidth="1.5" />
      {/* Glass glow */}
      <rect x="10" y="44" width="100" height="100" rx="14" fill="url(#jarGlow)" />
      {/* Left shine */}
      <rect x="17" y="54" width="11" height="72" rx="5.5" fill="rgba(255,255,255,0.42)" />
      {/* Top-right glint */}
      <ellipse cx="92" cy="60" rx="7" ry="3.5" fill="rgba(255,255,255,0.28)" transform="rotate(-18 92 60)" />

      {/* Label */}
      <rect x="20" y="82" width="80" height="42" rx="6" fill="rgba(255,255,255,0.75)" stroke="#E8D5B7" strokeWidth="1" />
      <text x="60" y="100" textAnchor="middle" fontSize="8.5" fill="#9A7B6E"
        fontFamily="Georgia, serif" fontStyle="italic">birthday</text>
      <text x="60" y="113" textAnchor="middle" fontSize="8.5" fill="#9A7B6E"
        fontFamily="Georgia, serif" fontStyle="italic">wishes</text>

      {/* Remaining count badge */}
      {remaining > 0 && (
        <g>
          <circle cx="60" cy="138" r="9" fill="#C4724C" opacity="0.9" />
          <text x="60" y="142" textAnchor="middle" fontSize="9" fill="white"
            fontFamily="Inter, system-ui" fontWeight="600">{remaining}</text>
        </g>
      )}
      {remaining === 0 && (
        <text x="60" y="142" textAnchor="middle" fontSize="7.5" fill="#9A7B6E"
          fontFamily="Georgia, serif" fontStyle="italic">all gone 🌼</text>
      )}
    </svg>
  );
}

/* ── Ticket SVG ── */
function WishTicket({ wish, colorIdx }: { wish: string; colorIdx: number }) {
  const stub = STUB_COLORS[colorIdx % STUB_COLORS.length];
  const lines = wrapText(wish, 33);
  const tH = Math.max(100, 50 + lines.length * 19 + 14);

  const displayLines = lines.map((l, i) =>
    lines.length === 1 ? `"${l}"` : i === 0 ? `"${l}` : i === lines.length - 1 ? `${l}"` : l
  );

  return (
    <svg viewBox={`0 0 320 ${tH}`} width="100%" aria-label="Birthday wish ticket">
      {/* Drop shadow */}
      <rect x="5" y="7" width="312" height={tH - 10} rx="8" fill="rgba(44,24,16,0.12)" />

      {/* Stub */}
      <rect x="2" y="2" width="54" height={tH - 4} rx="8" fill={stub} />
      {/* Stub inner shine */}
      <rect x="6" y="10" width="10" height={tH - 28} rx="5" fill="rgba(255,255,255,0.18)" />

      {/* Main body */}
      <rect x="54" y="2" width="264" height={tH - 4} rx="8" fill="#FAF7F2" />

      {/* Full border */}
      <rect x="2" y="2" width="316" height={tH - 4} rx="8" fill="none" stroke="#E8D5B7" strokeWidth="1.5" />

      {/* Perforation dashes */}
      <line x1="56" y1="2" x2="56" y2={tH - 2}
        stroke="white" strokeWidth="3" strokeDasharray="5 4" opacity="0.65" />

      {/* Semicircle punches */}
      <circle cx="2"   cy={tH / 2} r="8" fill="#1A110A" />
      <circle cx="318" cy={tH / 2} r="8" fill="#1A110A" />

      {/* Stub text (rotated) */}
      <text
        x="29" y={tH / 2}
        textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="1.5" opacity="0.9"
        transform={`rotate(-90 29 ${tH / 2})`}
      >
        BIRTHDAY WISH
      </text>

      {/* Header */}
      <text x="186" y="22" textAnchor="middle" fontSize="7" fill="#9A7B6E"
        fontFamily="Inter, system-ui" letterSpacing="2.5">
        ✿ COURTNEY'S 24TH ✿
      </text>
      <line x1="66" y1="29" x2="308" y2="29" stroke="#E8D5B7" strokeWidth="0.8" />

      {/* Wish lines */}
      {displayLines.map((l, i) => (
        <text key={i} x="186" y={45 + i * 19} textAnchor="middle"
          fontSize="12" fill="#5C3D2E" fontFamily="Georgia, serif" fontStyle="italic">
          {l}
        </text>
      ))}

      {/* Bottom rule */}
      <line x1="66" y1={tH - 14} x2="308" y2={tH - 14} stroke="#E8D5B7" strokeWidth="0.8" />
    </svg>
  );
}

/* ── WishJarView ── */
interface WishJarViewProps { onBack: () => void; }

export default function WishJarView({ onBack }: WishJarViewProps) {
  const [shuffled]  = useState(() => [...WISHES].sort(() => Math.random() - 0.5));
  const [idx, setIdx]                   = useState(0);
  const [currentWish, setCurrentWish]   = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState(0);
  const [pulling, setPulling]           = useState(false);
  const done = idx >= shuffled.length;

  function pull() {
    if (pulling || done) return;
    setPulling(true);
    const wish = shuffled[idx];
    const ci   = idx;
    setIdx(i => i + 1);
    setTimeout(() => {
      setCurrentWish(wish);
      setCurrentColor(ci);
      setPulling(false);
    }, 450);
  }

  const remaining = shuffled.length - idx;

  return (
    <div className="flex flex-col gap-3 p-6 bg-[var(--color-card)] rounded-[20px] [box-shadow:var(--shadow-card)]">

      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="text-[12px] text-[var(--color-muted)] hover:text-[var(--color-terracotta)] transition-colors"
          aria-label="Back to card"
        >
          ← back
        </button>
        <p className="flex-1 text-center font-[var(--font-display)] italic text-[17px] text-[var(--color-text-primary)] pr-8">
          Make a wish
        </p>
      </div>

      {/* Jar — breathing when idle, wobble when pulling */}
      <div className="flex justify-center">
        <motion.div
          onClick={!done ? pull : undefined}
          role={!done ? 'button' : undefined}
          aria-label={done ? 'No more wishes' : 'Pull a wish from the jar'}
          className={`select-none touch-manipulation ${done ? 'cursor-default' : 'cursor-pointer'}`}
          animate={
            pulling
              ? { rotate: [-7, 7, -5, 4, -2, 0] }
              : done
              ? {}
              : { scale: [1, 1.04, 1] }
          }
          transition={
            pulling
              ? { duration: 0.45, ease: 'easeInOut' }
              : { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
          }
          whileTap={done ? {} : { scale: 0.93 }}
        >
          <JarSVG remaining={remaining} pulling={pulling} />
        </motion.div>
      </div>

      {/* Hint / status */}
      <div className="flex justify-center" style={{ minHeight: 18 }}>
        <AnimatePresence mode="wait">
          {pulling ? (
            <motion.p key="pulling"
              className="text-[11px] italic text-[var(--color-terracotta)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              pulling your wish…
            </motion.p>
          ) : done ? (
            <motion.p key="done"
              className="text-[11px] text-[var(--color-muted)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              all wishes claimed 🌼
            </motion.p>
          ) : (
            <motion.p key="hint"
              className="text-[11px] italic text-[var(--color-muted)]"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
              {currentWish ? 'tap again for another →' : 'tap the jar for a wish ✨'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Ticket reveal */}
      <AnimatePresence mode="wait">
        {currentWish && (
          <motion.div
            key={currentWish}
            initial={{ y: -70, scaleY: 0.06, opacity: 0, rotate: -6 }}
            animate={{ y: 0,   scaleY: 1,    opacity: 1, rotate: 0  }}
            exit={{   y: 12,               opacity: 0,             }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            style={{ transformOrigin: 'top center' }}
          >
            <WishTicket wish={currentWish} colorIdx={currentColor} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
