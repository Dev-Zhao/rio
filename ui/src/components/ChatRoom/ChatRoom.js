import React from "react";

import Whiteboard from "../Whiteboard/Whiteboard";
import Chat from '../Chat/Chat';

const ChatRoom = () => {
  return (
    <div>
      <Chat />
      <Whiteboard />
    </div>
  );
};

export default ChatRoom;
