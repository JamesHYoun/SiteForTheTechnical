import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext }  from './hooks/useAuthContext'

import Home from './pages/Home'
import Blogs from './pages/Blogs'
import MyBlogs from './pages/MyBlogs'
import Edit from './pages/Edit'
import Create from './pages/Create'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import NotFound from './pages/NotFound'

function App() {
  const { user } = useAuthContext()
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
              element={<Home />}
            />
            <Route 
              path="/login"
              element={<Login />}
            />
            <Route 
              path="/signup"
              element={<Signup />}
            />
            <Route 
              path="/blogs"
              element={<Blogs />}
            />
            <Route 
              path="/my-blogs"
              element={<MyBlogs />}
            />
            <Route 
              path="/my-blogs/edit/:id" 
              element={<Edit />} 
            />
            <Route 
              path="/my-blogs/create"
              element={<Create />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
            {/* <Route 
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
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
