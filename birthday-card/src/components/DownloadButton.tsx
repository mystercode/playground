import { useState } from 'react';
import { downloadBirthdayPDF } from '../utils/downloadPDF';

export default function DownloadButton() {
  const [pdfState, setPdfState] = useState<'idle' | 'busy'>('idle');

  function handlePDF() {
    if (pdfState === 'busy') return;
    setPdfState('busy');
    setTimeout(() => {
      downloadBirthdayPDF();
      setPdfState('idle');
    }, 50);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={handlePDF}
        aria-label="Download as PDF"
        title="Download as PDF"
        disabled={pdfState === 'busy'}
        className={`w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-btn)] text-[var(--color-cream)] shadow-lg transition-[background,transform] duration-200 hover:bg-[var(--color-btn-hover)] active:scale-95 touch-manipulation ${pdfState === 'busy' ? 'opacity-60' : ''}`}
      >
        {pdfState === 'busy' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="animate-spin">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V5.621a1.5 1.5 0 0 0-.44-1.06L10.44.44A1.5 1.5 0 0 0 9.378 0H2.5ZM2.5 1.5h6.878a.5.5 0 0 1 .354.146l4.122 4.122a.5.5 0 0 1 .146.354V13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Z" opacity="0.6"/>
            <path d="M8 6.75a.75.75 0 0 1 .75.75v2.69l.97-.97a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0L5.22 11.28a.75.75 0 1 1 1.06-1.06l.97.97V7.5A.75.75 0 0 1 8 6.75Z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
