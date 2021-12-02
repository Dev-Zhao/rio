import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { SocketContext } from '../../contexts/SocketProvider';

import './Whiteboard.css';

const getMousePos = (canvas, clientX, clientY) => {
  // Adjust the mouse coordinates to be relative to the canvas
  // This assumes that the mouse coordinates is relative to application's viewport
  let rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

// limit the number of events per second
const throttle = (callback, delay) => {
  let previousCall = new Date().getTime();
  return function () {
    let time = new Date().getTime();

    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
};

const Whiteboard = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef();
  const posRef = useRef(pos);

  const { socket, name, room } = useContext(SocketContext);

  const drawLine = useCallback((x0, y0, x1, y1, emit) => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    // The size of canvas shown on the page could be different
    // from the size of underlying bitmap used by canvas,
    // we must account for this to draw at the correct location
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo(x0 * scaleX, y0 * scaleY);
    ctx.lineTo(x1 * scaleX, y1 * scaleY);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c0392b';
    ctx.stroke();
    ctx.closePath();

    if (!emit) {
      return;
    }

    socket.emit('draw', {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
    });
  }, [socket]);

  useEffect(() => {
    socket.on('draw', ({ x0, y0, x1, y1 }) => {
      drawLine(x0, y0, x1, y1, false);
    });

    return () => {
      socket.off('draw');
    };
  }, [socket, name, room, drawLine]);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (event) => {
      if (!drawing) {
        return;
      }
      let mousePos = getMousePos(canvasRef.current, event.clientX, event.clientY);
      drawLine(
        posRef.current.x,
        posRef.current.y,
        mousePos.x,
        mousePos.y,
        true
      );
      setPos({ x: mousePos.x, y: mousePos.y });
    };

    let canvas = canvasRef.current;
    let throttledMouseMove = throttle(onMouseMove, 10);
    canvas.addEventListener('mousemove', throttledMouseMove, {
      capture: true,
    });

    return () => {
      canvas.removeEventListener('mousemove', throttledMouseMove, {
        capture: true,
      });
    };
  }, [drawing, socket, drawLine]);

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    // Set the canvas resolution to 1080p
    ctx.canvas.width = 1920;
    ctx.canvas.height = 1080;

    const onMouseDown = (event) => {
      let mousePos = getMousePos(canvas, event.clientX, event.clientY);
      setPos({ x: mousePos.x, y: mousePos.y });
      setDrawing(true);
    };

    const onMouseUp = (event) => {
      setDrawing(false);
    };

    canvas.addEventListener('mousedown', onMouseDown, {
      capture: true,
    });
    canvas.addEventListener('mouseleave', onMouseUp, {
      capture: true,
    });
    canvas.addEventListener('mouseup', onMouseUp, {
      capture: true,
    });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown, {
        capture: true,
      });
      canvas.removeEventListener('mouseleave', onMouseUp, {
        capture: true,
      });
      canvas.removeEventListener('mouseup', onMouseUp, {
        capture: true,
      });
    };
  }, []);

  return <canvas ref={canvasRef} className="whiteboard"></canvas>;
};

export default Whiteboard;
