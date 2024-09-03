require('dotenv').config()
const PORT = process.env.PORT

// const io = require('socket.io')(PORT, {
//     cors: {
//         origin: ['http://localhost:3000']
//     }
// })



// const http = require('http').Server(app)

// const io = require('socket.io')(http)

// io.on('connection', socket => {
//     console.log(`Client connected: ${socket.id}`)
//     socket.on('message', data => {
//         console.log(`Received message: ${data}`)
//     })
// })

const app = require('./src/app')


// const http = require('http').Server(app)

// http.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

// module.exports = http
