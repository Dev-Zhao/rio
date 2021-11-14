import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const ENDPOINT = 'localhost:5000';

  const search = useLocation().search;

  useEffect(() => {
    const { name, room } = queryString.parse(search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    
    socket.emit('join', { name, room });
  }, [ENDPOINT, search]);

  return (
    <div>
      Chat
    </div>
  );
}

export default Chat;
