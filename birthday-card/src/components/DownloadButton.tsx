import { useState } from 'react';

export default function DownloadButton() {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  async function handleShare() {
    const url  = window.location.href;
    const data = { title: 'Happy Birthday Courtney! 🌼', url };

    if (navigator.share && navigator.canShare?.(data)) {
      // Native share sheet (iOS/Android) — includes "Add to Home Screen"
      await navigator.share(data).catch(() => {});
    } else {
      // Desktop fallback: copy link
      await navigator.clipboard.writeText(url).catch(() => {});
      setState('copied');
      setTimeout(() => setState('idle'), 2200);
    }
  }

  return (
    <div className="dl-btn-wrapper fixed bottom-5 right-5 z-50">
      <button
        onClick={handleShare}
        aria-label={state === 'copied' ? 'Link copied!' : 'Share / install'}
        title={state === 'copied' ? 'Link copied!' : 'Share or add to home screen'}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-btn)] text-[var(--color-cream)] shadow-lg transition-[background,transform] duration-200 hover:bg-[var(--color-btn-hover)] active:scale-95 touch-manipulation"
      >
        {state === 'copied' ? (
          /* checkmark */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
          </svg>
        ) : (
          /* share/upload icon */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a.75.75 0 0 1 .75.75V8.19l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 1.06-1.06L7.25 8.19V1.75A.75.75 0 0 1 8 1Z"/>
            <path d="M3.25 10a.75.75 0 0 1 .75.75v2.5h8v-2.5a.75.75 0 0 1 1.5 0v2.5A1.5 1.5 0 0 1 12 14.5H4A1.5 1.5 0 0 1 2.5 13v-2.25A.75.75 0 0 1 3.25 10Z" opacity="0.7"/>
          </svg>
        )}
      </button>
    </div>
  );
}
