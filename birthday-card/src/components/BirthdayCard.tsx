import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFront from './CardFront';
import CardInside from './CardInside';
import Confetti from './Confetti';
import WishJarView from './WishJar';

type CardState = 'front' | 'inside' | 'wishes';

const variants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 90 : -90,
    opacity: 0,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -90 : 90,
    opacity: 0,
    transition: { duration: 0.22, ease: 'easeIn' },
  }),
};

interface BirthdayCardProps {
  name: string;
  age: number;
}

export default function BirthdayCard({ name, age }: BirthdayCardProps) {
  const [cardState, setCardState] = useState<CardState>('front');
  const [dir, setDir]             = useState(1);
  const [fireConfetti, setFireConfetti] = useState(false);

  function handleAllCandlesOut() {
    setFireConfetti(true);
    setTimeout(() => setFireConfetti(false), 200);
  }

  function openCard()   { setDir(1);  setCardState('inside');  }
  function openWishes() { setDir(1);  setCardState('wishes');  }
  function backToCard() { setDir(-1); setCardState('inside');  }

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <Confetti fire={fireConfetti} />

      <div className="w-[min(420px,90vw)] max-w-full" style={{ perspective: '1200px' }}>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            {cardState === 'front' && (
              <motion.div
                key="front"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <CardFront name={name} onOpen={openCard} />
              </motion.div>
            )}

            {cardState === 'inside' && (
              <motion.div
                key="inside"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <CardInside
                  name={name}
                  age={age}
                  onAllOut={handleAllCandlesOut}
                  onOpenWishes={openWishes}
                />
              </motion.div>
            )}

            {cardState === 'wishes' && (
              <motion.div
                key="wishes"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <WishJarView onBack={backToCard} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
