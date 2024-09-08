const express = require('express')

const { getBlogs } = require('../controllers/blogController')

// require auth for all blog routes
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

router.get('/', getBlogs)

module.exports = router