import { motion } from 'framer-motion';
import DaisyIcon from './DaisyIcon';

interface CardFrontProps {
  name: string;
  onOpen: () => void;
}

export default function CardFront({ name, onOpen }: CardFrontProps) {
  return (
    <div className="flex flex-col items-center text-center gap-5 p-8 bg-[var(--color-card)] rounded-[20px] [box-shadow:var(--shadow-card)]">

      <div style={{ filter: 'drop-shadow(0 4px 12px rgba(44,24,16,0.12))' }}>
        <DaisyIcon
          size={120}
          petalFill="#F5C842"
          petalStroke="#D4B015"
          centerFill="#D4890A"
          centerInner="#B8720A"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h1
          className="font-[var(--font-display)] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)]"
          style={{ fontSize: 'clamp(36px,10vw,54px)' }}
        >
          Happy<br />Birthday
        </h1>
        <p
          className="font-[var(--font-display)] italic font-normal text-[var(--color-terracotta)]"
          style={{ fontSize: 'clamp(18px,5vw,26px)' }}
        >
          {name}
        </p>
      </div>

      <motion.button
        onClick={onOpen}
        className="mt-1 bg-[var(--color-btn)] text-[var(--color-cream)] rounded-full px-9 py-3.5 text-[15px] font-medium tracking-wide min-h-[44px] [box-shadow:var(--shadow-btn)] touch-manipulation transition-[background,box-shadow] duration-200 hover:bg-[var(--color-btn-hover)] active:scale-[0.97]"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        Open your card →
      </motion.button>
    </div>
  );
}
