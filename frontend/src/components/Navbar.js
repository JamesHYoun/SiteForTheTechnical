import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const handleClick = () => {
        logout()
    }
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Blog Friend</h1>
                </Link>
                <Link to="/blogs">
                    <h2>Blogs</h2>
                </Link>
                <Link to="/my-blogs">
                    <h2>My Blogs</h2>
                </Link>
                <Link to="/create">
                    <h2>Create</h2>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}

                </nav>
            </div>
        </header>
    )
}

export default Navbar