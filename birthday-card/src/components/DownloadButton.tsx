import { useState } from 'react';

export default function DownloadButton() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);

    /* Hide elements that don't render well in canvas */
    const daisyBg   = document.querySelector<HTMLElement>('.daisy-bg-wrapper');
    const dlBtn     = document.querySelector<HTMLElement>('.dl-btn-wrapper');
    if (daisyBg)  daisyBg.style.visibility  = 'hidden';
    if (dlBtn)    dlBtn.style.visibility    = 'hidden';

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const root = document.getElementById('root')!;
      const canvas = await html2canvas(root, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#1A110A',
        logging: false,
      });

      const imgW = canvas.width;
      const imgH = canvas.height;
      /* jsPDF uses pt; 1px = 0.75pt */
      const pdfW = imgW * 0.75;
      const pdfH = imgH * 0.75;

      const pdf = new jsPDF({
        orientation: pdfW > pdfH ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pdfW, pdfH],
      });

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pdfW, pdfH);
      pdf.save('happy-birthday-courtney.pdf');
    } finally {
      if (daisyBg)  daisyBg.style.visibility  = '';
      if (dlBtn)    dlBtn.style.visibility    = '';
      setLoading(false);
    }
  }

  return (
    <div className="dl-btn-wrapper fixed bottom-5 right-5 z-50">
      <button
        onClick={handleDownload}
        disabled={loading}
        aria-label="Save as PDF"
        title="Save as PDF"
        className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-btn)] text-[var(--color-cream)] shadow-lg transition-[background,transform] duration-200 hover:bg-[var(--color-btn-hover)] active:scale-95 disabled:opacity-60 touch-manipulation"
      >
        {loading ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a1 1 0 0 1 1 1v6.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L7 8.586V2a1 1 0 0 1 1-1Z"/>
            <path d="M2 12a1 1 0 0 1 1 1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z" opacity="0.7"/>
          </svg>
        )}
      </button>
    </div>
  );
}
