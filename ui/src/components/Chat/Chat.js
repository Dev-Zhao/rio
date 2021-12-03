import React, { useState, useEffect, useContext } from 'react';

import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
import { SocketContext } from '../../contexts/SocketProvider';

import './Chat.css';

const Chat = (props) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const { socket, name, room } = useContext(SocketContext);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.off('message');
    };
  }, [socket, messages]);

  useEffect(() => {
    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('roomData');
    };
  }, [socket, users]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  };

  return (
    <div className="chat-container">
      <InfoBar room={room} />
      <Messages messages={messages} name={name} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
