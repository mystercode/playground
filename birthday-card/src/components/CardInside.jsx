import { useState } from 'react';
import { motion } from 'framer-motion';

const FUN_FACTS = [
  "Taylor Swift had already released 3 albums by age 24 🎵",
  "You've been alive for ~8,760 days — every single one uniquely yours 🌟",
  "The human brain fully matures at 25 — you're almost there! 🧠",
  "24 is perfect: old enough to know better, young enough not to care ✨",
  "Jupiter takes 12 years to orbit the sun — you've done exactly 2 laps 🪐",
];

export default function CardInside({ name, age }) {
  const [blown, setBlown] = useState(new Set());

  function toggleCandle(i) {
    setBlown(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const allBlown = blown.size === age;

  return (
    <motion.div
      className="card card-inside"
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 90, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        className="card-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <p className="greeting">Dear {name},</p>
        <p className="message-body">
          Wishing you the most beautiful {age}th birthday. May this year bring
          you joy, laughter, and every dream you've ever dared to dream.
          You deserve the entire world — and then some. 💕
        </p>
        <p className="message-sign">With all the love, always 🌸</p>
      </motion.div>

      <motion.div
        className="candles-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="candles-hint">
          {allBlown ? '🎉 Your wish is on its way! 🎉' : `Blow out your ${age} candles! 🎂`}
        </p>
        <div className="candles-grid">
          {Array.from({ length: age }, (_, i) => (
            <motion.button
              key={i}
              className={`candle ${blown.has(i) ? 'blown' : ''}`}
              onClick={() => toggleCandle(i)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.85 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.04 }}
              title={blown.has(i) ? 'Relight' : 'Blow out'}
            >
              {blown.has(i) ? '🌬️' : '🕯️'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="fun-facts"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <h3 className="facts-title">Fun facts about being {age} ✨</h3>
        <ul className="facts-list">
          {FUN_FACTS.map((fact, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.25 + i * 0.14 }}
            >
              {fact}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
