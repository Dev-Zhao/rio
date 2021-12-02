import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
import UsersContainer from './UsersContainer/UsersContainer';
import { SocketContext } from '../../contexts/SocketProvider';

import './Chat.css';

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const { socket } = useContext(SocketContext);

  const search = useLocation().search;

  useEffect(() => {
    const { name, room } = queryString.parse(search);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (err) => {
      setError(err);
      console.log(err);
    });
  }, [search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.off('message');
    };
  }, [messages]);

  useEffect(() => {
    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('roomData');
    };
  }, [users]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        {!error ? (
          <React.Fragment>
            <InfoBar room={room} />
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1>Sorry... Username is taken!</h1>
            <Link to={`/`}>
              <button className="button mt-20" type="submit">
                Go Back
              </button>
            </Link>
          </React.Fragment>
        )}
      </div>
      <UsersContainer users={users} />
    </div>
  );
};

export default Chat;
