import { getCardById } from '../data/tarotDeck';
import { DivinationRecord } from '../types';

export async function generateDivinationCardImage(record: DivinationRecord): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  // High-DPI Dimensions
  const width = 800;
  const cardCount = record.drawnCards.length;
  // Dynamic height based on card count & content
  const height = Math.max(1200, 900 + cardCount * 140);
  canvas.width = width;
  canvas.height = height;

  // 1. Background: Deep Celestial Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0F172A');
  bgGrad.addColorStop(0.4, '#131B33');
  bgGrad.addColorStop(0.8, '#1A2340');
  bgGrad.addColorStop(1, '#0B0F19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Stars & Constellations
  ctx.fillStyle = 'rgba(245, 247, 255, 0.4)';
  for (let i = 0; i < 60; i++) {
    const sx = (Math.sin(i * 99 + 1) * 0.5 + 0.5) * width;
    const sy = (Math.cos(i * 33 + 7) * 0.5 + 0.5) * height;
    const sr = (i % 3 === 0) ? 1.5 : 1;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Elegant Gold Border & Rounded Box
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 194, 150, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.strokeStyle = 'rgba(212, 194, 150, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, width - 64, height - 64);
  ctx.restore();

  // 4. Header: Logo & Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4C296';
  ctx.font = 'bold 32px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('问 月 塔 罗', width / 2, 85);

  ctx.fillStyle = 'rgba(245, 247, 255, 0.6)';
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('心向明月，塔罗知意 · 专属你的治愈占卜', width / 2, 115);

  // Divider Line with Moon Symbol
  ctx.strokeStyle = 'rgba(212, 194, 150, 0.3)';
  ctx.beginPath();
  ctx.moveTo(100, 140);
  ctx.lineTo(width - 100, 140);
  ctx.stroke();

  // 5. Question & Spread Banner
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.roundRect(50, 160, width - 100, 100, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 194, 150, 0.25)';
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#D4C296';
  ctx.font = 'bold 15px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(`【${record.spreadName}】`, 75, 195);

  ctx.fillStyle = '#F5F7FF';
  ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", sans-serif';
  const qText = record.question ? `“ ${record.question} ”` : '“ 随心直觉指引 ”';
  ctx.fillText(qText, 75, 230);

  // 6. Drawn Cards Section
  let currentY = 290;
  ctx.fillStyle = '#D4C296';
  ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('✦ 抽牌牌面 ✦', width / 2, currentY);
  currentY += 30;

  record.drawnCards.forEach((drawn, index) => {
    const cardData = getCardById(drawn.cardId);
    if (!cardData) return;

    // Card Box
    ctx.fillStyle = 'rgba(26, 35, 64, 0.85)';
    ctx.beginPath();
    ctx.roundRect(50, currentY, width - 100, 110, 10);
    ctx.fill();
    ctx.strokeStyle = drawn.isReversed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)';
    ctx.stroke();

    // Position Index & Name
    ctx.fillStyle = '#D4C296';
    ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(`${index + 1}. ${drawn.positionName}`, 75, currentY + 30);

    // Card Name & Upright/Reversed
    ctx.fillStyle = '#F5F7FF';
    ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", sans-serif';
    const statusText = drawn.isReversed ? '【逆位】' : '【正位】';
    ctx.fillText(`${cardData.nameCn} ${statusText}`, 75, currentY + 60);

    // Keywords
    ctx.fillStyle = 'rgba(245, 247, 255, 0.65)';
    ctx.font = '13px "PingFang SC", "Microsoft YaHei", sans-serif';
    const kw = drawn.isReversed ? cardData.keywordsReversed.slice(0, 3).join(' · ') : cardData.keywordsUpright.slice(0, 3).join(' · ');
    ctx.fillText(`关键词：${kw}`, 75, currentY + 88);

    currentY += 125;
  });

  // 7. Healing Synthesis / Advice Box
  currentY += 10;
  ctx.fillStyle = 'rgba(30, 27, 75, 0.6)';
  ctx.beginPath();
  ctx.roundRect(50, currentY, width - 100, 180, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(123, 104, 238, 0.35)';
  ctx.stroke();

  ctx.fillStyle = '#D4C296';
  ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('✦ 月光治愈启示 ✦', 75, currentY + 35);

  ctx.fillStyle = '#F5F7FF';
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
  
  // Wrap text
  const adviceText = record.healerAdvice || (record.drawnCards[0] ? getCardById(record.drawnCards[0].cardId)?.healerAdvice || '' : '');
  const lines = wrapText(ctx, adviceText, width - 150);
  lines.slice(0, 4).forEach((line, lineIdx) => {
    ctx.fillText(line, 75, currentY + 70 + lineIdx * 24);
  });

  // 8. Footer: Date & Stamp
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(245, 247, 255, 0.4)';
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(`占卜时间：${record.dateStr} · 问月塔罗`, width / 2, height - 50);

  return canvas.toDataURL('image/png');
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const characters = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function downloadImage(dataUrl: string, filename = '问月塔罗占卜结果.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
