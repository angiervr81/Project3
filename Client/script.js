const socket = io();

const roomForm = document.getElementById('room-form');
const roomInput = document.getElementById('room-input');
const roomMessages =document.getElementById('room-messages');
const joinRoomButton = document.getElementById('join-room');
const leaveRoomButton = document.getElementById('leave-room');
const roomInputElement = document.getElementById('room');
const recipientInput = document.getElementById('recipient');
const privateMessagesInput = document.getElementById('private-message');
const sendPrivateButton = document.getElementById('send-private');
const privateMessagesDiv = document.getElementById('private-messages');


/*handlling public messages
form.addEventListener('submit',(event) =>{
    event.preventDefault();
    if(input.value){
        socket.emt('chat message',input.value);
        input.value = '';
    }
});

// display public message
socket.on('chat message',(msg)=>{
    const item =document.createElement('li');
    item.textContent =msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});*/

joinRoomButton.addEventListener('click',() =>{
    const room = roomInputElement.value;
    if(room){
        socket.emit('join room', room);
        roomInputElement.value = '';
    }
});

leaveRoomButton.addEventListener('click',()=>{
    const room = roomInputElement.value;
    if(room)
    {
        socket.emit('leave room', room);
        roomInputElement.value = '';
    }
});

roomForm.addEventListener('submit',(event) => {
    event.preventDefault();
    const room = roomInputElement.value;
    if(room && roomInput.value){
        socket.emt('room message',{room, message: roomInput.value});
       roomInput.value = '';
    
        
        const item = document.createElement('li');
        item.textContent ='Me:${message}';
        roomMessages.appendChild(item);
        roomMessages.scrollTop = roomMessages.scrollHeight;
    }
});

// display public message
socket.on('room message',(msg)=>{
    const item =document.createElement('li');
    item.textContent =msg;
    messages.appendChild(item);
    roomMessages.scrollTop = roomMessages.scrollHeight;
});

//display history
socket.on('chat history',(hstory)=>{
    roomMessages.innerHTML = '';
    history.forEach(message =>{
        const item =document.createElement('li');
        item.textContent = message;
        roomMessages.appendChild(item);
    });
    roomMessages.scrollTop = roomMessages.scrollHeight;
});

sendPrivateButton.addEventListener('click',() =>{
    const recipient =recipientInput.value;
    const message = privateMessagesInput.value;

    if(recipient && message){
        socket.emit('private message',{recipient,message});
        privateMessagesInput.value = '';

        const item = document.createElement('li');
        item.textContent ='Me to ${recipient}:${message}';
        privateMessagesDiv.appendChild(item);
        privateMessagesDiv.scrollTop =privateMessagesDiv.scrollHeight;

    }
});
//display private message
socket.on('private message',(data) =>{
    const item =document.createElement('div');

    if(data.sender){
        item.textContent = 'Private message form ${data.sender}: ${data.message}';
    }else{
        item.textContent='Error: ${data.message}';
    }

    privateMessageDiv.appendChild(item);
    privateMessagesDiv.scrollTop = privateMessagesDiv.scrollHeight;
});