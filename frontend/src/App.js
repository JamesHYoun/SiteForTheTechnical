import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Create from './pages/Create'
import MyBlogs from './pages/MyBlogs'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
            <Route 
              path="/create"
              element={<Create />}
            />
            <Route 
              path="/my-blogs"
              element={<MyBlogs />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
