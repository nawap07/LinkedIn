import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthContext from './context/AuthContext.jsx'
import { Toaster } from "react-hot-toast"
import UserContext from './context/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContext>
      <Toaster />
      <UserContext>
        <App />
      </UserContext>
    </AuthContext>
  </BrowserRouter>
)
