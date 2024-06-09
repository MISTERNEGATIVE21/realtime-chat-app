const express = require('express')
const app = express()
const http = require('http').createServer(app)
const sio = require('socket.io')(http)
const users= {}

const PORT = process.env.PORT || 5000

http.listen(PORT, ()=>{
    console.log(`Listening on the port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.get('/about', (req, res)=>{
    res.sendFile(__dirname + '/about.html')
})
sio.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        console.log('New user joined!', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
        socket.emit('user-count', sio.engine.clientsCount);
    });
    socket.emit('user-count', sio.engine.clientsCount);
    socket.on('get-user-count', () => {
        socket.emit('user-count', Object.keys(users).length);
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', {name: users[socket.id], message: message})
    });
    socket.on('disconnect', message => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-count', Object.keys(users).length);
            socket.broadcast.emit('leave', users[socket.id])
            delete users[socket.id]
        }
    });
})