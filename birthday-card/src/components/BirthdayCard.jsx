import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFront from './CardFront';
import CardInside from './CardInside';
import Confetti from './Confetti';

export default function BirthdayCard({ name, age }) {
  const [opened, setOpened] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [fireConfetti, setFireConfetti] = useState(false);

  function handleEnvelopeClick() {
    setOpened(true);
    setFireConfetti(true);
    setTimeout(() => setFireConfetti(false), 200);
  }

  return (
    <div className="birthday-scene">
      <Confetti fire={fireConfetti} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            className="envelope"
            onClick={handleEnvelopeClick}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -30 }}
            whileHover={{ scale: 1.04, y: -6 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <div className="envelope-flap" />
            <div className="envelope-seal">💝</div>
            <p className="envelope-hint">Tap to open ✨</p>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="card-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {!cardOpen ? (
                <CardFront
                  key="front"
                  name={name}
                  age={age}
                  onOpen={() => setCardOpen(true)}
                />
              ) : (
                <CardInside
                  key="inside"
                  name={name}
                  age={age}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
