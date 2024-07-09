const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const authRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const config = require('./config/passport');
require('dotenv').config(); 

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST'],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
});

app.use(bodyParser.json());
app.use(passport.initialize());
config(passport);

app.use('/users', authRoutes);
app.use('/posts', postRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
    `mongodb+srv://pillaiajay42:${process.env.MONGODB_PASSWORD}@cluster0.vo8kvds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatApp.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('private_message', (data) => {
        const { room, message } = data;
        io.to(room).emit('private_message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
