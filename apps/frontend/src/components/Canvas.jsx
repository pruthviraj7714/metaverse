// Canvas.js
import React, { useRef, useEffect, useState } from 'react';
import DraggableElement from './DraggableElement';

// Dummy initial data (can be replaced with fetched data)
const initialElements = [
  { id: '1', name: 'Element 1', x: 400, y: 50 },
  { id: '2', name: 'Element 2', x: 150, y: 100 },
];

function Canvas() {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState(initialElements);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ddd';
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, []);

  const handleDrop = (id, x, y) => {
    // Update element position
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );

    // Call API to save new position
    // savePosition(id, { x, y });
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000', position: 'absolute', zIndex: 1 }}
      />
      {elements.map((el) => (
        <DraggableElement
          key={el.id}
          id={el.id}
          name={el.name}
          x={el.x}
          y={el.y}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}

// Mock save function (replace with API call)
// async function savePosition(id, position) {
  // try {
  //   await fetch(`/api/elements/${id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ position }),
  //   });
  //   console.log(`Position saved for element ${id}`);
  // } catch (error) {
  //   console.error('Error saving position:', error);
  // }
// }

export default Canvas;
