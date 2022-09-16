import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import UserCard from '../components/users/UserCard'
import axios from 'axios'
import { UserContext } from '../utils/context'

const Users = () => {
   const { changes } = useContext(UserContext)

   const [users, setUsers] = useState([])
   const [posts, setPosts] = useState([])

   // Récupère tous les utilisateurs
   useEffect(() => {
      axios({
         method: 'get',
         url: `${process.env.REACT_APP_API_URL}api/user`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            setUsers(response.data)
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [changes])

   // Récupère tous les posts
   useEffect(() => {
      axios({
         method: 'get',
         url: `${process.env.REACT_APP_API_URL}api/posts`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            setPosts(response.data)
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [changes])

   return (
      <>
         <Header />
         <main>
            <ul className="posts-container">
               {users &&
                  users.map((user) => {
                     return (
                        <UserCard
                           user={user}
                           userPosts={posts.filter(
                              (post) => post.postUserId === user._id
                           )}
                           key={user._id}
                        />
                     )
                  })}
            </ul>
         </main>
      </>
   )
}

export default Users
