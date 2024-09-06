const BlogDetails = ({ blog }) => {
    return (
        <div className="blog-details">
            <p></p>
            <h1>{blog.title}</h1>
            <h2>{blog.author}</h2>
            <p>{blog.content}</p>
        </div>
    )
}

export default BlogDetails