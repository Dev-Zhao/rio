import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Join from './Join/Join';
import Chat from "./Chat/Chat";
import Whiteboard from './Whiteboard/Whiteboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/join" exact element={<Join />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/board" element={<Whiteboard />} />
      </Routes>
    </Router>
  );
};

export default App;