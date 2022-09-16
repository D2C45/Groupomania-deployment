import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Error from './pages/Error'
import './styles/index.css'
import Users from './pages/Users'
import { UserContext } from './utils/context'
import Profile from './pages/Profile'
import Account from './pages/Account'

const App = () => {
   const { user } = useContext(UserContext)

   return (
      <Router>
         <Routes>
            <Route exact path="/" element={user ? <Home /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route exact path="/users" element={user ? <Users /> : <Login />} />
            <Route path="/profile" element={user ? <Profile /> : <Login />} />
            <Route
               exact
               path="/account"
               element={user ? <Account /> : <Login />}
            />
            <Route path="*" element={<Error />} />
         </Routes>
      </Router>
   )
}

export default App
