const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const Blog = require('./models/blogModel')

const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const myBlogRoutes = require('./routes/myBlog')

const express = require('express')
const app = express()

app.use(express.json());


// Alternatively, configure CORS options for more control
// app.use(cors({
//   origin: 'http://localhost:3001', // Allow only specific origin
//   methods: ['GET', 'POST'],     // Allow specific methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
// }));
app.use(cors({
    origin: 'http://localhost:3001' // React app's URL
}));

const http = require('http').Server(app)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    http.listen(process.env.PORT, () => {
        console.log(`Connected to database. Server running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })

const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow requests from this origin
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    // Assume that the blog ID is passed by the client upon connection or via some event
    socket.on("joinRoom", (blogId) => {
      // The blog ID will be the room name

      socket.join(blogId);
      console.log('Joined room')
    });
    socket.on('message', data => {
        console.log(`Received message: ${data}`)
    })
    socket.on("writing", (data) => {
        const roomId = data.blogId;
        const message = data.message;
        
        // Broadcast the message to all clients in the room (excluding the sender)
        socket.to(roomId).emit('message', message);
    });

    socket.on('requestData', ({blogId, socketId}) => {
        const clientsInRoom = io.sockets.adapter.rooms.get(blogId);
        
        if (clientsInRoom && clientsInRoom.size > 1) {
            
            // Convert Set to an array to access randomly
            let copySet = new Set(clientsInRoom)
            copySet.delete(socketId)
            const clientArray = Array.from(copySet);
            const randomIndex = Math.floor(Math.random() * clientArray.length);
            const randomClientId = clientArray[randomIndex];
            copySet.add(socketId)
                // Ask the chosen client to send data
            io.to(randomClientId).emit('sendData', {
                requesterId: socketId,
            });
        } else {
            io.to(socketId).emit('noClient');
        }

    });

    // Handle other clients sending their data back
    socket.on('sendData', (data) => {
        const { requesterId, content } = data;

        // Forward the data to the original requester (Client A)
        io.to(requesterId).emit('receiveData', { content });
    });

    // Optionally handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(process.cwd() + '/public'))
app.use(express.urlencoded({extended: true}))


app.use('/api/user', userRoutes)

app.use('/api/blogs', blogRoutes)

app.use('/api/my-blogs', myBlogRoutes)

app.get('/', (req, res) => {
    res.render('index')
})



module.exports = app