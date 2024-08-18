const socket = io();

const roomForm = document.getElementById('room-form');
const roomInput = document.getElementById('room-input');
const roomMessages = document.getElementById('room-messages');
const joinRoomButton = document.getElementById('join-room');
const leaveRoomButton = document.getElementById('leave-room');
const roomInputElement = document.getElementById('room');
const recipientInput = document.getElementById('recipient');
const privateMessagesInput = document.getElementById('private-messages');
const sendPrivateButton = document.getElementById('send-private');
const privateMessagesDiv = document.getElementById('private-messages');

// Handle public messages
roomForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const room = roomInputElement.value;
    if (room && roomInput.value) {
        socket.emit('room message', { room, message: roomInput.value });
        roomInput.value = '';

        const item = document.createElement('li');
        item.textContent = `Me: ${roomInput.value}`;
        roomMessages.appendChild(item);
        roomMessages.scrollTop = roomMessages.scrollHeight;
    }
});

// Display public message
socket.on('room message', (data) => {
    const item = document.createElement('li');
    item.textContent = `${data.sender}: ${data.message}`;
    roomMessages.appendChild(item);
    roomMessages.scrollTop = roomMessages.scrollHeight;
});

// Display chat history
socket.on('chat history', (history) => {
    roomMessages.innerHTML = '';
    history.forEach((message) => {
        const item = document.createElement('li');
        item.textContent = message;
        roomMessages.appendChild(item);
    });
    roomMessages.scrollTop = roomMessages.scrollHeight;
});

joinRoomButton.addEventListener('click', () => {
    const room = roomInputElement.value;
    if (room) {
        socket.emit('join room', room);
        roomInputElement.value = '';
    }
});

leaveRoomButton.addEventListener('click', () => {
    const room = roomInputElement.value;
    if (room) {
        socket.emit('leave room', room);
        roomInputElement.value = '';
    }
});

sendPrivateButton.addEventListener('click', () => {
    const recipient = recipientInput.value;
    const message = privateMessagesInput.value;

    if (recipient && message) {
        socket.emit('private message', { recipient, message });
        privateMessagesInput.value = '';

        const item = document.createElement('li');
        item.textContent = `Me to ${recipient}: ${message}`;
        privateMessagesDiv.appendChild(item);
        privateMessagesDiv.scrollTop = privateMessagesDiv.scrollHeight;
    }
});

// Display private message
socket.on('private message', (data) => {
    const item = document.createElement('div');
    if (data.sender) {
        item.textContent = `Private message from ${data.sender}: ${data.message}`;
    } else {
        item.textContent = `Error: ${data.message}`;
    }
    privateMessagesDiv.appendChild(item);
    privateMessagesDiv.scrollTop = privateMessagesDiv.scrollHeight;
});
