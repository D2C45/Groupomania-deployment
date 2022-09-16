import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import Card from '../components/home/Card'
import Newpost from '../components/home/Newpost'
import axios from 'axios'
import { UserContext } from '../utils/context'

const Home = () => {
   const { changes } = useContext(UserContext)

   const [posts, setPosts] = useState([])

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
         <section>
            <Newpost />
         </section>
         <main>
            <ul className="posts-container">
               {posts &&
                  posts.map((post) => {
                     return <Card post={post} key={post._id} />
                  })}
            </ul>
         </main>
      </>
   )
}

export default Home
