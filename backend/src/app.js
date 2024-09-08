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
        origin: "http://localhost:3000",  // Allow requests from this origin
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    socket.on('message', data => {
        console.log(`Received message: ${data}`)
    })
    socket.on('writing', data => {
        socket.broadcast.emit('writing', data)
    })
})

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