import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketProvider';

import './Join.css';

const Join = () => {
  const { name, room, setName, setRoom } = useContext(SocketContext);

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Welcome to Rio</h1>
        <h3>Enter a room to begin drawing/chatting!</h3>
        <h3>Your friends can join you using the same room number</h3>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
          to={`/chatroom`}
        >
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
