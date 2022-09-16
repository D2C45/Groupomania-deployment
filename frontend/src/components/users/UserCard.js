import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../utils/context'
import { dateFormat } from '../../utils/functions'
import { Link } from 'react-router-dom'
import axios from 'axios'
import UpdateProfile from './UpdateProfile'

const UserCard = ({ user, userPosts }) => {
   const { userData, changes, setChanges, logout } = useContext(UserContext)

   const [picture, setPicture] = useState(user.imageUrl)
   const [file, setFile] = useState('')
   const [update, setUpdate] = useState(false)

   // ref pour pouvoir vider le fichier uploader
   const ref = useRef()

   const handlePicture = () => {
      setPicture(user.imageUrl)
   }

   const deleteUser = () => {
      // suppression de tous les posts de l'utilisateur supprimé
      for (let post of userPosts) {
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
      // suppression de l'utilisateur
      axios({
         method: 'delete',
         url: `${process.env.REACT_APP_API_URL}api/user/${user._id}`,
         withCredentials: true,
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('auth')).token
            }`,
         },
      })
         .then((response) => {
            console.log(response)
            // localStorage.removeItem('auth')
            !userData.isAdmin && logout()
            setChanges(!changes)
         })
         .catch(function (error) {
            console.log(error)
         })
   }

   const deletePicture = () => {
      setPicture('')
      if (ref.current) ref.current.value = ''
      setFile('')
   }

   const cancelModifications = () => {
      setPicture(user.imageUrl)
      setUpdate(false)
   }

   useEffect(handlePicture, [user.imageUrl])

   return (
      <li className="card-container user-card">
         {!update ? (
            <Link
               to={
                  user._id === userData._id
                     ? '/account'
                     : `/profile?id=${user._id}`
               }
               className="delete-picture-container"
            >
               <img
                  src={
                     picture === ''
                        ? require('../../assets/default-avatar.png')
                        : picture
                  }
                  alt={`avatar de ${user.firstName} ${user.lastName} qui permet d'aller consulter son profil`}
                  className="avatar avatar-lg"
               />
            </Link>
         ) : (
            <div className="delete-picture-container">
               <img
                  src={
                     picture === ''
                        ? require('../../assets/default-avatar.png')
                        : picture
                  }
                  alt="avatar de la personne"
                  className="avatar avatar-lg"
               />
               {update && picture !== '' && (
                  <div>
                     <button
                        onClick={deletePicture}
                        aria-label="Bouton pour supprimer la photo"
                     >
                        <i
                           className="far fa-times-circle"
                           aria-hidden="true"
                           title="Supprimer"
                        ></i>
                     </button>
                  </div>
               )}
            </div>
         )}

         <div className="usercard-header">
            <div className="card-header card-user pb10">
               <div className="card-userinfo">
                  {!update ? (
                     <Link
                        to={
                           user._id === userData._id
                              ? '/account'
                              : `/profile?id=${user._id}`
                        }
                        className="author"
                     >
                        {user.firstName} {user.lastName}{' '}
                        {user.isAdmin && '(Admin)'}
                     </Link>
                  ) : (
                     <div className="author">
                        {user.firstName} {user.lastName}{' '}
                        {user.isAdmin && '(Admin)'}
                     </div>
                  )}
                  <p className="date">
                     Inscript depuis le {dateFormat(user.createdAt)}
                  </p>
               </div>
               {(user._id === userData._id || userData.isAdmin) && (
                  <div className="update">
                     <button
                        onClick={() =>
                           update ? cancelModifications() : setUpdate(true)
                        }
                        aria-label="Bouton pour éditer le profil"
                     >
                        <i
                           className="fas fa-edit"
                           aria-hidden="true"
                           title="Editer"
                        ></i>
                     </button>
                     <button
                        onClick={deleteUser}
                        aria-label="Bouton pour supprimer le profil"
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
            {!update && user.description !== '' && (
               <p className="user-description">{user.description}</p>
            )}
            {update && (
               <UpdateProfile
                  user={user}
                  setUpdate={setUpdate}
                  picture={picture}
                  setPicture={setPicture}
                  file={file}
                  setFile={setFile}
                  cancelModifications={cancelModifications}
               />
            )}
         </div>
      </li>
   )
}

export default UserCard
