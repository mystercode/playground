import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DaisyIcon from './DaisyIcon';

interface DaisyConfig {
  x: number; y: number; size: number; float: number; spin: number; opacity: number;
}

const DAISIES: DaisyConfig[] = [
  { x:  3, y:  6, size: 80,  float: 7,  spin: 22, opacity: 0.30 },
  { x: 82, y:  3, size: 55,  float: 9,  spin: 16, opacity: 0.26 },
  { x: 90, y: 44, size: 100, float: 6,  spin: 28, opacity: 0.20 },
  { x:  7, y: 70, size: 65,  float: 10, spin: 18, opacity: 0.28 },
  { x: 75, y: 79, size: 45,  float: 8,  spin: 14, opacity: 0.32 },
  { x: 47, y:  2, size: 40,  float: 11, spin: 20, opacity: 0.24 },
  { x: 17, y: 37, size: 50,  float: 7,  spin: 26, opacity: 0.18 },
  { x: 63, y: 57, size: 75,  float: 9,  spin: 15, opacity: 0.26 },
  { x: 86, y: 67, size: 42,  float: 6,  spin: 32, opacity: 0.22 },
  { x: 32, y: 87, size: 60,  float: 8,  spin: 19, opacity: 0.28 },
];

/* throttled mouse + gyroscope → normalised –1…1 offset */
function useParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stamp = useRef(0);

  useEffect(() => {
    function apply(x: number, y: number) {
      const now = Date.now();
      if (now - stamp.current < 48) return; // ~20fps
      stamp.current = now;
      setOffset({ x, y });
    }

    const onMouse = (e: MouseEvent) =>
      apply(
        (e.clientX / window.innerWidth  - 0.5) * 2,
        (e.clientY / window.innerHeight - 0.5) * 2,
      );

    const onGyro = (e: DeviceOrientationEvent) =>
      apply(
        Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45)),
        Math.max(-1, Math.min(1, (e.beta  ?? 0) / 45)),
      );

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('deviceorientation', onGyro, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onGyro);
    };
  }, []);

  return offset;
}

export default function FloatingDaisies() {
  const [excited, setExcited] = useState<Set<number>>(new Set());
  const parallax = useParallax();

  const handleExcite = useCallback((i: number) => {
    setExcited(prev => new Set(prev).add(i));
    setTimeout(() => setExcited(prev => {
      const next = new Set(prev);
      next.delete(i);
      return next;
    }), 900);
  }, []);

  return (
    <div className="daisy-bg-wrapper fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {DAISIES.map((d, i) => {
        const depth = d.size / 100;           // 0.4–1.0
        const px = parallax.x * depth * 18;  // closer daisies move more
        const py = parallax.y * depth * 12;
        const initX = d.x < 50 ? -160 : 160;
        const initY = d.y < 50 ? -120 : 120;
        const isExcited = excited.has(i);

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${d.x}%`, top: `${d.y}%`, pointerEvents: 'all', cursor: 'pointer' }}
            initial={{ opacity: 0, x: initX, y: initY, scale: 0.6 }}
            animate={{ opacity: d.opacity, x: px, y: py, scale: isExcited ? 1.45 : 1 }}
            whileHover={{ scale: isExcited ? 1.45 : 1.14 }}
            transition={{
              opacity: { delay: i * 0.3, duration: 0.6, ease: 'easeOut' },
              x: { type: 'spring', stiffness: 55, damping: 18, delay: i * 0.3 },
              y: { type: 'spring', stiffness: 55, damping: 18, delay: i * 0.3 },
              scale: { type: 'spring', stiffness: 380, damping: 14 },
            }}
            onClick={() => handleExcite(i)}
          >
            {/* CSS spin + float on inner divs — transform-origin preserved separately */}
            <div className="daisy-float" style={{ animationDuration: `${d.float}s` }}>
              <div
                className="daisy-spin"
                style={{ animationDuration: isExcited ? '0.28s' : `${d.spin}s` }}
              >
                <DaisyIcon size={d.size} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
