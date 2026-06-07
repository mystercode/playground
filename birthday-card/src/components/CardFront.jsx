import { motion } from 'framer-motion';

export default function CardFront({ name, age, onOpen }) {
  return (
    <motion.div
      className="card card-front"
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 90, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="card-floating-row">
        <span className="float-el">🌸</span>
        <span className="float-el">⭐</span>
        <span className="float-el">🌷</span>
        <span className="float-el">✨</span>
        <span className="float-el">🌸</span>
      </div>

      <div className="card-main-content">
        <p className="card-eyebrow">For someone special</p>
        <h1 className="card-headline">
          Happy<br />Birthday!
        </h1>
        <p className="card-name">{name} 🎂</p>
        <p className="card-age">Turning {age} 🎉</p>
      </div>

      <div className="card-floral">🌺🌸🌹🌷🌸🌺</div>

      <motion.button
        className="card-cta"
        onClick={onOpen}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        Open your card ✉️
      </motion.button>
    </motion.div>
  );
}
