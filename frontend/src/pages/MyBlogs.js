import { useState, useEffect } from 'react'

import BlogDetails from '../components/BlogDetails'

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchMyBlogs = async () => {
        const response = await fetch('http://localhost:3000/my-blogs', {
            method: 'GET', // Specify the method
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type
                'user_id': '66d75d793bd05c79b28aa047'
            }
        })
        console.log(response)
        const json = await response.json()
        console.log(json)
        setBlogs(json)
    } 
    useEffect(() => {
        fetchMyBlogs();
    }, []); // Empty dependency array means this runs once when the component mounts
    
    return (
        <div>
            <BlogDetails value={blogs}/>
        </div>
    )
}

export default MyBlogs