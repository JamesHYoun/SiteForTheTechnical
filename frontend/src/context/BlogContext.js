import { createContext, useReducer, useEffect } from 'react'


export const BlogContext = createContext()

export const blogReducer = (state, action) => {
    switch(action.type) {
        case 'SET_BLOGS':
            return {
                blogs: action.payload
            }
        default:
            return state
    }
}

export const BlogContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(blogReducer, {
        blogs: null
    })
    return (
        <BlogContext.Provider value={{...state, dispatch}}>
            {children}
        </BlogContext.Provider>
    )
}