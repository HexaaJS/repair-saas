import { useRef, useEffect } from 'react';
import './PatternDisplay.css';

const GRID_SIZE = 3;
const DOT_RADIUS = 8;
const CANVAS_SIZE = 120;
const SPACING = CANVAS_SIZE / (GRID_SIZE + 1);

const PatternDisplay = ({ pattern }) => {
  const canvasRef = useRef(null);

  const dots = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      dots.push({
        id: row * GRID_SIZE + col + 1,
        x: SPACING * (col + 1),
        y: SPACING * (row + 1),
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const selected = pattern.split('-').map(Number);

    // Lignes
    if (selected.length > 1) {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const first = dots.find((d) => d.id === selected[0]);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < selected.length; i++) {
        const dot = dots.find((d) => d.id === selected[i]);
        ctx.lineTo(dot.x, dot.y);
      }

      ctx.stroke();
    }

    // Points
   // Points
    dots.forEach((dot) => {
      const orderIndex = selected.indexOf(dot.id);
      const isSelected = orderIndex !== -1;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);

      if (isSelected) {
        ctx.fillStyle = '#6366f1';
      } else {
        ctx.fillStyle = '#e2e8f0';
      }

      ctx.fill();

      // Numéro d'ordre
      if (isSelected) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(orderIndex + 1), dot.x, dot.y);
      }
    });
  }, [pattern]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="pattern-display"
    />
  );
};

export default PatternDisplay;