const express = require('express');
const http = require('http');
const socketIo = require ('socket.io');

const app= express ();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('client'));

//store user details in memory
const users ={};

// handle new connections
io.on('connection', (socket)=>{
    console.log('A user connected');

    // register a new user 
    socket.on('register',(username) =>{
        users[username] = socket.id;
        console.log('${username} connected with socket ID:${socket.id}');
        io.emit('user list', Object.keys(users)); // updating list of users
    });

    // handling sending a chat message 
    socket.on('chat message', (msg)=>{
        io.emit('chat message',msg);
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected');
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