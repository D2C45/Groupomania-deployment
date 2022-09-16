import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { dateFormat } from '../../utils/functions'
import UpdatePost from './UpdatePost'
import { UserContext } from '../../utils/context'
import Comment from './Comment'
import { Link } from 'react-router-dom'

const Card = ({ post }) => {
   // Information de l'utilisateur connecté
   const { userData, changes, setChanges } = useContext(UserContext)
   // Information de l'utilisateur qui a créé le post
   const [posterData, setPosterData] = useState('')
   // Toggle pour la mise à jour du post
   const [update, setUpdate] = useState(false)
   // Toggle pour ouvrir la section commentaire
   const [comment, setComment] = useState(false)

   const deletePost = () => {
      axios({
         method: 'delete',
         url: `${process.env.REACT_APP_API_URL}api/posts/${post._id}`,
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

   const likePost = () => {
      axios({
         method: 'put',
         url: `${process.env.REACT_APP_API_URL}api/posts/${post._id}/like`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
         data: { userId: userData._id },
      })
         .then((response) => {
            console.log(response)
            setChanges(!changes)
         })
         .catch(function (error) {
            console.log(error)
         })
   }

   // Récupère les informations de la personne qui a créé le post
   useEffect(() => {
      axios({
         method: 'get',
         url: `${process.env.REACT_APP_API_URL}api/user/${post.postUserId}`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            setPosterData(response.data)
         })
         .catch(function (error) {
            console.log(error)
         })
   }, [post.postUserId, changes])

   return (
      <li className="card-container">
         <div className="card-header pb10">
            <div className="card-user">
               <Link
                  to={
                     posterData._id === userData._id
                        ? '/account'
                        : `/profile?id=${posterData._id}`
                  }
               >
                  <img
                     src={
                        posterData.imageUrl === ''
                           ? require('../../assets/default-avatar.png')
                           : posterData.imageUrl
                     }
                     alt={`avatar de ${posterData.firstName} ${posterData.lastName} qui permet d'aller consulter son profil`}
                     className="avatar"
                  />
               </Link>
               <div className="card-userinfo">
                  <Link
                     to={
                        posterData._id === userData._id
                           ? '/account'
                           : `/profile?id=${posterData._id}`
                     }
                     className="author"
                  >
                     {posterData.firstName} {posterData.lastName}{' '}
                     {posterData.isAdmin && '(Admin)'}
                  </Link>
                  <p className="date">{dateFormat(post.createdAt)}</p>
               </div>
            </div>
            {(userData._id === post.postUserId || userData.isAdmin) && (
               <div className="update">
                  <button
                     onClick={() =>
                        update ? setUpdate(false) : setUpdate(true)
                     }
                     aria-label="Bouton pour éditer le post"
                  >
                     <i
                        className="fas fa-edit"
                        aria-hidden="true"
                        title="Editer"
                     ></i>
                  </button>
                  <button
                     onClick={deletePost}
                     aria-label="Bouton pour supprimer le post"
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
            <div className="card-body">
               <p className="pb10">{post.message}</p>
               <div className="pb10">
                  {post.imageUrl ? (
                     <img
                        src={post.imageUrl}
                        alt="illustration du post"
                        className="post-picture"
                     />
                  ) : null}
               </div>
            </div>
         ) : (
            <UpdatePost post={post} setUpdate={setUpdate} />
         )}

         <div className="card-footer">
            <div className="btn-like-container">
               <button
                  className="footer-btn"
                  onClick={likePost}
                  aria-label="Bouton pour aimer le post"
               >
                  {post.likersId.includes(userData._id) ? (
                     <i
                        className="fas fa-heart orange"
                        aria-hidden="true"
                        title="Like"
                     ></i>
                  ) : (
                     <i
                        className="far fa-heart"
                        aria-hidden="true"
                        title="Like"
                     ></i>
                  )}
               </button>
               <p>{post.likersId.length}</p>
            </div>

            <div className="btn-comment-container">
               <button
                  className="footer-btn"
                  onClick={() => setComment(!comment)}
                  aria-label="Bouton pour commenter le post et voir les commentaires"
               >
                  <i
                     className="far fa-comment"
                     aria-hidden="true"
                     title="Commentaire"
                  ></i>
               </button>
               <p>{post.comments.length}</p>
            </div>
         </div>
         {comment ? (
            <Comment post={post} changes={changes} setChanges={setChanges} />
         ) : null}
      </li>
   )
}

export default Card
