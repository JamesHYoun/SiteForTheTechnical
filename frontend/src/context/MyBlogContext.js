import { createContext, useReducer, useEffect } from 'react'


export const MyBlogContext = createContext()

export const myBlogReducer = (state, action) => {
    console.log(state.myBlogs)
    switch(action.type) {
        case 'SET_BLOGS':
            return {
                myBlogs: action.payload
            }
        case 'CREATE_BLOG':
            return {
                myBlogs: [action.payload, ...state.myBlogs]
            }
        case 'UPDATE_BLOG':
            console.log('state: ', state)
            for (let i = 0; i < state.myBlogs.length; i++) {
                const id = state.myBlogs[i]._id
                if (id === action.payload._id) {
                    state.myBlogs[i].title = action.payload.title
                    state.myBlogs[i].author = action.payload.author
                    state.myBlogs[i].content = action.payload.content
                }
                console.log(i);
              }
            return {
                myBlogs: state.myBlogs
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