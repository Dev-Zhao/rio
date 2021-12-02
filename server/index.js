const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const HTTP_PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    // Send message to user who joined
    socket.emit('message', {
      user: 'AutoMod',
      message: `${user.name}, welcome to the room ${room}`,
    });
    // Send message to other users (excluding the one that joined)
    socket.broadcast.to(user.room).emit('message', {
      user: 'AutoMod',
      message: `${user.name}, welcome to the room ${room}`,
    });
    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, message });

    callback();
  });

  socket.on('draw', ({x0, y0, x1, y1}, callback) => {
    const user = getUser(socket.id);
    if (!user) { return; }
    socket.broadcast.to(user.room).emit('draw', {x0, y0, x1, y1});
    if (callback) callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'AutoMod',
        message: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(router);
app.use(cors());

server.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
