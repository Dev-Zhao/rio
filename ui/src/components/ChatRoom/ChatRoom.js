import React, { useEffect, useContext } from "react";

import Whiteboard from "../Whiteboard/Whiteboard";
import Chat from '../Chat/Chat';
import { SocketContext } from '../../contexts/SocketProvider';

const ChatRoom = () => {
  const { socket, name, room } = useContext(SocketContext);

  useEffect(() => {
    socket.emit('join', { name, room }, (err) => {
      console.log(err);
    });
  }, [socket, name, room]);

  return (
    <div>
      <Chat />
      <Whiteboard />
    </div>
  );
};

export default ChatRoom;
