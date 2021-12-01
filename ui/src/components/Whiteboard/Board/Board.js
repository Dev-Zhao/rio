import React, { useState, useEffect, useRef } from 'react';

import './Board.css';

const getMousePos = (canvas, event) => {
  let rect = canvas.getBoundingClientRect();
  // The size of canvas shown on the page could be different 
  // from the size of underlying bitmap used by canvas,
  // we must account for this to draw at the correct location
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  // Adjust the mouse coordinates to be relative to the canvas and scale it
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

const Board = (props) => {
  const canvasRef = useRef();

  useEffect(() => {
    let pos = { x: 0, y: 0 };
    let canDraw = false;
    let ctx = canvasRef.current.getContext('2d');

    // Set the canvas resolution to 1080p
    ctx.canvas.width = 1920;
    ctx.canvas.height = 1080;

    const beginDrawing = (event) => {
      if (!canvasRef.current.contains(event.target)) {
        return;
      }
      let mousePos = getMousePos(canvasRef.current, event);
      pos.x = mousePos.X;
      pos.y = mousePos.y;
      canDraw = true;
    };

    const stopDrawing = (event) => {
      if (!canvasRef.current.contains(event.target)) {
        return;
      }
      canDraw = false;
    };

    const draw = (event) => {
      if (!canDraw || !canvasRef.current.contains(event.target)) {
        return;
      }

      ctx.beginPath(); // begin

      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#c0392b';

      ctx.moveTo(pos.x, pos.y); // from
      let mousePos = getMousePos(canvasRef.current, event);
      pos.x = mousePos.x;
      pos.y = mousePos.y;
      ctx.lineTo(pos.x, pos.y); // to

      ctx.stroke(); // draw it!
    };

    document.addEventListener('mousedown', beginDrawing, { capture: true });
    document.addEventListener('mouseleave', stopDrawing, { capture: true });
    document.addEventListener('mouseup', stopDrawing, { capture: true });
    document.addEventListener('mousemove', draw, { capture: true });

    return () => {
      document.removeEventListener('mousedown', beginDrawing, {
        capture: true,
      });
      document.removeEventListener('mouseleave', stopDrawing, {
        capture: true,
      });
      document.removeEventListener('mouseup', stopDrawing, { capture: true });
      document.removeEventListener('mousemove', draw, { capture: true });
    };
  }, []);

  return <canvas ref={canvasRef} className="board"></canvas>;
};

export default Board;
