import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingDaisies from './components/FloatingDaisies';
import BirthdayCard from './components/BirthdayCard';
import DownloadButton from './components/DownloadButton';
import DaisyIcon from './components/DaisyIcon';

const UNLOCK_AT = 0; // disabled for testing — set to new Date('2026-06-21T01:00:00').getTime() to re-enable

const HYPE_MSGS = [
  { emoji: '🎉', text: "IT'S ALMOST TIME!!", sub: 'Something special is coming for you…' },
  { emoji: '🌼', text: 'GET READY COURTNEY!!', sub: 'The wait is nearly over!' },
  { emoji: '🥳', text: 'SO CLOSE NOW!!', sub: 'Tick tock, tick tock…' },
  { emoji: '✨', text: 'ALMOST THERE!!', sub: "Hold tight — it's worth it!" },
  { emoji: '🎂', text: 'THE MOMENT APPROACHES!!', sub: 'Are you excited? You should be!' },
  { emoji: '💛', text: 'KEEP WATCHING!!', sub: "Don't look away now…" },
  { emoji: '🚀', text: 'COUNTDOWN IS ON!!', sub: 'Something amazing is loading…' },
  { emoji: '🎊', text: "IT'S COMING!!", sub: 'Your birthday surprise awaits!' },
  { emoji: '🌙', text: 'MIDNIGHT MAGIC!!', sub: 'Just a little longer…' },
  { emoji: '⭐', text: 'STAR OF THE SHOW!!', sub: "This one's all for you, Courtney!" },
];

function getTimeLeft() {
  const diff = Math.max(0, UNLOCK_AT - Date.now());
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

type HypeMsg = { emoji: string; text: string; sub: string };

export default function App() {
  const [time, setTime] = useState(getTimeLeft);
  const [popup, setPopup] = useState<HypeMsg | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (time.done) return;
    let tid: ReturnType<typeof setTimeout>;
    const show = () => {
      const msg = HYPE_MSGS[Math.floor(Math.random() * HYPE_MSGS.length)];
      setPopup(msg);
      setTimeout(() => setPopup(null), 3800);
      tid = setTimeout(show, 22000 + Math.random() * 28000);
    };
    tid = setTimeout(show, 7000);
    return () => clearTimeout(tid);
  }, [time.done]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <FloatingDaisies />

      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.text}
            className="fixed top-5 left-1/2 z-50 -translate-x-1/2 bg-[var(--color-card)] rounded-2xl px-6 py-4 text-center [box-shadow:var(--shadow-card)] w-[min(300px,88vw)]"
            initial={{ opacity: 0, y: -28, scale: 0.84 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <div className="text-4xl mb-1.5">{popup.emoji}</div>
            <p className="font-[var(--font-display)] font-semibold text-[var(--color-terracotta)] text-[15px] leading-tight">
              {popup.text}
            </p>
            <p className="text-[12px] text-[var(--color-muted)] mt-1">{popup.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!time.done ? (
          <motion.div
            key="countdown"
            className="relative z-10 w-[min(380px,92vw)] flex flex-col items-center text-center gap-6 p-8 bg-[var(--color-card)] rounded-[20px] [box-shadow:var(--shadow-card)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <DaisyIcon size={72} petalFill="#F5C842" petalStroke="#D4B015" centerFill="#D4890A" centerInner="#B8720A" />

            <div>
              <p className="font-[var(--font-display)] italic text-[var(--color-terracotta)] text-[18px] mb-1">
                Something special is waiting for you 🌼
              </p>
              <p className="text-[12px] text-[var(--color-muted)]">
                Your card unlocks at 1am on June 21st
              </p>
            </div>

            <div className="flex items-end gap-2">
              {[
                { val: time.h, label: 'hrs' },
                { val: time.m, label: 'min' },
                { val: time.s, label: 'sec' },
              ].map(({ val, label }, i) => (
                <div key={label} className="flex items-end gap-2">
                  {i > 0 && (
                    <span className="text-[var(--color-gold-deep)] font-bold text-[32px] leading-[60px] pb-5">
                      :
                    </span>
                  )}
                  <div className="flex flex-col items-center">
                    <motion.div
                      key={val}
                      className="bg-[var(--color-bg)] text-[var(--color-gold)] font-mono font-bold text-[36px] leading-none w-[76px] h-[60px] flex items-center justify-center rounded-[10px]"
                      initial={{ scale: 1.12 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.18 }}
                    >
                      {pad(val)}
                    </motion.div>
                    <span className="text-[10px] text-[var(--color-muted)] mt-1.5 uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[var(--color-muted)] italic">
              This card is locked until 1am 🔒 — check back soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BirthdayCard name="Courtney" age={24} />
            <DownloadButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
