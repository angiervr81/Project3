const express = require('express');
const http = require('http');
const socketIo = require ('socket.io');

const app= express ();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('client'));

io.on('connection', (socket)=>{
    console.log('A user connected');

    socket.on('chat message', (msg)=>{
        io.emit('chat message',msg);
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});

const PORT =3000;
server.listen(PORT, ()=>{
    console.log('Sever is running on http://localhost:${PORT}');
});