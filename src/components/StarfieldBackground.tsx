import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
  reducedMotion?: boolean;
}

export const StarfieldBackground: React.FC<StarfieldProps> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle count
    const starCount = reducedMotion ? 35 : 75;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      speed: (Math.random() * 0.02 + 0.005) * (reducedMotion ? 0 : 1),
      glow: Math.random() > 0.8,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render glowing stars
      stars.forEach((star) => {
        const pulse = Math.sin(frame * star.speed + star.x) * 0.2;
        const currentOpacity = Math.max(0.1, Math.min(0.9, star.opacity + pulse));

        ctx.fillStyle = star.glow
          ? `rgba(212, 194, 150, ${currentOpacity})`
          : `rgba(245, 247, 255, ${currentOpacity})`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.glow) {
          ctx.strokeStyle = `rgba(212, 194, 150, ${currentOpacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (!reducedMotion) {
          star.y -= 0.08;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
