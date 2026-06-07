import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const COLORS = ['#F8C8D4', '#F5C842', '#C5B8FF', '#E8759A', '#FF85A2', '#FFD700'];

export default function Confetti({ fire }) {
  useEffect(() => {
    if (!fire) return;

    confetti({
      particleCount: 70,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.65 },
      colors: COLORS,
    });

    confetti({
      particleCount: 70,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.65 },
      colors: COLORS,
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.4 },
        colors: COLORS,
      });
    }, 350);
  }, [fire]);

  return null;
}
