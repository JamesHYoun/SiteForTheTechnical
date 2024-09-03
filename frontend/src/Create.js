import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const Create = () => {

    return (
        <div>
            <h1>Blogs</h1>
            <form action="/blogs" method="POST">
                <label for="title:">Title:</label>
                <input type="text" name="title" />
                <label for="author:">Author:</label>
                <input type="text" name="author" />
                <label for="content:">Content:</label>
                <input id="content" type="text" name="content" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}