const express = require('express')

const { getMyBlogs } = require('../controllers/myBlogController')

const router = express.Router()

router.get('/', getMyBlogs)

module.exports = router