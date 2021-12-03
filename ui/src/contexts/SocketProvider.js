import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext({ socket: null, name: "", room: "", setName: null, setRoom: null });

const SocketProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // we use a ref to store the socket as it won't be updated frequently
  const socketRef = useRef(io('https://rio-server.herokuapp.com/'));

  // When the Provider mounts, initialize it 👆
  // and register a few listeners 👇
  useEffect(() => {
    let socket = socketRef.current;

    socket.on('connect', () => {
      console.log('SocketIO: Connected and authenticated');
    });

    socket.on('error', (msg) => {
      console.error('SocketIO: Error', msg);
    });

    // Remove all the listeners and
    // close the socket when it unmounts
    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.close();
        console.log('SocketIO: Disconnected.');
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, name, room, setName, setRoom }}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;