import { useState } from "react"
import { useBlogsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"


const BlogForm = () => {
    const { dispatch } = useBlogsContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            setError('You must be loggined in')
            return
        }
        const blog = {title, author, content}
        const response = fetch('/api/my-blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
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

export default BlogForm