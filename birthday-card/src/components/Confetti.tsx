import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const WARM = ['#7C4A2D', '#C4724C', '#D4897A', '#E8D5B7', '#FAF7F2', '#F5C842'];

interface ConfettiProps {
  fire: boolean;
}

export default function Confetti({ fire }: ConfettiProps) {
  useEffect(() => {
    if (!fire) return;
    confetti({ particleCount: 70, spread: 90, origin: { x: 0.5, y: 0.38 }, colors: WARM });
    confetti({ particleCount: 40, angle: 60,  spread: 70, origin: { x: 0, y: 0.65 }, colors: WARM });
    confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 1, y: 0.65 }, colors: WARM });
  }, [fire]);

  return null;
}
