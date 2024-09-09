import { useState, useEffect } from "react"
import { useMyBlogsContext } from "../hooks/useMyBlogsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { io } from 'socket.io-client'; // Import socket.io-client


const Edit = () => {
    const { id: blog_id } = useParams()
    const { dispatch } = useMyBlogsContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const content = document.getElementById('content')

        const socket = io('http://localhost:3000')
        socket.emit("joinRoom", blog_id)

        socket.emit('requestData', blog_id);
        socket.on('receiveData', (data) => {
            console.log(`Received data: ${data.yourData}`);
            setContent(data.yourData)
            // Do something with the received data
        });
        socket.on('sendData', (data) => {
            const yourData = content.value  // Example of the client's current data
            const requesterId = data.requesterId;
        
            // Send the data back to the server to forward to the requester
            socket.emit('sendData', {
                requesterId: requesterId,
                yourData: yourData
            });
        });
        socket.on('noClient', () => {
            const fetchMyBlogs = async () => {
                const response = await fetch('/api/my-blogs', {
                    method: 'GET', // Specify the method
                    headers: {
                        'Content-Type': 'application/json', // Set the appropriate content type
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (response.ok) {
                    dispatch({type: 'SET_BLOGS', payload: json})
                }
            } 
            if (user) {
                fetchMyBlogs()
            }
        });
        content.addEventListener('input', event => {
            console.log('ENTERED eventlistener')
            socket.emit('writing', {
                blog_id: blog_id,
                message: {
                    type: 'input',
                    content: content.value,
                    cursorPosition: content.selectionStart
                }

            })
        })
        socket.on('message', (data) => {
            const selection = window.getSelection()
            let cursorPosition = 0
            if (selection.isCollapsed) { // Selection is just a cursor
                cursorPosition = selection.anchorOffset; // Position within the text node
                console.log('Cursor position:', cursorPosition);
            } 
            const previousLength = content.textContent.length         
            setContent(data.content)
            const currentLength = content.textContent.length
    
            if (currentLength > previousLength && cursorPosition + 1 >= data.cursorPosition 
            || currentLength < previousLength && cursorPosition - 1 >= data.cursorPosition) {
                const lengthDifference = currentLength - previousLength
                content.setSelectionRange(cursorPosition + lengthDifference, cursorPosition + lengthDifference)
            } 
            else {
                content.setSelectionRange(cursorPosition, cursorPosition)
            } 
            // Cleanup socket when component unmounts             
        })
    }, [user, blog_id])

    
    const handleSubmit = async (e) => {
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
                id="content"
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />
            <button>Save</button>
        </form>
    )
}

export default Edit