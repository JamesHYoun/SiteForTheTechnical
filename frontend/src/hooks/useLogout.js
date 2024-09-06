import { useAuthContext } from './useAuthContext'
import { useBlogsContext } from './useBlogsContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: blogsDispatch } = useBlogsContext()
    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
        blogsDispatch({type: 'SET_BLOGS', payload: null})
    }
    return {logout}
}