const app = require('./src/app')

const http = require('http').Server(app)

const io = require('socket.io')(http)

io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`)
    socket.on('message', data => {
        console.log(`Received message: ${data}`)
    })
})

module.exports = { http, io }
