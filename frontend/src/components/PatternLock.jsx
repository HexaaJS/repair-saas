import { useRef, useState, useEffect } from 'react';
import './PatternLock.css';

const GRID_SIZE = 3;
const DOT_RADIUS = 12;
const CANVAS_SIZE = 200;
const SPACING = CANVAS_SIZE / (GRID_SIZE + 1);

const PatternLock = ({ onPattern }) => {
  const canvasRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const drawCanvas = (currentPos = null) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Lignes entre les points sélectionnés
    if (selected.length > 0) {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const first = dots.find((d) => d.id === selected[0]);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < selected.length; i++) {
        const dot = dots.find((d) => d.id === selected[i]);
        ctx.lineTo(dot.x, dot.y);
      }

      if (isDrawing && currentPos) {
        ctx.lineTo(currentPos.x, currentPos.y);
      }

      ctx.stroke();
    }

    // Points
    dots.forEach((dot) => {
      const isSelected = selected.includes(dot.id);
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);

      if (isSelected) {
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 6;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [selected]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const hitDot = (pos) => {
    return dots.find((dot) => {
      const dist = Math.sqrt((dot.x - pos.x) ** 2 + (dot.y - pos.y) ** 2);
      return dist < DOT_RADIUS + 8;
    });
  };

  const handleStart = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    const dot = hitDot(pos);

    setSelected(dot ? [dot.id] : []);
    setIsDrawing(true);
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const dot = hitDot(pos);

    if (dot && !selected.includes(dot.id)) {
      setSelected((prev) => [...prev, dot.id]);
    }

    drawCanvas(pos);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    drawCanvas();

    if (selected.length > 1 && onPattern) {
      onPattern(selected.join('-'));
    }
  };

  const handleClear = () => {
    setSelected([]);
    if (onPattern) onPattern('');
  };

  return (
    <div className="pattern-lock">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="pattern-canvas"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
      <div className="pattern-footer">
        {selected.length > 0 ? (
          <>
            <span className="pattern-value">{selected.join(' → ')}</span>
            <button className="pattern-clear" onClick={handleClear}>Effacer</button>
          </>
        ) : (
          <span className="pattern-hint">Dessinez le schéma de déverrouillage</span>
        )}
      </div>
    </div>
  );
};

export default PatternLock;