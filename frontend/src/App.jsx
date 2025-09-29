import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { userContext } from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

const App = () => {
  const { userData } = useContext(userContext);

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/login"}><Login /></Navigate>} />
      <Route path='/signup' element={userData ? <Navigate to={"/"}><Home /></Navigate> : <SignUp />} />
      <Route path='/login' element={userData ? <Navigate to={"/"}><Home /></Navigate> : <Login />} />
      <Route path='/network' element={userData ? <Network /> : <Login />} />
      <Route path='/profile' element={userData ? <Profile /> : <Login />} />
      <Route path='/notification' element={userData ? <Notification /> : <Login />} />
    </Routes>
  )
}

export default App