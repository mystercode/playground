import { useState } from 'react';
import { downloadBirthdayPDF } from '../utils/downloadPDF';

export default function DownloadButton() {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [pdfState,   setPdfState]   = useState<'idle' | 'busy'>('idle');

  async function handleShare() {
    const url  = window.location.href;
    const data = { title: 'Happy Birthday Courtney! 🌼', url };
    if (navigator.share && navigator.canShare?.(data)) {
      await navigator.share(data).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2200);
    }
  }

  function handlePDF() {
    if (pdfState === 'busy') return;
    setPdfState('busy');
    setTimeout(() => {
      downloadBirthdayPDF();
      setPdfState('idle');
    }, 50);
  }

  const btnClass =
    'w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-btn)] text-[var(--color-cream)] shadow-lg transition-[background,transform] duration-200 hover:bg-[var(--color-btn-hover)] active:scale-95 touch-manipulation';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-2">
      {/* PDF download */}
      <button
        onClick={handlePDF}
        aria-label="Download as PDF"
        title="Download as PDF"
        disabled={pdfState === 'busy'}
        className={`${btnClass} ${pdfState === 'busy' ? 'opacity-60' : ''}`}
      >
        {pdfState === 'busy' ? (
          /* spinner */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            className="animate-spin">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
          </svg>
        ) : (
          /* PDF / download icon */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V5.621a1.5 1.5 0 0 0-.44-1.06L10.44.44A1.5 1.5 0 0 0 9.378 0H2.5ZM2.5 1.5h6.878a.5.5 0 0 1 .354.146l4.122 4.122a.5.5 0 0 1 .146.354V13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Z" opacity="0.6"/>
            <path d="M8 6.75a.75.75 0 0 1 .75.75v2.69l.97-.97a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0L5.22 11.28a.75.75 0 1 1 1.06-1.06l.97.97V7.5A.75.75 0 0 1 8 6.75Z"/>
          </svg>
        )}
      </button>

      {/* Share / copy link */}
      <button
        onClick={handleShare}
        aria-label={shareState === 'copied' ? 'Link copied!' : 'Share / install'}
        title={shareState === 'copied' ? 'Link copied!' : 'Share or add to home screen'}
        className={btnClass}
      >
        {shareState === 'copied' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a.75.75 0 0 1 .75.75V8.19l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 1.06-1.06L7.25 8.19V1.75A.75.75 0 0 1 8 1Z"/>
            <path d="M3.25 10a.75.75 0 0 1 .75.75v2.5h8v-2.5a.75.75 0 0 1 1.5 0v2.5A1.5 1.5 0 0 1 12 14.5H4A1.5 1.5 0 0 1 2.5 13v-2.25A.75.75 0 0 1 3.25 10Z" opacity="0.7"/>
          </svg>
        )}
      </button>
    </div>
  );
}
