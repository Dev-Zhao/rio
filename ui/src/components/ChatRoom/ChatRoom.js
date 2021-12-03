import React, { useState, useEffect, useContext } from 'react';

import Whiteboard from '../Whiteboard/Whiteboard';
import Chat from '../Chat/Chat';
import { SocketContext } from '../../contexts/SocketProvider';

import "./ChatRoom.css";

const ChatRoom = () => {
  const { socket, name, room } = useContext(SocketContext);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.emit('join', { name, room }, (err) => {
      setError(err);
    });
  }, [socket, name, room]);

  return (error) ? (
    <div className="error">
      <h3>Username already taken</h3>
      <a href="/join"><button>Go back</button></a>
    </div>
  ) : (
    <div class="chatroom">
      <Whiteboard className="whiteboard" />
      <Chat className="chat" />
    </div>
  );
};

export default ChatRoom;
