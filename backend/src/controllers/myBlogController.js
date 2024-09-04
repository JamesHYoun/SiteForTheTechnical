const MyBlog = require('../models/blogModel')
const mongoose = require('mongoose')

const getMyBlogs = async (req, res) => {
    const user_id = req.user._id
    const blogs = await Blog.find({user_id})
  
    res.status(200).json(blogs)
    console.log('Get Blogs')
}

module.exports = {
    getMyBlogs
}