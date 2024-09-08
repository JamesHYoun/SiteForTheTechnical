import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { BlogContextProvider } from './context/BlogContext';
import { MyBlogContextProvider } from './context/MyBlogContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BlogContextProvider>
        <MyBlogContextProvider>
          <App />
        </MyBlogContextProvider>
      </BlogContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

