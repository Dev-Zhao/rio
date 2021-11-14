const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const HTTP_PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('We have a new connection!!!');

  socket.on('join', ({ name, room }) => {
    console.log(name, room);
  });

  socket.on('disconnect', () => {
    console.log('User has left!!!');
  });
});

app.use(router);

server.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});