const BlogDetails = ({ value }) => {
    console.log('REACHED BLOGDETAILS')
    return (
        <div className="blog-details">
            <p>{value.title}</p>
            <h1>Some title</h1>
            <h2>Some authro</h2>
            <p>Some content</p>
        </div>
    )
}

export default BlogDetails