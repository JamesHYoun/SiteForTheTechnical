import { createContext, useReducer, useEffect } from 'react'


export const MyBlogContext = createContext()

export const myBlogReducer = (state, action) => {
    switch(action.type) {
        case 'SET_BLOGS':
            return {
                myBlogs: action.payload
            }
        case 'CREATE_BLOG':
            return {
                myBlogs: [action.payload, ...state.myBlogs]
            }
        case 'DELETE_BLOG':
            return {
                myBlogs: state.myBlogs.filter((b) => b._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const MyBlogContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(myBlogReducer, {
        myBlogs: null
    })
    return (
        <MyBlogContext.Provider value={{...state, dispatch}}>
            {children}
        </MyBlogContext.Provider>
    )
}