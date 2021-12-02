import React, { useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext({ socket: null });

const SocketProvider = ({ children }) => {
  // we use a ref to store the socket as it won't be updated frequently
  const socket = useRef(io('http://localhost:5000'));

  // When the Provider mounts, initialize it 👆
  // and register a few listeners 👇
  useEffect(() => {
    socket.current.on('connect', () => {
      console.log('SocketIO: Connected and authenticated');
    });

    socket.current.on('error', (msg) => {
      console.error('SocketIO: Error', msg);
    });

    // Remove all the listeners and
    // close the socket when it unmounts
    return () => {
      if (socket && socket.current) {
        socket.current.removeAllListeners();
        socket.current.close();
        console.log('SocketIO: Disconnected.');
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;