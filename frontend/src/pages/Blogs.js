import { useState, useEffect } from 'react'

import BlogDetails from '../components/BlogDetails'
import { useAuthContext } from '../hooks/useAuthContext'
import { useBlogsContext } from '../hooks/useBlogsContext'

const Blogs = () => {
    const { blogs, dispatch } = useBlogsContext()
    const { user } = useAuthContext()
    // POINT OF ERROR
    // console.log(`${user.token}`)
    useEffect(() => {
        const fetchMyBlogs = async () => {
            const response = await fetch('/api/blogs', {
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
    
    return (
        <div className="home">
            <div className="blogs">
                {blogs && blogs.map((blog) => (
                    <BlogDetails key={blog._id} blog={blog}/>
                ))}
            </div>
        </div>
    )
}

export default Blogs