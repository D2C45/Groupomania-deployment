import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('auth')))
   const [userData, setUserData] = useState({})
   // switch pour relancer les requêtes si il ya des changements
   const [changes, setChanges] = useState(false)

   useEffect(() => {
      if (JSON.parse(localStorage.getItem('auth')) !== null) {
         axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/${user.userId}`,
            withCredentials: true,
            headers: {
               Authorization: `Bearer ${user.token}`,
            },
         })
            .then((response) => {
               setUserData(response.data)
            })
            .catch(function (error) {
               console.log(error)
               localStorage.setItem('auth', null)
               setUser(null)
            })
      }
   }, [user, changes])

   const login = (auth) => {
      localStorage.setItem('auth', JSON.stringify(auth))
      setUser(auth)
   }

   const logout = () => {
      localStorage.removeItem('auth')
      setUser(null)
   }

   return (
      <UserContext.Provider
         value={{
            user,
            userData,
            login,
            logout,
            changes,
            setChanges,
         }}
      >
         {children}
      </UserContext.Provider>
   )
}
