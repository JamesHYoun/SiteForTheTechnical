import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext }  from './hooks/useAuthContext'

import Home from './pages/Home'
import Blogs from './pages/Blogs'
import MyBlogs from './pages/MyBlogs'
import Create from './pages/Create'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthContext()
  console.log(user)
  // if (!user) {
  //   return <div>Loading...</div> // Show a loading state while fetching user
  // }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={user ? <Home /> : <Navigate to="/login"/>}
            />
            <Route 
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route 
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route 
              path="/blogs"
              element={user ? <Blogs /> : <Navigate to="/login"/>}
            />
            <Route 
              path="/my-blogs"
              element={user ? <MyBlogs /> : <Navigate to="/login"/>}
            />
            <Route 
              path="/create"
              element={user ? <Create /> : <Navigate to="/login"/>}
            />
            {/* <Route 
              path="/create"
              element={<Create />}
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
