const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages =document.getElementById('messages');
const recipientInput = document.getElementById('recipient');
const privateMessageInput = document.getElementById('private-message');
const sendPrivateButton = document.getElementById('send-private');
const privateMessageDiv = document.getElementById('private-messages');


// handlling public messages
form.addEventListener('submit',(event) =>{
    event.preventDefault();
    if(input.value){
        socket.emt('chat message',input.value);
        input.value = '';
    }
});

sendPrivateButton.addEventListener('click',() =>{
    const recipient =recipientInput.value;
    const message = privateMessageInput.value;

    if(recipient && message){
        socket.emit('private message',{recipient,message});
        privateMessageInput.value = '';
    }
});

// display public message
socket.on('chat message',(msg)=>{
    const item =document.createElement('li');
    item.textContent =msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
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
});