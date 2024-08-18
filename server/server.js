// server.js
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

let rooms = {};  // Object to hold room data

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        if (!rooms[room]) rooms[room] = [];
        io.to(room).emit('roomMessages', rooms[room]);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });

    // Handle public message
    socket.on('publicMessage', (data) => {
        const { room, message } = data;
        rooms[room] = rooms[room] || [];
        rooms[room].push(message);
        io.to(room).emit('roomMessages', rooms[room]);
    });

    // Handle private message
    socket.on('privateMessage', (data) => {
        const { recipient, message } = data;
        socket.to(recipient).emit('privateMessage', { from: socket.id, message });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
