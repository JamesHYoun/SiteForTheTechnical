const PORT = process.env.PORT
const path = require('path')

const express = require('express')
const app = express()

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

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(process.cwd() + '/public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index')
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