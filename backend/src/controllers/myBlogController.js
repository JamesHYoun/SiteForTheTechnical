const { ObjectId } = require('mongodb');
const Blog = require('../models/blogModel')

const getMyBlogs = async (req, res) => {
    const user_id = req.user._id
    const blogs = await Blog.find({ user_id: user_id })
    res.status(200).json(blogs)
}

const createMyBlog = async (req, res) => {
    try {
        const user_id = req.user._id
        const blog = await Blog.create({...req.body, user_id})
        res.status(200).json(blog)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getMyBlogs,
    createMyBlog
}