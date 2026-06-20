import { jsPDF } from 'jspdf';

const WISHES = [
  'May every song you love find you at exactly the right moment.',
  'A year full of the kind of mornings that feel like a warm exhale.',
  "May someone make you laugh so hard you can't catch your breath, at least once a week.",
  'Wishing you the courage to say yes to the things that scare you just a little.',
  "May this be the year you finally give yourself credit for how far you've come.",
  'Wishing you slow Sundays, good playlists, and people who really get you.',
  'May every room you walk into feel a little more alive because you\'re there.',
];

const STUB_COLORS: Array<[number, number, number]> = [
  [196, 114, 76],
  [212, 137, 10],
  [124, 74, 45],
  [196, 137, 45],
  [232, 129, 106],
  [154, 123, 110],
  [184, 114, 10],
];

function hex(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

export function downloadBirthdayPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210, H = 297;

  const fill   = (h: string) => { const [r,g,b] = hex(h); doc.setFillColor(r,g,b); };
  const stroke = (h: string) => { const [r,g,b] = hex(h); doc.setDrawColor(r,g,b); };
  const color  = (h: string) => { const [r,g,b] = hex(h); doc.setTextColor(r,g,b); };

  // ════════════════════════════
  // PAGE 1 — COVER
  // ════════════════════════════
  fill('#1A110A');
  doc.rect(0, 0, W, H, 'F');

  // Gold top bar
  fill('#D4890A');
  doc.rect(0, 0, W, 5, 'F');

  // Daisy petals
  const dX = W / 2, dY = 72;
  fill('#F5C842');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    doc.circle(dX + Math.cos(a) * 17, dY + Math.sin(a) * 17, 10, 'F');
  }
  fill('#D4890A');
  doc.circle(dX, dY, 11, 'F');
  fill('#B8720A');
  doc.circle(dX, dY, 7, 'F');

  // "Happy Birthday"
  color('#FAF7F2');
  doc.setFont('times', 'bold');
  doc.setFontSize(50);
  doc.text('Happy Birthday', W / 2, 118, { align: 'center' });

  // Divider
  stroke('#D4890A');
  doc.setLineWidth(0.7);
  doc.line(W / 2 - 38, 126, W / 2 + 38, 126);

  // "Courtney"
  color('#F5C842');
  doc.setFont('times', 'italic');
  doc.setFontSize(38);
  doc.text('Courtney', W / 2, 144, { align: 'center' });

  // Subtitle
  color('#D4890A');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('24th Birthday  |  June 21, 2026', W / 2, 158, { align: 'center' });

  // Decorative dots
  fill('#F5C842');
  for (let i = 0; i < 5; i++) doc.circle(W / 2 - 16 + i * 8, 242, 1.3, 'F');

  // Gold bottom bar
  fill('#D4890A');
  doc.rect(0, H - 5, W, 5, 'F');

  // ════════════════════════════
  // PAGE 2 — MESSAGE
  // ════════════════════════════
  doc.addPage();
  fill('#FAF7F2');
  doc.rect(0, 0, W, H, 'F');

  fill('#D4890A');
  doc.rect(0, 0, W, 5, 'F');

  color('#9A7B6E');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('A MESSAGE FOR YOU', W / 2, 17, { align: 'center' });

  stroke('#E8D5B7');
  doc.setLineWidth(0.4);
  doc.line(30, 21, W - 30, 21);

  color('#C4724C');
  doc.setFont('times', 'italic');
  doc.setFontSize(22);
  doc.text('Dear Courtney,', W / 2, 42, { align: 'center' });

  const bodyLines = [
    'Twenty-four years of you -- every one of them a gift.',
    '',
    'May this year bring you the music that moves you,',
    'the quiet you need, and every small thing',
    'that makes you feel fully alive.',
  ];
  color('#5C3D2E');
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  let y = 60;
  for (const line of bodyLines) {
    if (line === '') { y += 4; continue; }
    doc.text(line, W / 2, y, { align: 'center' });
    y += 9;
  }

  color('#C4724C');
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.text('With love', W / 2, y + 12, { align: 'center' });

  stroke('#E8D5B7');
  doc.line(W / 2 - 35, y + 21, W / 2 + 35, y + 21);

  y += 33;
  color('#9A7B6E');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('SONGS FOR YOUR YEAR', W / 2, y, { align: 'center' });

  const quotes = [
    "\"It's the little things that gets me high.\"  -- Jorja Smith, Little Things",
    "\"Take your chances, take your time -- it's all yours.\"  -- Kaytranada, Chances",
    "\"Stay smooth, let the music carry you.\"  -- Orion Sun, Smooth",
  ];
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  y += 8;
  for (const q of quotes) {
    doc.text(q, W / 2, y, { align: 'center' });
    y += 8;
  }

  fill('#D4890A');
  doc.rect(0, H - 5, W, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Happy 24th Birthday, Courtney', W / 2, H - 1.2, { align: 'center' });

  // ════════════════════════════
  // PAGE 3 — WISHES
  // ════════════════════════════
  doc.addPage();
  fill('#FAF7F2');
  doc.rect(0, 0, W, H, 'F');

  fill('#C4724C');
  doc.rect(0, 0, W, 5, 'F');

  color('#9A7B6E');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('YOUR BIRTHDAY WISHES', W / 2, 17, { align: 'center' });

  stroke('#E8D5B7');
  doc.setLineWidth(0.4);
  doc.line(30, 21, W - 30, 21);

  const marg = 18;
  const wishW = W - marg * 2;
  const stubW = 14;
  const textX = marg + stubW + 6;
  const textW = wishW - stubW - 10;
  let wy = 26;

  for (let i = 0; i < WISHES.length; i++) {
    const [sR, sG, sB] = STUB_COLORS[i % STUB_COLORS.length];

    doc.setFont('times', 'italic');
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(`"${WISHES[i]}"`, textW) as string[];
    const cardH = 8 + lines.length * 6.5 + 5;

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(marg, wy, wishW, cardH, 2, 2, 'F');

    // Border
    stroke('#E8D5B7');
    doc.setLineWidth(0.35);
    doc.roundedRect(marg, wy, wishW, cardH, 2, 2, 'S');

    // Coloured stub
    doc.setFillColor(sR, sG, sB);
    doc.roundedRect(marg, wy, stubW, cardH, 2, 2, 'F');
    // Square off the right edge of the stub
    doc.rect(marg + stubW - 2, wy, 2, cardH, 'F');

    // Stub label (rotated)
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.text('BIRTHDAY WISH', marg + stubW / 2, wy + cardH / 2, { align: 'center', angle: 90 });

    // Wish text
    color('#5C3D2E');
    doc.setFont('times', 'italic');
    doc.setFontSize(10.5);
    lines.forEach((line, li) => doc.text(line, textX, wy + 9 + li * 6.5));

    wy += cardH + 5;

    if (wy > H - 25 && i < WISHES.length - 1) {
      doc.addPage();
      fill('#FAF7F2');
      doc.rect(0, 0, W, H, 'F');
      wy = 15;
    }
  }

  // Bottom bar on last wishes page
  fill('#C4724C');
  doc.rect(0, H - 5, W, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Happy 24th Birthday, Courtney', W / 2, H - 1.2, { align: 'center' });

  doc.save('happy-birthday-courtney.pdf');
}
