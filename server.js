
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public')); // Assuming your client files are in a 'public' directory

let rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        if (!rooms[room]) {
            rooms[room] = [];
        }
        socket.emit('chat history', rooms[room]);
    });

    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });

    socket.on('room message', (data) => {
        const { room, message } = data;
        const formattedMessage = `User ${socket.id}: ${message}`;
        if (rooms[room]) {
            rooms[room].push(formattedMessage);
        }
        io.to(room).emit('room message', { sender: `User ${socket.id}`, message });
    });

    socket.on('private message', (data) => {
        const { recipient, message } = data;
        // Here, you'd handle the private message logic, such as storing and forwarding messages
        io.to(recipient).emit('private message', { sender: `User ${socket.id}`, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
