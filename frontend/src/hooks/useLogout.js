import { useAuthContext } from './useAuthContext'
import { useMyBlogsContext } from './useMyBlogsContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: myBlogsDispatch } = useMyBlogsContext()
    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
        myBlogsDispatch({type: 'SET_BLOGS', payload: null})
    }
    return {logout}
}