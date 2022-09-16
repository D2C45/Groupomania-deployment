import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import UserCard from '../components/users/UserCard'
import Card from '../components/home/Card'
import { UserContext } from '../utils/context'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
   const { changes } = useContext(UserContext)
   const navigate = useNavigate()
   // variable récupérant l'url de la page (chaine de caractères)
   const currentUrlString = window.location.href
   // variable qui convertit la chaine de caractères en url
   const currentUrl = new URL(currentUrlString)
   // variable qui récupère l'id de l'url
   const profilId = currentUrl.searchParams.get('id')
   // Données de l'utilisateur
   const [user, setUser] = useState('')
   // les posts de cet utilisateur
   const [userPosts, setUserPosts] = useState()

   // Récupère les informations de l'utilisateur
   useEffect(() => {
      axios({
         method: 'get',
         url: `${process.env.REACT_APP_API_URL}api/user/${profilId}`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            setUser(response.data)
         })
         .catch(function (error) {
            console.log(error)
            navigate('/error')
         })
   }, [profilId, changes, navigate])

   // Récupère les posts de l'utilisateur
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
               response.data.filter((post) => post.postUserId === profilId)
            )
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [profilId, changes])

   return (
      <>
         <Header />
         <main>
            {user && (
               <ul className="posts-container">
                  <UserCard user={user} userPosts={userPosts} />
                  {userPosts &&
                     userPosts.map((post) => {
                        return <Card post={post} key={post._id} />
                     })}
               </ul>
            )}
         </main>
      </>
   )
}

export default Profile
