const { ObjectId } = require('mongodb');
const Blog = require('../models/blogModel')

const getBlogs = async (req, res) => {
    const user_id = req.user._id
    const blogs = await Blog.find({ user_id: { $ne: user_id } })
    res.status(200).json(blogs)
}

module.exports = {
    getBlogs
}