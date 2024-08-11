const PORT = process.env.PORT
const path = require('path')

const express = require('express')
const app = express()

const http = require('http').Server(app)

const io = require('socket.io')(http)

// io.on('connection', socket => {
//     console.log(`Client connected: ${socket.id}`)
//     socket.on('message', data => {
//         console.log(`Received message: ${data}`)
//     })
// })

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

app.post('/blogs', (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const content = req.body.content
    const blog = {title, author, content}
    blogs.push(blog)
    io.emit('NewBlog', blog)
    // res.redirect('/blogs')
})

app.get('/blogs/create', (req, res) => {
    
})


module.exports = app