import { useState, useEffect } from "react"
import { useMyBlogsContext } from "../hooks/useMyBlogsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from 'react-router-dom';


const Create = () => {
    const { dispatch } = useMyBlogsContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchMyBlogs = async () => {
    //         const response = await fetch('/api/my-blogs', {
    //             method: 'GET', // Specify the method
    //             headers: {
    //                 'Content-Type': 'application/json', // Set the appropriate content type
    //                 'Authorization': `Bearer ${user.token}`
    //             }
    //         })
    //         const json = await response.json()
    //         if (response.ok) {
    //             dispatch({type: 'SET_BLOGS', payload: json})
    //         }
    //     } 
    //     if (user) {
    //         fetchMyBlogs()
    //     }
    // }, [user]); // Empty dependency array means this runs once when the component mounts
    
    const handleSubmit = async (e) => {
        console.log('ENTERED handleSubmit in Create.js')
        e.preventDefault()
        if (!user) {
            setError('You must be loggined in')
            return
        }
        const blog = {title, author, content}
        const response = await fetch('/api/my-blogs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blog)
        })
        const json = await response.json()
        if (!response.ok) {
            setError(json.error)
        } else {
            setTitle('')
            setAuthor('')
            setContent('')
            setError(null)
            dispatch({type: 'CREATE_BLOG', payload: json})
            console.log('new blog added')
        }
        navigate('/my-blogs')
    }
    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new blog</h3>
            <label>Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label>Author:</label>
            <input
                type="text"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
            />
            <label>Content:</label>
            <input
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />
            <button>Add Blog</button>
        </form>
    )
}

export default Create