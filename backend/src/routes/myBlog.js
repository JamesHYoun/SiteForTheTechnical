const express = require('express')

const { getMyBlogs, getMyBlog, createMyBlog, updateMyBlog, deleteMyBlog } = require('../controllers/myBlogController')

// require auth for all blog routes
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

router.get('/', getMyBlogs)

router.get('/:id', getMyBlog)

router.post('/', createMyBlog)

router.put('/:id', updateMyBlog)

router.delete('/:id', deleteMyBlog)

module.exports = router