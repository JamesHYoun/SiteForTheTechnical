const express = require('express')
const app = express()
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(process.cwd() + '/public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index')
})

let items = []

app.get('/blogs', (req, res) => {
    res.render('blogs', {items})
})

app.post('/blogs', (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const content = req.body.content
    items.push({title, author, content})
    res.redirect('/blogs')
})

app.get('/blogs/create', (req, res) => {
    
})

module.exports = app