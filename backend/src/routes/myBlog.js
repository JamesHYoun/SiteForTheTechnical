const express = require('express')

const { getMyBlogs, createMyBlog } = require('../controllers/myBlogController')

// require auth for all blog routes
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

router.get('/', getMyBlogs)

router.post('/', createMyBlog)

module.exports = router