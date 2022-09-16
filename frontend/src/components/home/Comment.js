import React, { useContext, useState } from 'react'
import { UserContext } from '../../utils/context'
import CommentContent from './CommentContent'
import axios from 'axios'

const Comment = ({ post }) => {
   const { userData, changes, setChanges } = useContext(UserContext)

   const [message, setMessage] = useState('')

   const sortedCommentsByDate = post.comments.sort(
      (a, b) => b.timestamp - a.timestamp
   )

   const sendComment = (e) => {
      e.preventDefault()

      if (message) {
         const content = {
            commentUserId: JSON.parse(localStorage.getItem('auth')).userId,
            text: message,
         }

         axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_URL}api/posts/${post._id}/comment`,
            withCredentials: true,
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('auth')).token
               }`,
            },
            data: content,
         })
            .then((response) => {
               console.log(response)
               setMessage('')
               setChanges(!changes)
            })
            .catch(function (error) {
               console.log(error)
            })
      } else {
         console.log('Pas de commentaire')
      }
   }

   return (
      <div>
         <form
            className="newpost-header comment-header"
            onSubmit={(e) => sendComment(e)}
         >
            <img
               src={
                  userData.imageUrl === ''
                     ? require('../../assets/default-avatar.png')
                     : userData.imageUrl
               }
               alt="avatar de la personne connectée"
               className="avatar"
            />
            <textarea
               name={`comment ${post._id}`}
               id={`comment ${post._id}`}
               className="message"
               placeholder="Commentez..."
               maxLength={500}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
            />
            <div>
               <button
                  className="footer-btn orange"
                  type="submit"
                  aria-label="Envoyer le commentaire"
               >
                  <i
                     className="fas fa-paper-plane"
                     aria-hidden="true"
                     title="Envoyer"
                  ></i>
               </button>
            </div>
         </form>
         <ul>
            {post.comments.length !== 0 &&
               sortedCommentsByDate.map((comment) => {
                  return (
                     <CommentContent
                        comment={comment}
                        key={post._id + comment._id}
                     />
                  )
               })}
         </ul>
      </div>
   )
}

export default Comment
