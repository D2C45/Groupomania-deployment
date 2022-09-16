import React, { useContext, useEffect, useState } from 'react'
import { dateFormat } from '../../utils/functions'
import axios from 'axios'
import { UserContext } from '../../utils/context'
import { Link } from 'react-router-dom'

const CommentContent = ({ comment }) => {
   // Information de l'utilisateur connecté
   const { userData, changes, setChanges } = useContext(UserContext)
   // Toggle pour la mise à jour du commentaire
   const [update, setUpdate] = useState(false)
   // Message contenu dans le commentaire
   const [message, setMessage] = useState(comment.text)
   // Information de la personne qui a créé le commentaire
   const [commenterData, setCommenterData] = useState({})

   const deleteComment = () => {
      axios({
         method: 'patch',
         url: `${process.env.REACT_APP_API_URL}api/posts/comment/${comment._id}`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            console.log(response)
            setChanges(!changes)
         })
         .catch(function (error) {
            console.log(error)
         })
   }

   const sendCommentModifications = (e) => {
      e.preventDefault()

      const content = {
         text: message,
      }

      axios({
         method: 'put',
         url: `${process.env.REACT_APP_API_URL}api/posts/comment/${comment._id}`,
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
            setChanges(!changes)
            setUpdate(false)
         })
         .catch(function (error) {
            console.log(error)
         })
   }

   // Récupère les informations de la personne qui a créé le commentaire
   useEffect(() => {
      axios({
         method: 'get',
         url: `${process.env.REACT_APP_API_URL}api/user/${comment.commentUserId}`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            setCommenterData(response.data)
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [comment.commentUserId])

   return (
      <li className="card-container comment-container">
         <div className="card-header pb10">
            <div className="card-user">
               {commenterData ? (
                  <Link
                     to={
                        commenterData._id === userData._id
                           ? '/account'
                           : `/profile?id=${commenterData._id}`
                     }
                  >
                     <img
                        src={
                           commenterData.imageUrl === ''
                              ? require('../../assets/default-avatar.png')
                              : commenterData.imageUrl
                        }
                        alt={`avatar de ${commenterData.firstName} ${commenterData.lastName} qui a commenté et qui permet d'aller consulter son profil`}
                        className="avatar"
                     />
                  </Link>
               ) : (
                  <div>
                     <img
                        src={require('../../assets/default-avatar.png')}
                        alt="avatar par défaut car l'utilisateur qui a commenté a supprimé son compte"
                        className="avatar"
                     />
                  </div>
               )}

               <div className="card-userinfo">
                  {commenterData ? (
                     <Link
                        to={
                           commenterData._id === userData._id
                              ? '/account'
                              : `/profile?id=${commenterData._id}`
                        }
                        className="author"
                     >
                        {commenterData.firstName} {commenterData.lastName}{' '}
                        {commenterData.isAdmin && '(Admin)'}
                     </Link>
                  ) : (
                     <p className="author">Utilisateur supprimé</p>
                  )}

                  <p className="date">{dateFormat(comment.timestamp)}</p>
               </div>
            </div>
            {(userData._id === comment.commentUserId || userData.isAdmin) && (
               <div className="update">
                  <button
                     onClick={() => setUpdate(true)}
                     aria-label="Bouton pour éditer le commentaire"
                  >
                     <i
                        className="fas fa-edit"
                        aria-hidden="true"
                        title="Editer"
                     ></i>
                  </button>
                  <button
                     onClick={deleteComment}
                     aria-label="Bouton pour supprimer le commentaire"
                  >
                     <i
                        className="fas fa-trash"
                        aria-hidden="true"
                        title="Supprimer"
                     ></i>
                  </button>
               </div>
            )}
         </div>
         {!update ? (
            <p className="pb10">{message}</p>
         ) : (
            <form action="" onSubmit={(e) => sendCommentModifications(e)}>
               <textarea
                  defaultValue={message}
                  className="message message-large"
                  onChange={(e) => setMessage(e.target.value)}
               />
               <div className="newpost-footer">
                  <div>
                     <button
                        className="btn-send"
                        onClick={() => setUpdate(false)}
                     >
                        Annuler
                     </button>
                     <button className="btn-send" type="submit">
                        Envoyer
                     </button>
                  </div>
               </div>
            </form>
         )}
      </li>
   )
}

export default CommentContent
