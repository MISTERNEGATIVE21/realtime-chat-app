// const socket = io('http://localhost:5000/') 
const socket = io('https://realtime-chat-app-tau-green.vercel.app')
// const socket = io('https://sumanschatapp.vercel.app')

// const socket = io({
//     transports: ['http'],
//     secure: true,
//     path: '/'
//   });

const textarea = document.querySelector('#textarea')
const messageArea = document.querySelector('.messagearea')
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInput');
const userCount = document.getElementById('userCount');
const userColors = {};


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(message, 'outgoing', name)
    socket.emit('send', message, name);
    messageInput.value='';
})

socket.on('user-count', count => {
    userCount.textContent = `Online: ${count}`;
});

// var name = prompt("Enter your name to join the chat: ")
// socket.emit('new-user-joined', name)

let name = '';

while (!name.trim()) {
    name = prompt("Enter your name to join the chat: ");
    if (!name.trim()) {
        alert("Name cannot be empty. Please enter your name.");
    }
}
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
    append(`${name} joined the chat!`, 'boldg')
})

const append = (message, type)=>{
    const mainDiv = document.createElement('div')
    mainDiv.innerText = message;
    mainDiv.classList.add('message');
    mainDiv.classList.add(type);
    messageArea.appendChild(mainDiv)
}

socket.on('receive', data =>{
    appendMessage(`${data.message}`, 'incoming', data.name)
})

socket.on('leave', name =>{
    append(`${name} left the chat!`, 'boldr')
})


const appendMessage = (msg, type, senderName)=>{
    const mainDiv = document.createElement('div')
    // let className = type
    mainDiv.classList.add('message')
    mainDiv.classList.add(type)
    let markup = ` 
        <h3>${senderName}</h3>
        <p>${msg}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    scrollToBottom();
}

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

window.onload = () => {
    scrollToBottom();
}
