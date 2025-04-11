const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html"); //serve HTML to client browser
});

io.on('connection', (socket) => {
    //log new user connected
    console.log('New user connected');

    //send welcome message to newly joined user only
    socket.emit('newMessage', { from: 'Server', text: 'Welcome!', createdAt: Date.now() });

    socket.on('createMessage', (message) => {
        console.log('New message:', message); //log message content and user
        io.emit('newMessage', message); //broadcast to all users connected
    });

    //log user disconnected
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

//inform server of successful initalization
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});