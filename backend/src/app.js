const PORT = process.env.PORT
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose')
const Blog = require('./models/blogModel')

const express = require('express')
const app = express()

app.use(cors());

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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    http.listen(PORT, () => {
        console.log(`Connected to database. Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(process.cwd() + '/public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/my-blogs', async (req, res) => {
    console.log('Get Blogs')
    const user_id = req.headers['user_id']
    console.log(user_id)
    const blog = await Blog.find({user_id})
    console.log('blog',blog)
    res.status(200).json(blog)
    
})

let blogs = []

app.get('/blogs', (req, res) => {
    res.render('blogs', {blogs})
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/blogs', (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const content = req.body.content
    const blog = {title, author, content}
    blogs.push(blog)
    res.redirect('/blogs')
    // res.json({ success: true });
})

app.get('/blogs/create', (req, res) => {
    
})


module.exports = app