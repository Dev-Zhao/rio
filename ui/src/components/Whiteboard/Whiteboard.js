import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
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
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef();
  const posRef = useRef(pos);

  const search = useLocation().search;
  const { socket } = useContext(SocketContext);

  const drawLine = (x0, y0, x1, y1, emit) => {
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
  };

  useEffect(() => {
    const { name, room } = queryString.parse(search);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (err) => {
      console.log(err);
    });

    socket.on('draw', ({ x0, y0, x1, y1 }) => {
      drawLine(x0, y0, x1, y1, false);
    });

    return () => {
      socket.off('draw');
    };
  }, [search, socket]);

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
  }, [drawing, socket]);

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
