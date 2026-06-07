import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFront from './CardFront';
import CardInside from './CardInside';
import Confetti from './Confetti';

interface BirthdayCardProps {
  name: string;
  age: number;
}

export default function BirthdayCard({ name, age }: BirthdayCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fireConfetti, setFireConfetti] = useState(false);

  function handleAllCandlesOut() {
    setFireConfetti(true);
    setTimeout(() => setFireConfetti(false), 200);
  }

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <Confetti fire={fireConfetti} />

      <div className="w-[min(420px,90vw)] max-w-full" style={{ perspective: '1200px' }}>
        {/* Spring entrance: scale 0.85 → 1 */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="front"
                exit={{ rotateY: -90, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
              >
                <CardFront name={name} onOpen={() => setIsOpen(true)} />
              </motion.div>
            ) : (
              /* Spring flip with bounce at end */
              <motion.div
                key="inside"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <CardInside name={name} age={age} onAllOut={handleAllCandlesOut} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
