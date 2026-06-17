import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingDaisies from './components/FloatingDaisies';
import BirthdayCard from './components/BirthdayCard';
import DownloadButton from './components/DownloadButton';
import DaisyIcon from './components/DaisyIcon';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput]       = useState('');
  const [error, setError]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === 'Fry') {
      setUnlocked(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <FloatingDaisies />
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="gate"
            className="relative z-10 w-[min(360px,90vw)] flex flex-col items-center text-center gap-5 p-8 bg-[var(--color-card)] rounded-[20px] [box-shadow:var(--shadow-card)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <DaisyIcon size={80} petalFill="#F5C842" petalStroke="#D4B015" centerFill="#D4890A" centerInner="#B8720A" />
            <p className="font-[var(--font-display)] italic text-[var(--color-terracotta)] text-[18px]">
              This card is for you 🌼
            </p>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <input
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setError(false); }}
                placeholder="Enter the secret word…"
                className={`w-full rounded-full px-5 py-3 text-[14px] text-center border-2 outline-none bg-[var(--color-cream)] text-[var(--color-text-primary)] transition-colors duration-200 ${
                  error
                    ? 'border-red-400'
                    : 'border-[var(--color-daisy-ctr)] focus:border-[var(--color-btn)]'
                }`}
                autoFocus
                autoComplete="off"
              />
              {error && (
                <motion.p
                  className="text-[12px] text-red-400"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Hmm, not quite — try again! 🤔
                </motion.p>
              )}
              <motion.button
                type="submit"
                className="bg-[var(--color-btn)] text-[var(--color-cream)] rounded-full px-9 py-3.5 text-[15px] font-medium tracking-wide [box-shadow:var(--shadow-btn)] hover:bg-[var(--color-btn-hover)]"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Unlock →
              </motion.button>
            </form>
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
