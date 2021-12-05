import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { SocketContext } from '../contexts/SocketProvider';
import Join from './Join/Join';
import ChatRoom from './ChatRoom/ChatRoom';

const App = () => {
  const { name, room } = useContext(SocketContext);

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Join />} />
        <Route path="/chatroom" element={(!name || !room) ? <Navigate to="/" /> : <ChatRoom />} />
      </Routes>
    </Router>
  );
};

export default App;