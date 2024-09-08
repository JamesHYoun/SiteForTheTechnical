import { MyBlogContext } from '../context/MyBlogContext'
import { useContext } from 'react'


export const useMyBlogsContext = () => {
    const context = useContext(MyBlogContext)
    if (!context) {
        throw Error('useMyBlogsContext must be used inside an MyBlogsContextProvider')
    }
    return context
}