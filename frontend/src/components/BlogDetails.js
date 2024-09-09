import { useMyBlogsContext } from '../hooks/useMyBlogsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'


const BlogDetails = ({ blog }) => {
    const { dispatch } = useMyBlogsContext()
    const {user} = useAuthContext()
    const navigate = useNavigate()

    const handleEdit = async () => {
        navigate('/my-blogs/edit/' + blog._id)
    }
    
    const handleDelete = async () => {
        const response = await fetch('/api/my-blogs/' + blog._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            }
        })
        const json = await response.json()
        if (response.ok) {
            dispatch({type: 'DELETE_BLOG', payload: json})
        }
    }

    return (
        <div className="blog-details">
            <p></p>
            <h1>{blog.title}</h1>
            <h2>{blog.author}</h2>
            <p>{blog.content}</p>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default BlogDetails