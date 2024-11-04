// DraggableElement.js
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'ELEMENT';

function DraggableElement({ id, name, x, y, onDrop }) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = Math.round(item.x + delta.x);
      const newY = Math.round(item.y + delta.y);
      onDrop(item.id, newX, newY);
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        backgroundColor: '#fffa',
        border: '1px solid #333',
        zIndex: 2,
      }}
    >
      {name}
    </div>
  );
}

export default DraggableElement;
