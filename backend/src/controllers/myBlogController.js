// const { ObjectId } = require('mongodb');
const Blog = require('../models/blogModel')
const mongoose = require('mongoose')

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

const deleteMyBlog = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such blog'})
    }
  
    const blog = await Blog.findOneAndDelete({_id: id})
  
    if (!blog) {
      return res.status(400).json({error: 'No such blog'})
    }
  
    res.status(200).json(blog)
  }

module.exports = {
    getMyBlogs,
    createMyBlog,
    deleteMyBlog
}