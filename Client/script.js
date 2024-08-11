const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages =document.getElementById('messages');


form.addEventListener('submit',(event) =>{
    event.preventDefault();
    if(input.value){
        socket.emt('chat message',input.value);
        input.value = '';
    }
});

socket.on('chat message',(msg)=>{
    const item =document.createElement('li');
    item.textContent =msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});