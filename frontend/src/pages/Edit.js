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
    }, [user]); // Empty dependency array means this runs once when the component mounts

    useEffect(() => {
        const titleRef = document.getElementById('title')
        const authorRef = document.getElementById('author')
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
                setTitle(data.title)
                titleRef.value = data.title
                setAuthor(data.author)
                authorRef.value = data.author
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
                title: titleRef.value,
                author: authorRef.value,
                content: contentRef.value
            });
        });
        socket.on('noClient', () => {
            console.log('ENTERED noClient')
            const fetchMyBlogs = async () => {
                const response = await fetch('/api/my-blogs/' + blogId, {
                    method: 'GET', // Specify the method
                    headers: {
                        'Content-Type': 'application/json', // Set the appropriate content type
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                setTitle(json.title)
                setAuthor(json.author)
                setContent(json.content)
            } 
            if (user) {
                fetchMyBlogs()
            }
        });
        titleRef.addEventListener('input', event => {
            socket.emit('writing', {
                blogId: blogId,
                message: {
                    type: 'input,title',
                    title: titleRef.value,
                    cursorPositionTitle: titleRef.selectionStart,
                }

            })
        })
        authorRef.addEventListener('input', event => {
            socket.emit('writing', {
                blogId: blogId,
                message: {
                    type: 'input,author',
                    author: authorRef.value,
                    cursorPositionAuthor: authorRef.selectionStart,
                }

            })
        })
        contentRef.addEventListener('input', event => {
            socket.emit('writing', {
                blogId: blogId,
                message: {
                    type: 'input,content',
                    content: contentRef.value,
                    cursorPositionContent: contentRef.selectionStart,
                }

            })
        })
        socket.on('message', (data) => {
            const types = data.type.split(',')
            if (types[1] === 'title') {
                const cursorPositionTitle = titleRef.selectionStart
                const previousLengthTitle = titleRef.value.length 
                setTitle(data.title)
                titleRef.value = data.title  
                const currentLengthTitle = titleRef.value.length
                if (currentLengthTitle > previousLengthTitle && cursorPositionTitle + 1 >= data.cursorPositionTitle 
                || currentLengthTitle < previousLengthTitle && cursorPositionTitle - 1 >= data.cursorPositionTitle) {
                    const lengthDifference = currentLengthTitle - previousLengthTitle
                    titleRef.setSelectionRange(cursorPositionTitle + lengthDifference, cursorPositionTitle + lengthDifference)
                } 
                else {
                    titleRef.setSelectionRange(cursorPositionTitle, cursorPositionTitle)
                } 
            }
            else if (types[1] === 'author') {
                const cursorPositionAuthor = authorRef.selectionStart
                const previousLengthAuthor = authorRef.value.length 
                setAuthor(data.author)
                authorRef.value = data.author  
                const currentLengthAuthor = authorRef.value.length
                if (currentLengthAuthor > previousLengthAuthor && cursorPositionAuthor + 1 >= data.cursorPositionAuthor 
                || currentLengthAuthor < previousLengthAuthor && cursorPositionAuthor - 1 >= data.cursorPositionAuthor) {
                    const lengthDifference = currentLengthAuthor - previousLengthAuthor
                    authorRef.setSelectionRange(cursorPositionAuthor + lengthDifference, cursorPositionAuthor + lengthDifference)
                } 
                else {
                    authorRef.setSelectionRange(cursorPositionAuthor, cursorPositionAuthor)
                } 
            }
            else if (types[1] === 'content') {
                const cursorPositionContent = contentRef.selectionStart
                const previousLengthContent = contentRef.value.length 
                setContent(data.content)
                contentRef.value = data.content
                const currentLengthContent = contentRef.value.length
                if (currentLengthContent > previousLengthContent && cursorPositionContent + 1 >= data.cursorPositionContent 
                || currentLengthContent < previousLengthContent && cursorPositionContent - 1 >= data.cursorPositionContent) {
                    const lengthDifference = currentLengthContent - previousLengthContent
                    contentRef.setSelectionRange(cursorPositionContent + lengthDifference, cursorPositionContent + lengthDifference)
                } 
                else {
                    contentRef.setSelectionRange(cursorPositionContent, cursorPositionContent)
                } 
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
        const response = await fetch('/api/my-blogs/' + blogId, {
            method: 'PUT',
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
            setError(null)
            dispatch({type: 'UPDATE_BLOG', payload: json})
            console.log('new blog added')
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new blog</h3>
            <label>Title:</label>
            <input
                id="title"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label>Author:</label>
            <input
                id="author"
                type="text"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
            />
            <label>Content:</label>
            <input
                id="content"
                type="text"
                onChange={(e) => { setContent(e.target.value)}}
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