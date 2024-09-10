import { useState, useEffect } from "react"
import { useMyBlogsContext } from "../hooks/useMyBlogsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { io } from 'socket.io-client'; // Import socket.io-client


const Edit = () => {
    const { id: blogId } = useParams()
    const { dispatch } = useMyBlogsContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const contentRef = document.getElementById('content')

        const socket = io('http://192.168.0.7:3000')
        // io.on("connection", (socket) => {
        //     socket.emit("joinRoom", blogId)
        //     socket.on("joinRoom", (blogId) => {
        //         socket.join(blogId);
        //     });
        console.log('ANOTHER SOCKET')
        socket.on('connect', () => {
            socket.emit("joinRoom", blogId)
            socket.emit('requestData', { blogId, socketId: socket.id })
            socket.on('receiveData', (data) => {
                setContent(data.content)
                contentRef.value = data.content
                // Do something with the received data
            });
        })
        // socket.emit("joinRoom", blogId)
        // socket.emit('requestData', {blogId, socketId: socket.id});

        socket.on('sendData', (data) => {
            const requesterId = data.requesterId;
        
            // Send the data back to the server to forward to the requester
            socket.emit('sendData', {
                requesterId: requesterId,
                content: contentRef.value
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
        contentRef.addEventListener('input', event => {
            socket.emit('writing', {
                blogId: blogId,
                message: {
                    type: 'input',
                    content: contentRef.value,
                    cursorPosition: contentRef.selectionStart
                }

            })
        })
        socket.on('message', (data) => {
            console.log('content: ', content)
            // const contentRef = document.getElementById('content')
            const cursorPosition = contentRef.selectionStart
            const previousLength = contentRef.value.length        
            setContent(data.content)
            contentRef.value = data.content
            const currentLength = contentRef.value.length
    
            if (currentLength > previousLength && cursorPosition + 1 >= data.cursorPosition 
            || currentLength < previousLength && cursorPosition - 1 >= data.cursorPosition) {
                const lengthDifference = currentLength - previousLength
                contentRef.setSelectionRange(cursorPosition + lengthDifference, cursorPosition + lengthDifference)
            } 
            else {
                contentRef.setSelectionRange(cursorPosition, cursorPosition)
            } 
        })
        

        return () => {
            console.log('Disconnecting socket...')
            socket.disconnect()
        }
    }, [user, blogId])




    
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
                onChange={(e) => {
                    console.log('e content: ', e.target.value); setContent(e.target.value)}}
                value={content}
            />
            <button>Save</button>
        </form>
    )
}

export default Edit




// useEffect(() => {
//     const contentRef = document.getElementById('content')

//     const socket = io('http://localhost:3000')
//     socket.emit("joinRoom", blogId)

//     console.log('REACHED requestData')
//     socket.emit('requestData', blogId);
//     socket.on('receiveData', (data) => {
//         console.log('SHOULD NOT ENTER')
//         setContent(data.content)
//         // Do something with the received data
//     });
//     socket.on('sendData', (data) => {
//         const requesterId = data.requesterId;
    
//         // Send the data back to the server to forward to the requester
//         socket.emit('sendData', {
//             requesterId: requesterId,
//             content: content
//         });
//     });
//     socket.on('noClient', () => {
//         console.log('SHOULD ENTER')
//         const fetchMyBlogs = async () => {
//             const response = await fetch('/api/my-blogs', {
//                 method: 'GET', // Specify the method
//                 headers: {
//                     'Content-Type': 'application/json', // Set the appropriate content type
//                     'Authorization': `Bearer ${user.token}`
//                 }
//             })
//             const json = await response.json()
//             if (response.ok) {
//                 dispatch({type: 'SET_BLOGS', payload: json})
//             }
//         } 
//         if (user) {
//             fetchMyBlogs()
//         }
//     });
//     contentRef.addEventListener('input', event => {
//         console.log('ENTERED eventlistener')
//         socket.emit('writing', {
//             blogId: blogId,
//             message: {
//                 type: 'input',
//                 content: content,
//                 cursorPosition: contentRef.selectionStart
//             }

//         })
//     })
//     socket.on('message', (data) => {
//         console.log('content: ', content)
//         // const contentRef = document.getElementById('content')
//         const cursorPosition = contentRef.selectionStart
//         const previousLength = contentRef.value.length        
//         setContent(data.content)
//         const currentLength = contentRef.value.length

//         if (currentLength > previousLength && cursorPosition + 1 >= data.cursorPosition 
//         || currentLength < previousLength && cursorPosition - 1 >= data.cursorPosition) {
//             const lengthDifference = currentLength - previousLength
//             contentRef.setSelectionRange(cursorPosition + lengthDifference, cursorPosition + lengthDifference)
//         } 
//         else {
//             contentRef.setSelectionRange(cursorPosition, cursorPosition)
//         } 
//         const handleVisibilityChange = () => {
//             if (document.hidden) {
//                 // Disconnect the socket when the page is hidden
//                 socket.disconnect();
//                 console.log('Socket disconnected due to page being hidden');
//             } else {
//                 // Reconnect the socket when the page becomes visible
//                 if (!socket.connected) {
//                     socket.connect();
//                     console.log('Socket reconnected');
//                 }
//             }
//         };
//         document.addEventListener('visibilitychange', handleVisibilityChange);
//         // // Cleanup socket when component unmounts   
        
        
//         // const selection = window.getSelection()
//         // cursorElement.style.left = calculateCursorPosition(data.cursorPosition) + 'px';

//         // if (selection.isCollapsed) { // Selection is just a cursor
//         //     cursorPosition = selection.anchorOffset; // Position within the text node
//         //     console.log('Cursor position:', cursorPosition);
//         // }
//     })
// }, [user, blogId])


// const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!user) {
//         setError('You must be loggined in')
//         return
//     }
//     const blog = {title, author, content}
//     const response = await fetch('/api/my-blogs', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(blog)
//     })
//     const json = await response.json()
//     if (!response.ok) {
//         setError(json.error)
//     } else {
//         setTitle('')
//         setAuthor('')
//         setContent('')
//         setError(null)
//         dispatch({type: 'CREATE_BLOG', payload: json})
//         console.log('new blog added')
//     }
// }