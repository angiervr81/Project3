const express = require('express');
const http = require('http');
const socketIo = require ('socket.io');

const app= express ();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('client'));

//store user details in memory
const users ={};
const rooms ={}; // room messgae histories

// handle new connections
io.on('connection', (socket)=>{
    console.log('A user connected');

    // register a new user 
    socket.on('register',(username) =>{
        users[username] = socket.id;
        console.log('${username} connected with socket ID:${socket.id}');
        io.emit('user list', Object.keys(users)); // updating list of users
    });

// handle joing chat room
socket.on('join room',(room) =>{
    socket.join(room);
    console.log('User ${socket.id} joined room ${room}');

    if(room[room]){
        socket.emit('chat history', rooms[room]);
    }
});

//leaving room

socket.on('leaving room',(room) =>{
    socket.leave(room);
    console.log('User ${socket.id} left room ${room}');
});


    // handling sending a chat message 
    socket.on('room message', (data)=>{
        const {room,message}=data;

        io.to(room).emit('room message',message );

        if(!room[room]){
            rooms[room] =[];
        }

        rooms[room].push(message);
    });

    // handling private messages 
    socket.on('private message', (data) =>{
        const {recipient, message} = data;
        const recipientSocketID = users[recipient];
        if(recipientSocketID){
            io.to(recipientSocketID).emit('private message', {message, sender:socket.id});
        }else{
            socket.emit('private message', {message:'User not found', sender: null});
        }
    });

    socket.on('disconnect',() =>{
        console.log('User disconnected');

        for (const [username, id] of Object.entries(users)){
            if(id === socket.id){
                delete users[username];
                io.emit('user list', Object.keys(users));
                break; 
            }
        }
    })
});

const PORT =3000;
server.listen(PORT, ()=>{
    console.log('Sever is running on http://localhost:${PORT}');
});