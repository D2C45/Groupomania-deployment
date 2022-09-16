import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import Card from '../components/home/Card'
import UserCard from '../components/users/UserCard'
import { UserContext } from '../utils/context'
import axios from 'axios'

const Account = () => {
   // Information de l'utilisateur connecté
   const { userData, changes } = useContext(UserContext)

   // // les posts de l'utilisateur
   const [userPosts, setUserPosts] = useState()

   // // Récupère les posts de l'utilisateur
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
            setUserPosts(
               response.data.filter((post) => post.postUserId === userData._id)
            )
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [userData._id, changes])

   return (
      <>
         <Header />
         <main>
            <ul className="posts-container">
               <UserCard user={userData} userPosts={userPosts} />
               {userPosts &&
                  userPosts.map((post) => {
                     return <Card post={post} key={post._id} />
                  })}
            </ul>
         </main>
      </>
   )
}

export default Account
