import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SocketProvider from '../contexts/SocketProvider';
import Join from './Join/Join';
import Chat from "./Chat/Chat";
import Whiteboard from './Whiteboard/Whiteboard';
import ChatRoom from './ChatRoom/ChatRoom';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/join" exact element={<Join />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/board" element={<Whiteboard />} />
          <Route path="/room" element={<ChatRoom />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;