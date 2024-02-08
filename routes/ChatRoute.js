const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const ioServer = socketIo(server);
const User = require('../models/User');
const GroupMessage = require('../models/GroupMessage');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key', 
    resave: true,
    saveUninitialized: true
}));



// Socket.io logic
ioServer.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('say_hello', (msg) => {
        console.log(msg);
        socket.emit('welcome', msg);
    });

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Other socket.io event handlers...
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' }, (err) => {
        if (err) {
            console.error(err);
        } 
    });
});

app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'public' }, (err) => {
        if (err) {
            console.error(err);
        } 
    });
});

app.post('/register', (req, res) => {
    
    const newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.redirect('/login');
            //res.send('User registered successfully');
            //res.send(`<script>alert('User registered successfully!');</script>`);
        })
        .catch((err) => {
            console.error('Error registering user', err);
            if (err.name === 'ValidationError') {
                //res.send(`<script>alert(${err.message});</script>`);
                res.status(400).send('Validation Error: ' + err.message);
            } else {
                res.status(500).send('Internal Server Error');
            }
        });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: 'public' }, (err) => {
        if (err) {
            console.error(err);
        } 
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password })
        .then(user => {
            if (user) {
                req.session.loggedin = true;
				req.session.username = username;
                res.redirect('/join-room');
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/login'); 
});

app.get('/join-room', (req, res) => {
    res.sendFile('join-room.html', { root: 'public' }, (err) => {
        if (err) {
            console.error(err);
        } 
    });
});

app.post('/join-room', (req, res) => {
    const roomName = req.body.room; 
   
    ioServer.to(req.socket.id).emit('joinRoom', roomName);
    res.redirect(`/chat-room/${roomName}`);
    //res.send(`Joined room: ${roomName}`);
});

app.get('/chat-room/:roomName',  (req, res) => {
    const roomName = req.params.roomName;

    if (req.session.loggedin) {
        // try {
            
        //     const users = User.find();

            
        //     res.render('chat-room', { users });
        // } catch (err) {
        //     console.error(err);
        //     res.status(500).send('Internal Server Error');
        // }
		res.sendFile('chat-room.html', { root: 'public' }, (err) => {
            if (err) {
                console.error(err);
            }
        });
	} else {
		// Not logged in
		res.redirect('/login');
	}
   
    
});

// Other routes...

module.exports = app;
