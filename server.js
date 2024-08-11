require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = require('./src/app')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})