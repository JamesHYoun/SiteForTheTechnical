const { ObjectId } = require('mongodb');
const Blog = require('../models/blogModel')

const getMyBlogs = async (req, res) => {
    const user_id = req.headers['user_id']
    const blog = await Blog.find({ _id: new ObjectId(user_id) });
    res.status(200).json(blog[0])
}

module.exports = {
    getMyBlogs
}