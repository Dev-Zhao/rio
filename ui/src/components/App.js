import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Join from './Join/Join';
import Chat from "./Chat/Chat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;